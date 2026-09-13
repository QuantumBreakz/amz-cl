#!/usr/bin/env python3
"""One-off backfill of .agent-logs/ from a Claude Code session transcript.

Capture hooks were installed partway through this project, so the turns before
that point exist only in the transcript Claude Code writes to
~/.claude/projects/<project>/<session>.jsonl.

This reads that transcript and reconstructs the same append-only ledger the live
hook writes. Prompts and responses are copied verbatim with their real recorded
timestamps. Nothing is reworded, reordered, or re-dated.

Records that are not user prompts are skipped: tool results, and harness-injected
turns (slash-command echoes, background task notifications, system reminders).

Usage: backfill.py <transcript.jsonl> [--write]
"""
import json
import re
import sys
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
LEDGER = REPO / ".agent-logs" / ".ledger"

# Harness-injected user turns — not typed by the human.
INJECTED = re.compile(
    r"<local-command-|<command-name>|<command-message>|<local-command-stdout>"
    r"|<task-notification>|\[SYSTEM NOTIFICATION - NOT USER INPUT\]",
    re.I,
)


def text_of(content):
    if isinstance(content, str):
        return content
    parts = []
    for block in content or []:
        if isinstance(block, dict) and block.get("type") == "text":
            parts.append(block.get("text", ""))
    return "\n".join(parts)


def strip_reminders(text):
    """Drop <system-reminder> blocks the harness appends to a real prompt."""
    return re.sub(r"<system-reminder>.*?</system-reminder>", "", text, flags=re.S).strip()


def extract(path):
    records = []
    with open(path) as fh:
        for line in fh:
            try:
                records.append(json.loads(line))
            except Exception:
                continue

    turns, pending, pending_ts = [], None, None
    for rec in records:
        rtype = rec.get("type")
        msg = rec.get("message") or {}
        ts = rec.get("timestamp", "")

        if rtype == "user":
            # Claude Code flags harness-injected turns (image metadata, skill
            # payloads, command echoes) with isMeta. Those are not user prompts.
            if rec.get("isMeta"):
                continue
            content = msg.get("content")
            # tool results are lists whose blocks are tool_result — never a prompt
            if isinstance(content, list) and not any(
                isinstance(b, dict) and b.get("type") == "text" for b in content
            ):
                continue
            raw = text_of(content)
            if INJECTED.search(raw):
                continue
            cleaned = strip_reminders(raw)
            if not cleaned:
                continue
            if pending:
                turns.append(pending)
            pending = {"prompt": cleaned, "prompt_ts": ts, "chunks": [], "model": ""}
            pending_ts = ts

        elif rtype == "assistant" and pending is not None:
            pending["model"] = pending["model"] or msg.get("model", "")
            for block in msg.get("content") or []:
                if isinstance(block, dict) and block.get("type") == "text":
                    t = block.get("text", "")
                    if t.strip():
                        pending["chunks"].append((ts, t))

    if pending:
        turns.append(pending)
    return turns


def main():
    if len(sys.argv) < 2:
        print(__doc__)
        return 1
    turns = extract(sys.argv[1])
    write = "--write" in sys.argv

    print(f"reconstructed turns: {len(turns)}")
    for i, t in enumerate(turns[:400], 1):
        first = t["prompt"].splitlines()[0][:72] if t["prompt"] else ""
        print(f"  {i:3}. {t['prompt_ts'][:19]}  resp_chunks={len(t['chunks']):2}  {first}")

    if not write:
        print("\n(dry run — pass --write to emit the ledger)")
        return 0

    session_id = Path(sys.argv[1]).stem
    LEDGER.mkdir(parents=True, exist_ok=True)
    out = LEDGER / f"{session_id}.jsonl"
    with out.open("w") as fh:
        for t in turns:
            fh.write(json.dumps({
                "type": "PROMPT",
                "timestamp": t["prompt_ts"],
                "model": t["model"] or "claude-sonnet-5",
                "text": t["prompt"],
            }) + "\n")
            if t["chunks"]:
                fh.write(json.dumps({
                    "type": "RESPONSE",
                    "timestamp": t["chunks"][-1][0],
                    "model": t["model"] or "claude-sonnet-5",
                    "text": "\n\n".join(c[1] for c in t["chunks"]),
                }) + "\n")
    print(f"\nwrote ledger: {out}")
    sys.path.insert(0, str(REPO / ".claude"))
    import capture
    capture.render(session_id)
    print("rendered markdown into .agent-logs/")
    return 0


if __name__ == "__main__":
    raise SystemExit(main())
