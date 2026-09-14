# Security audit

**Last verified:** 2026-09-15
**Scope:** Next.js application, `/api/v1`, `packages/backend`, persistence adapter,
browser state, build configuration, agent capture hooks, dependencies, and shipped
content.

This is a technical commerce demo with a real application backend and deliberately fake
fulfilment. It stores accounts, password digests, sessions, carts, wishlists, profile
preferences, and demo orders. It never asks for card details and does not connect to a
payment processor, carrier, Amazon service, analytics service, or advertising network.

## Threat model

The relevant boundaries are:

1. JSON bodies, query strings, path parameters, cookies, and persisted JSON entering the
   backend.
2. Guest and authenticated actors attempting to cross-read commerce state.
3. Credential and session material at rest and in browser cookies.
4. Cross-origin requests attempting to mutate cookie-authenticated state.
5. Catalog or stored text rendered by React.
6. `.claude/` hooks that execute automatically in supported agent environments.
7. Public deployment of third-party brand assets.

## Current controls

### Authentication and sessions

- Passwords are normalized only where appropriate, then salted with 16 random bytes and
  hashed using Node `scrypt` to 64 bytes. Plaintext is never persisted.
- Login uses `timingSafeEqual` for equal-length hash comparisons and returns one generic
  `INVALID_CREDENTIALS` response.
- Session tokens use 32 random bytes. Only a SHA-256 token digest is stored.
- Session and guest cookies are `HttpOnly`, `SameSite=Lax`, scoped to `/`, and `Secure`
  in production. Authenticated sessions expire after seven days.
- Logout deletes the current stored session digest and expires the cookie.

### Authorization and integrity

- Guest and user IDs become server-side actor namespaces. Carts, wishlists, profiles,
  idempotency keys, and orders are always read through the resolved actor.
- Order detail returns 404 for an absent order and for another actor's order, avoiding an
  order-existence oracle.
- Product existence, stock caps, unit prices, and totals come from the server catalog.
  Client-provided prices and totals are never accepted.
- Orders snapshot unit prices, compute with integer cents, clear the cart, and record an
  actor-scoped idempotency key in the same synchronous mutation.
- Registering or logging in merges the current guest record into the user record and
  deletes that guest state.

### Request handling

- Mutations reject a foreign `Origin`. Host and protocol are derived from forwarded
  headers when present, so the guard works behind a reverse proxy.
- JSON handlers require `application/json`; invalid or non-object bodies are rejected.
- Strings have explicit length bounds. Emails, quantities, pagination, and product IDs
  are validated before domain mutations.
- Errors use stable public codes and messages. Unexpected exceptions are converted to a
  generic `INTERNAL_ERROR`; no stack trace or local path is returned.
- API responses set `Cache-Control: no-store`.

### Browser and transport hardening

`next.config.ts` disables `X-Powered-By` and sends Content Security Policy in production,
plus `X-Frame-Options`, `X-Content-Type-Options`, `Referrer-Policy`,
`Permissions-Policy`, and HSTS. CSP is production-only because the Next.js development
runtime needs eval and a websocket for HMR. React renders all catalog and stored strings
through normal escaped JSX; no `dangerouslySetInnerHTML`, `innerHTML`, `eval`, or
`document.write` sink exists in application source.

## Findings

### SEC-01 — Path traversal in capture hook · High · resolved

`.claude/capture.py` formerly interpolated the untrusted `session_id` into a ledger path.
A value containing `../../` could escape `.agent-logs/.ledger/`. The current
`safe_session_id()` allowlists `A-Za-z0-9._-`, caps length at 128, and replaces invalid
values with `unknown-session`. Reproduction against a scratch tree confirmed the old
escape and the current containment.

### SEC-02 — Missing response hardening headers · Medium · resolved

The application originally sent only Next.js defaults. `next.config.ts` now sends the
headers listed above and disables the framework banner. Production CSP still allows
inline scripts/styles because Next hydration and the rating histogram use them. Moving
to nonce-based CSP would reduce this residual exposure.

