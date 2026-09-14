# 8x Assignment — Agent Capture Test

This file records the capture setup and the evidence used to verify it. The
assignment requires the prompt and final response only, copied verbatim, with an
automatic capture mechanism and a second-session check.

## 1. Setup used for this submission

| Item | Verified value |
|---|---|
| Tool | Claude Code CLI v2.1.168, interactive terminal sessions |
| Model | `claude-sonnet-4-6` for the two canary sessions below |
| Planning/execution | The same Claude Code session handled planning and implementation; the canary sessions were fresh interactive sessions in this repository |
| Automatic mechanism | Claude Code lifecycle hooks in `.claude/settings.json` |

The model names in the earlier historical session are preserved in the original
log. The canary evidence below uses the model actually reported by Claude Code.

## 2. Automatic capture mechanism

`.claude/settings.json` registers two hooks:

| Event | Command | Captured value |
|---|---|---|
| `UserPromptSubmit` | `python3 .claude/capture.py prompt` | Submitted prompt, verbatim |
| `Stop` | `python3 .claude/capture.py response` | Final assistant text read from the transcript path supplied by Claude Code |

`.claude/capture.py` appends JSONL entries to
`.agent-logs/.ledger/<session-id>.jsonl` and renders the corresponding readable
file under `.agent-logs/`. It skips tool calls and thinking blocks. The ledger is
the append-only source of truth; no cleanup or rewriting is performed.

The response hook includes a bounded 0/50/200/500 ms retry because Claude Code can
emit `Stop` just before the final transcript record is flushed. This keeps the
automatic hook reliable without changing the captured text. Session IDs are
validated before being used as filenames, preventing path traversal.

The settings file uses Claude Code's current schema URL and repository-relative
commands. This was corrected after an initial interactive launch reported the old
schema as invalid.

## 3. Log locations

The two fresh, automatically captured canaries are:

```
.agent-logs/2026-09-14_21-17-00_58d7f0d7.md
.agent-logs/2026-09-14_21-18-49_b7800103.md
```

Their append-only ledgers are:

```
.agent-logs/.ledger/58d7f0d7-c8f1-431d-ac4e-21d23920dc83.jsonl
.agent-logs/.ledger/b7800103-c271-4497-8f07-4761ca7f036e.jsonl
```

`.agent-logs/` is part of the repository deliverable and is not listed in
`.gitignore`; add the generated files to the commit when publishing. Run
`npm run verify:capture` to check the configuration and the two-session evidence.

## 4. Canary verification

Two separate interactive Claude Code sessions were opened after the hook fix. Each
session submitted one prompt, received one exact response, and exited normally.
Both the prompt and response appeared in `.agent-logs/` without manually invoking
the capture script.

The raw entries are reproduced below exactly as rendered in the two log files:

```text
[LOG_ENTRY type=PROMPT num=1 session=58d7f0d7]
timestamp: 2026-09-14T21:17:00.489Z
model: unknown

CAPTURE TEST — 8x assignment, Ali Ahmed — retry session one. Reply exactly: capture retry one confirmed.

[LOG_ENTRY type=RESPONSE num=1 session=58d7f0d7]
timestamp: 2026-09-14T21:17:02.420Z
model: claude-sonnet-4-6

capture retry one confirmed.
```

```text
[LOG_ENTRY type=PROMPT num=1 session=b7800103]
timestamp: 2026-09-14T21:18:49.793Z
model: unknown

CAPTURE TEST — 8x assignment, Ali Ahmed — retry session two. Reply exactly: capture retry two confirmed.

[LOG_ENTRY type=RESPONSE num=1 session=b7800103]
timestamp: 2026-09-14T21:18:51.877Z
model: claude-sonnet-4-6

capture retry two confirmed.
```

The timestamps are UTC, as required by the brief. The local machine is UTC+05:00,
so the displayed local date can differ while referring to the same instants.

## 5. Earlier attempts and fixes

These attempts are documented so the evidence is reproducible rather than
overstated:

- Two non-interactive `claude -p` canaries produced Claude transcripts but did not
  run project lifecycle hooks. They were not counted as automatic capture evidence.
- The first interactive pair captured prompts, but the `Stop` event raced the final
  transcript flush. One response was recovered by a direct script invocation while
  diagnosing the race; that recovery is not claimed as automatic evidence.
- The response retry described in §2 was then added, and the two fresh sessions in
  §4 captured both sides automatically.
- An invalid settings schema was reported by Claude Code and corrected before the
  fresh pair was run.

The original historical session and its genuine timestamps remain in
`.agent-logs/2026-09-12_23-53-11_b66f2d37.md`; no entries were backdated or
paraphrased. The older session contains the model switch and the real development
prompts that predate hook installation.

## 6. Assignment submission checklist

The repository-side capture requirement is complete. Before submitting the
assignment, fill in the two externally hosted deliverables and record them here:

- [ ] Live deployed URL: `________________________________`
- [ ] Public repository URL: `________________________________`
- [ ] Under-five-minute walkthrough recorded with camera on
- [ ] Walkthrough demonstrates homepage, search/filtering, product detail, cart,
      registration/login, checkout, and orders
- [ ] Walkthrough identifies Ali Ahmed as the sole contributor/developer

The live deployment, public-repository setting, and camera recording require the
owner's hosting/GitHub accounts and cannot be fabricated by this local repository.
