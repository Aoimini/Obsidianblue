#!/usr/bin/env python3
"""Inject the day's auto-summary into the Obsidian daily note's `## 1. MEMO` section.

Deterministic + idempotent. The AI writes the summary into the digest
(Reports/daily-digests/<date>.md) inside a `memo-block` region; this script lifts that
region and inserts it into 2_daily/<MM-DD-YYYY>.md between auto-summary markers, WITHOUT
touching the user's hand-written / voice-diary text.

- If the daily note doesn't exist, it's created from 4_template/日記.md.
- Re-runs replace the marked block in place (no duplication).
- Target day = env VAULTBRAIN_DATE (YYYY-MM-DD) or yesterday.
"""
import os, re, sys, datetime

SRC = "/Users/aoi/Desktop/Bluenote"
VAULT = os.path.join(SRC, "Compiled-Vaults/compiled-vault-brain-2026-06-23")
TEMPLATE = os.path.join(SRC, "4_template/日記.md")
DAILY_DIR = os.path.join(SRC, "2_daily")

target = os.environ.get("VAULTBRAIN_DATE")
DAY = datetime.date.fromisoformat(target) if target else (datetime.date.today() - datetime.timedelta(days=1))
NOTE = os.path.join(DAILY_DIR, DAY.strftime("%m-%d-%Y") + ".md")
DIGEST = os.path.join(VAULT, "Reports", "daily-digests", DAY.isoformat() + ".md")

START = "<!-- auto-summary:start -->"
END = "<!-- auto-summary:end -->"

def log(*a): print("[inject_memo]", *a)

# 1) get the memo-block from the digest
if not os.path.isfile(DIGEST):
    log(f"no digest for {DAY}; nothing to inject"); sys.exit(0)
dtext = open(DIGEST, encoding="utf-8").read()
m = re.search(r"<!--\s*memo-block:start\s*-->\n?(.*?)<!--\s*memo-block:end\s*-->", dtext, re.S)
if not m:
    log("digest has no memo-block region; nothing to inject"); sys.exit(0)
block = m.group(1).strip()
wrapped = f"{START}\n{block}\n{END}"

# 2) locate or create the daily note
if not os.path.isfile(NOTE):
    if os.path.isfile(TEMPLATE):
        os.makedirs(DAILY_DIR, exist_ok=True)
        open(NOTE, "w", encoding="utf-8").write(open(TEMPLATE, encoding="utf-8").read())
        log(f"created {NOTE} from template")
    else:
        log("template missing; cannot create note"); sys.exit(0)

text = open(NOTE, encoding="utf-8").read()

# 3a) if markers already present anywhere, replace in place (idempotent)
if START in text and END in text:
    text = re.sub(re.escape(START) + r".*?" + re.escape(END), wrapped, text, count=1, flags=re.S)
    open(NOTE, "w", encoding="utf-8").write(text)
    log(f"replaced auto-summary block in {NOTE}")
    sys.exit(0)

# 3b) else insert right after the `## 1. MEMO` heading
mm = re.search(r"^(##\s*1\.\s*MEMO[^\n]*\n)", text, re.M)
if mm:
    idx = mm.end()
    text = text[:idx] + "\n" + wrapped + "\n" + text[idx:]
else:
    # no MEMO heading (unexpected) — append a MEMO section
    text = text.rstrip() + "\n\n## 1. MEMO\n\n" + wrapped + "\n"
open(NOTE, "w", encoding="utf-8").write(text)
log(f"inserted auto-summary block into {NOTE}")
sys.exit(0)