### SEC-03 — Same-origin guard disagreed with reverse-proxy host · Medium · resolved

The first browser backend run compared `Origin` with `request.nextUrl.origin`. Next's
internal URL used `localhost` while the visible test host was `127.0.0.1`, rejecting a
legitimate cart mutation with 403. The guard now compares the browser origin against
`x-forwarded-host`/`host` and `x-forwarded-proto`/request protocol. The Playwright
purchase journey reproduces the proxy-shaped path and now passes.

### SEC-04 — JSON persistence is not distributed · Medium · accepted demo limit

`BackendDatabase` writes a mode-0600 temporary file and atomically renames it, which
prevents partial files in one process. It has no cross-process transaction lock,
replication, backup, or durable serverless storage. Vercel falls back to `/tmp`, which is
ephemeral and instance-local. A multi-instance or durable public deployment must replace
this adapter with a transactional database and shared session store.

### SEC-05 — No authentication abuse controls · Medium · accepted demo limit

Registration and login validate input and protect stored credentials, but there is no
IP/account rate limit, lockout, email verification, password reset, MFA, breached-password
screening, or session-management UI. These are required before treating the demo account
system as an internet-facing identity service.

### SEC-06 — Agent capture hooks execute automatically · Informational · accepted

`.claude/settings.json` registers prompt and stop hooks that run `.claude/capture.py`.
Automatic capture is intentional for the assignment, and the script is short,
dependency-free, and limited to local ledger writes. Anyone cloning the repository
should still review checked-in agent hooks before opening it in an agent runtime.

### SEC-07 — Published conversation log · Informational · accepted

`.agent-logs/` is committed intentionally. Secret-pattern scans found no API keys,
tokens, private keys, or `.env` files. The logs disclose the repository's local username
and path; git commit metadata also carries the configured author email, as in normal
public repositories.

## Verification

| Area | Evidence |
|---|---|
| Credential storage | service tests inspect records and confirm plaintext is absent |
| Session behavior | service and route tests cover login, logout, expiry resolution, and independent sessions |
| Actor isolation | guest state and order ownership tests use separate cookie jars |
| Server authority | tests clamp stock, reject unknown products, and assert order totals from catalog prices |
| Retry safety | repeated checkout idempotency key returns one order |
| HTTP handling | route tests cover cookies, validation, status codes, and response composition |
| UI/API integration | Playwright covers guest cart → register → reload → checkout → orders → API state |
| Injection sinks | source scan found no raw HTML/script execution sink |
| Runtime dependencies | `npm audit --omit=dev` reports zero vulnerabilities at verification time |
| Production compilation | `npm run build` verifies route handlers and security configuration |

## Deployment and content posture

The catalog previously used real third-party brand names, copyrighted Amazon product
photography, and Amazon campaign artwork for visual-fidelity development. Those names
and images were replaced with generic copy and original artwork. The deployed build does
not include `public/assets/reference/` or `lib/reference-assets.json`, and production
configuration fails if the retired directory, mapping, Amazon CDN host, or reference path
returns. Historical URLs remain only in `docs/reference-assets.json` with
`"shipped": false`.

Three logo/favicon files retain MIT-licensed codebase material documented in
`docs/MartsTech-LICENSE.txt`. An MIT code license does not grant trademark rights. Before
commercial use, replace or license the Amazon wordmark and trade dress as well as any
remaining Amazon names in interface copy. The specific risk is trademark presentation
and copyrighted brand creative; the specific fix is to remove or replace those assets
before public commercial deployment.

For a durable public service, the remaining engineering work is also concrete: replace
the JSON adapter, add database migrations and backups, rate-limit authentication, add
email verification and password recovery, rotate and revoke sessions from an account
screen, add structured audit logs and monitoring, and review CSP with nonces. Payment
processing remains out of scope; if added, use a hosted PCI-compliant provider flow and
never accept client-calculated totals.
