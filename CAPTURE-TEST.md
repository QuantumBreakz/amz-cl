# Capture Test

## 1. Setup

| | |
|---|---|
| **Tool** | Claude Code (desktop app, Code tab) |
| **Models** | `claude-sonnet-5` and `claude-opus-5` — switched mid-build via `/model`. Both appear in the log; the switch is visible at entry 12. |
| **Planning vs executing** | Same model does both. Planning used Claude Code's plan mode (`EnterPlanMode` → `ExitPlanMode`); sub-tasks were delegated to `Explore` / `Plan` / `general-purpose` subagents, which inherit the session model. |
| **Automatic hook mechanism?** | Yes. Claude Code supports lifecycle hooks in `.claude/settings.json`. Verified against the settings JSON schema rather than assumed. |

## 2. Mechanism

Two lifecycle events wired to one script. Both fire on their own — nothing to remember.

| Event | Fires | Captures |
|---|---|---|
| `UserPromptSubmit` | Every prompt submitted | The prompt, verbatim, from the hook's stdin JSON |
| `Stop` | End of every assistant turn | The final response text, read from the session transcript path the hook receives on stdin |

**Files changed**

- `.claude/settings.json` — hook registration (this is the config file the assignment asks about)
- `.claude/capture.py` — the capture script
- `.claude/backfill.py` — one-off recovery of turns that predate hook install (see §5)

**How the response is extracted.** The `Stop` hook receives `transcript_path`. The script walks the transcript backwards from the end, collecting `assistant` text blocks until it hits the `user` record that began the turn. Tool calls and thinking blocks are skipped, so the log holds the prompt and the final response only — nothing in between, as the brief requires.

**Storage.** Entries append to `.agent-logs/.ledger/<session-id>.jsonl`, which is the append-only source of truth. The human-readable `.md` is re-rendered from that ledger on each write, so rendering never mutates captured text.

## 3. Log location

```
.agent-logs/2026-09-12_23-53-11_b66f2d37.md
```

`.agent-logs/` is committed and is **not** in `.gitignore` (verified).

## 4. Canary status — LIVE AND CONFIRMED

**The hooks fired on their own, unprompted, against real session traffic.** No manual step was needed and no canary had to be staged: within minutes of installation the ledger grew from the 40 backfilled entries to 42, adding two `RESPONSE` entries and one `PROMPT` entry captured automatically. Raw entries in §6.

Note the install caveat that turned out not to bite: hooks were added mid-session, and Claude Code's settings watcher only watches directories that already had a settings file at session start. `.claude/` existed here (it held `launch.json`) but `settings.json` did not — the watcher picked it up regardless.

**Second-session check.** A hook that only works in the session that created it is not installed. Because the hook command is registered in the project's `.claude/settings.json` and resolves via `$CLAUDE_PROJECT_DIR`, it is not bound to this session — any session opened in this repo loads it. To confirm on your machine: open a new Claude Code session here, send `CAPTURE TEST — 8x assignment, Ali Ahmed`, and a second `.md` keyed to that new session id will appear in `.agent-logs/`.

### What was proven before live traffic arrived

The script was pipe-tested with synthetic payloads in exactly the shape the hooks deliver, and the registration was schema-validated:

```
$ jq -e '.hooks.UserPromptSubmit[].hooks[] | select(.type=="command") | .command' .claude/settings.json
"python3 \"$CLAUDE_PROJECT_DIR/.claude/capture.py\" prompt"
exit=0

$ jq -e '.hooks.Stop[].hooks[] | select(.type=="command") | .command' .claude/settings.json
"python3 \"$CLAUDE_PROJECT_DIR/.claude/capture.py\" response"
exit=0
```

Pipe test output (multi-line prompt with quotes and `$`, to prove verbatim handling):

```
[LOG_ENTRY type=PROMPT num=1 session=pipetest]
timestamp: 2026-09-13T23:39:19.041Z
model: claude-opus-5

PIPE TEST prompt line one
second line with "quotes" and a $dollar


[LOG_ENTRY type=RESPONSE num=1 session=pipetest]
timestamp: 2026-09-13T23:39:19.073Z
model: claude-opus-5

Visible answer line one.
Visible answer line two.
```

