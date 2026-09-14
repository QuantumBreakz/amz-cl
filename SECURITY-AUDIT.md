# Security Audit

End-to-end review of this repository. Every finding below was **reproduced**, not
inferred from reading code. Findings that were fixed during the audit are marked
with the commit that fixed them; findings left open are marked as accepted risk with
reasoning.

**Audit date:** 2026-09-14 · **Commit at audit:** `fa7e475`..`HEAD`
**Scope:** application code (`app/`, `components/`, `lib/`), build config, the agent
capture tooling in `.claude/`, and everything tracked by git (this repo is published
publicly, so committed content is in scope).

## Threat model

This is a static-catalog storefront with **no backend, no database, no server-side
sessions, and no real authentication**. There is no server-side data store to breach
and no cross-user data: every user's state lives in their own browser. That removes
most of the OWASP Top 10 by construction (no SQLi, no SSRF, no broken server-side
access control, no server-side secrets to leak).

What remains in scope, and what this audit concentrated on:

1. Client-side injection (XSS) through rendered catalog and `localStorage` data
2. Trust boundaries on `localStorage`, which is fully attacker-controlled for the user
3. The developer tooling in `.claude/`, which executes automatically and ships publicly
4. Transport/browser hardening on a deployed instance
5. Secrets or PII accidentally committed

---

## Findings

### SEC-01 — Path traversal in the capture hook · **High** · FIXED

**Where:** `.claude/capture.py`

`session_id` arrived as untrusted stdin JSON and was interpolated directly into a
filesystem path:

```python
with (LEDGER / f"{session_id}.jsonl").open("a") as fh:
```

No validation, and `Path.mkdir(parents=True)` happily created intermediate
directories. CWE-22.

**Reproduced.** Against a scratch copy of the repo:

```bash
echo '{"session_id":"../../../../PWNED","prompt":"traversal probe"}' \
  | python3 .claude/capture.py prompt
# -> wrote /tmp/PWNED.jsonl, entirely outside the repo
```

**Why it mattered.** The hook runs automatically on every prompt, its input is JSON
from a process boundary, and the script is published for others to reuse. A first
attempt using a target whose parent directory did not exist failed *silently* rather
than being blocked — the catch-all `except` swallowed the `FileNotFoundError`, which
made the flaw look non-exploitable. Re-testing against an existing parent directory
confirmed the escape.

**Fix.** Whitelist validation; anything failing it falls back to `unknown-session`.

```python
SAFE_ID = re.compile(r"^[A-Za-z0-9._-]{1,128}$")
```

Re-tested: traversal contained, real UUID session ids unaffected.

---

### SEC-02 — No security headers on deployed responses · **Medium** · FIXED

**Where:** absent `next.config.ts`

The production server returned no `Content-Security-Policy`, `X-Frame-Options`,
`X-Content-Type-Options`, `Referrer-Policy`, `Permissions-Policy` or HSTS, and
advertised `X-Powered-By: Next.js`. A deployed instance was framable (clickjacking)
and had no defence-in-depth against injected script.

**Reproduced.** `curl -sI` against `next start` showed only Next's own caching headers
plus `X-Powered-By`.

**Fix.** Added all of the above and disabled `poweredByHeader`. Verified present in
production and that all routes still return 200 under the policy.

**Deliberate limitation — CSP is production-only.** Next's dev server needs `eval()`
for React's dev tooling and a websocket for HMR. Applying CSP in dev required
`'unsafe-eval'` and a websocket allowance, which weakens the policy being tested; and
in an intermediate attempt the policy broke HMR outright. Production is what is
deployed, so the policy is scoped there. The non-CSP headers apply in both.

**Residual risk.** `script-src` and `style-src` retain `'unsafe-inline'` because Next
injects inline hydration bootstrap and the app uses inline `style` attributes for the
rating histogram bars. Removing it requires nonce-based CSP. Accepted for now; the
practical exposure is low given there is no user-generated content and no third-party
script origins are permitted at all.

