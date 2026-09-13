#!/usr/bin/env python3
"""Append-only agent capture for the 8x assignment.

Wired to two Claude Code lifecycle events in .claude/settings.json:

  UserPromptSubmit -> capture.py prompt    (stdin carries the prompt verbatim)
  Stop             -> capture.py response  (stdin carries the transcript path)

Entries are appended to a JSONL ledger (.agent-logs/.ledger/<session>.jsonl) which
is the append-only source of truth. The human-readable .md is re-rendered from that
ledger on every write, so rendering never mutates captured text.

Prompts and responses are recorded verbatim. No truncation, no paraphrase.
"""
import json
import os
import sys
from datetime import datetime, timezone
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent
LOGS = REPO / ".agent-logs"
LEDGER = LOGS / ".ledger"
AUTHOR = os.environ.get("AGENT_LOG_AUTHOR", "QuantumBreakz")
PROJECT = REPO.name


def now_iso():
    return datetime.now(timezone.utc).strftime("%Y-%m-%dT%H:%M:%S.%f")[:-3] + "Z"


def read_event():
    try:
        return json.loads(sys.stdin.read() or "{}")
    except Exception:
        return {}


def last_assistant_text(transcript_path):
    """Final assistant text for the turn: the trailing run of assistant messages,
    excluding tool calls and thinking. Returns (text, model)."""
    p = Path(transcript_path) if transcript_path else None
    if not p or not p.exists():
        return "", ""
    records = []
    with p.open() as fh:
        for line in fh:
            try:
                records.append(json.loads(line))
            except Exception:
                continue
    chunks, model = [], ""
    for rec in reversed(records):
        rtype = rec.get("type")
        if rtype == "user":
            break  # reached the prompt that began this turn
        if rtype != "assistant":
            continue
        msg = rec.get("message") or {}
        model = model or msg.get("model", "")
        content = msg.get("content")
        if isinstance(content, str):
            chunks.append(content)
            continue
        for block in content or []:
            if isinstance(block, dict) and block.get("type") == "text":
                chunks.append(block.get("text", ""))
    text = "\n".join(t for t in reversed(chunks) if t.strip())
    return text.strip(), model


def transcript_model(transcript_path):
    _, model = last_assistant_text(transcript_path)
    return model


def append(session_id, kind, text, model, transcript_path=""):
    if not text.strip():
        return
    LEDGER.mkdir(parents=True, exist_ok=True)
    entry = {
        "type": kind,
        "timestamp": now_iso(),
        "model": model or "unknown",
        "text": text,
    }
    with (LEDGER / f"{session_id}.jsonl").open("a") as fh:
        fh.write(json.dumps(entry) + "\n")
    render(session_id)


def render(session_id):
    ledger_file = LEDGER / f"{session_id}.jsonl"
    if not ledger_file.exists():
        return
    entries = []
    with ledger_file.open() as fh:
        for line in fh:
            try:
                entries.append(json.loads(line))
            except Exception:
                continue
    if not entries:
        return

    prompts = [e for e in entries if e["type"] == "PROMPT"]
    # Filename is keyed off the first entry ever written for this session, which
    # never changes — keying it off the first PROMPT would rename (and orphan)
    # the file if a RESPONSE happened to land first.
    file_ts = entries[0]["timestamp"]
    first_ts = prompts[0]["timestamp"] if prompts else entries[0]["timestamp"]
    last_ts = prompts[-1]["timestamp"] if prompts else entries[-1]["timestamp"]
    short = session_id[:8]
    date = first_ts[:10]
    models = [e["model"] for e in entries if e.get("model") and e["model"] != "unknown"]
    model = models[-1] if models else "unknown"

    out = [
        "---",
        f"session_id: {session_id}",
        f"date: {date}",
        f"author: {AUTHOR}",
        f"model: {model}",
        "tool: claude-code",
        f"project: {PROJECT}",
        f"total_exchanges: {len(prompts)}",
        f"first_prompt_time: {first_ts}",
        f"last_prompt_time: {last_ts}",
        "---",
        "",
        f"# Session Log - {date}",
        "",
        f"Session: `{short}` | Project: `{PROJECT}` | Author: `{AUTHOR}`",
        "",
        "---",
        "",
    ]

    num = 0
    for entry in entries:
        if entry["type"] == "PROMPT":
            num += 1
        out.append(f"[LOG_ENTRY type={entry['type']} num={num} session={short}]")
        out.append(f"timestamp: {entry['timestamp']}")
        out.append(f"model: {entry['model']}")
        out.append("")
        out.append(entry["text"])
        out.append("")
        out.append("")

    LOGS.mkdir(parents=True, exist_ok=True)
    stamp = file_ts.replace(":", "-").replace("T", "_")[:19]
    (LOGS / f"{stamp}_{short}.md").write_text("\n".join(out))


def main():
    mode = sys.argv[1] if len(sys.argv) > 1 else ""
    event = read_event()
    session_id = event.get("session_id") or "unknown-session"
    transcript = event.get("transcript_path", "")

    if mode == "prompt":
        append(session_id, "PROMPT", event.get("prompt", ""), transcript_model(transcript))
    elif mode == "response":
        text, model = last_assistant_text(transcript)
        append(session_id, "RESPONSE", text, model, transcript)


if __name__ == "__main__":
    try:
        main()
    except Exception:
        # Never break the session because capture failed.
        pass
