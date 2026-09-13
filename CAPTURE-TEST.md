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

## 4. Canary status — read this

**Honest state: the hooks are installed and pipe-tested, but the two live canaries still need to be sent by the user.**

Capture was installed partway through this build, not before it. Claude Code's settings watcher only watches directories that already had a settings file when the session started; `.claude/` existed here but `.claude/settings.json` did not. So the hooks are on disk and valid, but may not be loaded into the *currently running* session.

To go green:

1. Open `/hooks` once (this reloads hook config) or restart Claude Code.
2. Send: `CAPTURE TEST — 8x assignment, Ali Ahmed`
3. Confirm a new `PROMPT` + `RESPONSE` pair lands in `.agent-logs/`.
4. Start a **second** session, send the same canary, confirm it lands there too.
5. Paste both raw entries under §6 below.

### What *is* proven right now

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

## 6. Canary entries

> To be pasted here once steps 1–4 in §4 are done.

```
(pending — hooks installed, awaiting live canary)
```

## 7. What didn't work first

**zsh mangled the first pipe test.** `echo '{"prompt":"line\nsecond"}'` looked like it proved the prompt hook was broken — the prompt path exited 0 and wrote nothing, three times running. The script was fine: zsh's builtin `echo` expands `\n` *inside single quotes*, which injected a real newline into the JSON string, made it invalid, and sent `read_event()` down its fallback path to `{}`. Switching the payload to a file fixed it. Roughly fifteen minutes lost chasing a bug in the test harness.

**Filename instability.** The `.md` filename was first derived from the earliest *prompt* timestamp. When a `RESPONSE` landed before any `PROMPT` (as in the isolated pipe test), adding the prompt later shifted that timestamp and rendered a second file, orphaning the first. Now keyed off the first entry of any type, which never changes.

**A too-broad `sed` while debugging.** An attempt to strip the script's catch-all `except` also matched the `except` inside `read_event()`, and a debug copy placed in `/tmp` silently wrote its output to `/tmp/.agent-logs/` because the script derives the repo root from `__file__`. Both wasted a cycle before the real cause surfaced.