---

### SEC-03 — Unvalidated order fields crash the render · **Low** · FIXED

**Where:** `components/store.tsx` hydration

Orders rehydrated from `localStorage` validated `id`, `total` and `lines`, but not
`name`, `address` or `date` — all of which are rendered directly. A crafted object in
`address` throws *"Objects are not valid as a React child"*, breaking `/orders` and
`/order-confirmation` until storage is cleared.

Self-inflicted only (an attacker must already control the victim's `localStorage`), so
severity is low — but it is a real client-side denial of service and the fix is one
line per field. Now type-checked alongside the existing fields.

---

### SEC-04 — Agent capture hooks execute automatically on clone · **Informational** · ACCEPTED, documented

`.claude/settings.json` registers hooks that run `python3 .claude/capture.py` on every
prompt and every turn end. Anyone who clones this repository and opens it in Claude
Code will execute that script automatically.

The script here is auditable and does only local file appends — but the *pattern*
deserves flagging, because a checked-in agent config is an execution vector and readers
should know to review `.claude/` before opening any repo in an agent.

Not "fixed", because automatic execution is the required behaviour: the assignment
specifies capture must fire on its own. Mitigation is transparency — the script is
short, dependency-free, reads only stdin and the transcript path it is given, and
writes only under `.agent-logs/`.

---

### SEC-05 — Published conversation log · **Informational** · ACCEPTED

`.agent-logs/` is committed deliberately and published. It contains the full prompt
and response text of the build session.

**Scanned and clean:**

| Check | Result |
|---|---|
| API keys / tokens / private keys in tracked files | none |
| Email addresses in tracked files | none |
| Absolute local paths leaked | 1 (`/Users/aliahmed/Desktop/Amazon-Clone/README.md` — a path, no secret) |
| `.env*` tracked | none (git-ignored) |

The git **commit metadata** does carry the author's email (`git log --format='%ae'`),
which is normal for any public repo but worth stating explicitly since the author may
not have considered it when making the repo public.

---

## Checks performed that found nothing

Recording these so the negative results are auditable too.

| Area | Method | Result |
|---|---|---|
| Dependency vulnerabilities | `npm audit --omit=dev` | **0 vulnerabilities** |
| XSS via `dangerouslySetInnerHTML` / `innerHTML` / `eval` / `document.write` | grep across `app/`, `components/`, `lib/` | none present |
| Credential storage | grep for `password` handling | held in component state only; **never** written to `localStorage` or any store |
| Cart tampering via `localStorage` | reviewed `lib/commerce.ts` `validCart` | every line re-validated against the catalog; quantities clamped to `[0, stockQuantity]`; unknown ids dropped |
| Price tampering | reviewed `subtotalCents` | prices are always read from the local catalog, never from persisted state — a forged price in `localStorage` cannot affect totals |
| Saved-items tampering | reviewed hydration | filtered to ids that exist in the catalog |
| Broken links / dead routes | crawled 285 unique internal links | 0 non-200 |
| Open redirect | reviewed all `href` construction | all internal, built via `searchUrl`/`productUrl` with `encodeURIComponent` |
| Framework currency | `next@16.3.5`, React 19 | current |

## Not applicable by design

No server-side auth, sessions, CSRF-able state-changing endpoints, file uploads, SQL,
server-side secrets, or PII processing. Checkout is a demo: it never collects or
transmits payment details, and orders exist only in the user's own browser.

## If this became a real storefront

The findings above are scoped to what this codebase actually is. Turning it into a
production commerce app would introduce the entire server-side surface this audit
found absent — real authentication and session management, server-side price and
inventory authority (never trusting client totals), CSRF protection on mutations,
rate limiting, PCI-scoped payment handling, and per-user access control on orders.
None of that exists here, which is correct for a demo but must not be mistaken for
having been secured.