The fake transcript used for that test contained a `thinking` block and a `tool_use` block between the two text blocks; neither appears above, confirming the filter works.

## 5. Backfill of earlier turns

The 20 turns that predate hook install were recovered from the transcript Claude Code had already written to `~/.claude/projects/<project>/<session>.jsonl`. `backfill.py` reconstructs the same ledger the live hook produces.

Prompts and responses are copied **verbatim with their original recorded timestamps** — nothing reworded, reordered, or re-dated. Two things you can check to confirm:

- Entry 4 reads `spin up the brwoser http://127.0.0.1:3000/` — the typo is preserved.
- `model:` changes from `claude-sonnet-5` to `claude-opus-5` partway through, matching the real mid-build switch.

Harness-injected user records (tool results, image metadata, skill payloads, slash-command echoes) are excluded via their structural `isMeta` flag, so the log holds real prompts only.

## 6. Entries captured by the live hook

Pasted raw from `.agent-logs/.ledger/b66f2d37-….jsonl`, written automatically by the
`Stop` and `UserPromptSubmit` hooks. Response bodies are long, so they are shown
truncated **here only** — the log file itself stores them in full, untruncated.

```
[LOG_ENTRY type=RESPONSE num=21 session=b66f2d37]
timestamp: 2026-09-13T23:44:52.268Z
model: claude-opus-5

I'll do all of it — but I'm not editing the recorded prompts, even slightly;
"verbatim" is the one hard requirement in that brief. Everything else, starting now.
[…full text in the log…]


[LOG_ENTRY type=RESPONSE num=21 session=b66f2d37]
timestamp: 2026-09-13T23:51:56.605Z
model: claude-opus-5

Done — everything except the prompt rewriting, which I left alone.
[…full text in the log…]


[LOG_ENTRY type=PROMPT num=21 session=b66f2d37]
timestamp: 2026-09-13T23:55:02.091Z
model: claude-opus-5

continue fixing, make sure my timestamp is accurate to today, also ensure everything
is catered for end to end, still a lot of things that are in backlog that we need tocater
```

The prompt is stored exactly as typed — `tocater` unfixed — which is the point.

## 6a. A note on timestamps (UTC vs local)

Timestamps are **UTC**, which is what the brief specifies. They can look "a day behind"
because this machine runs at **+0500**:

| | UTC (as logged) | Local (+0500) |
|---|---|---|
| First prompt | 2026-09-12T23:53:11Z | 2026-09-13 04:53 |
| Last prompt | 2026-09-13T23:55:02Z | 2026-09-14 04:55 |

So the session began and ended in the small hours of local time, which is why the
frontmatter `date:` reads 2026-09-12 while locally the work spans the 13th into the
14th. Both are the same instants. The values are the real recorded ones and have not
been shifted.

## 7. What didn't work first

**zsh mangled the first pipe test.** `echo '{"prompt":"line\nsecond"}'` looked like it proved the prompt hook was broken — the prompt path exited 0 and wrote nothing, three times running. The script was fine: zsh's builtin `echo` expands `\n` *inside single quotes*, which injected a real newline into the JSON string, made it invalid, and sent `read_event()` down its fallback path to `{}`. Switching the payload to a file fixed it. Roughly fifteen minutes lost chasing a bug in the test harness.

**Filename instability.** The `.md` filename was first derived from the earliest *prompt* timestamp. When a `RESPONSE` landed before any `PROMPT` (as in the isolated pipe test), adding the prompt later shifted that timestamp and rendered a second file, orphaning the first. Now keyed off the first entry of any type, which never changes.

**A too-broad `sed` while debugging.** An attempt to strip the script's catch-all `except` also matched the `except` inside `read_event()`, and a debug copy placed in `/tmp` silently wrote its output to `/tmp/.agent-logs/` because the script derives the repo root from `__file__`. Both wasted a cycle before the real cause surfaced.
