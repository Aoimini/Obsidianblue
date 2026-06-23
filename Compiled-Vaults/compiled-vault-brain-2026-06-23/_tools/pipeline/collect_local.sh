#!/bin/bash
# Collect deltas from the SOURCE vault since the last run. Read-only on the source.
# Writes a delta file into the runtime inbox (OUTSIDE the vault, not committed).
# Exit 0 even on partial failure (pipeline principle: keep going, record anomalies).

SRC="/Users/aoi/Desktop/Bluenote"
VAULT="$SRC/Compiled-Vaults/compiled-vault-brain-2026-06-23"
DATA="$HOME/.local/share/vaultbrain"
INBOX="$DATA/inbox"
mkdir -p "$INBOX"
TS="$(date +%Y-%m-%d)"
OUT="$INBOX/local_delta_$TS.md"

LAST="$(cat "$DATA/last_run" 2>/dev/null || echo '2000-01-01T00:00:00')"
echo "[collect_local] since=$LAST"

{
  echo "# Local delta — $TS (since $LAST)"
  echo ""
  echo "Source vault: $SRC (read-only). Files below changed since last run."
  echo ""

  # Markdown files modified since last run, excluding the compiled vault, git, obsidian, claude dirs
  echo "## Changed markdown files"
  CHANGED="$(find "$SRC" -name '*.md' \
      -not -path "*/Compiled-Vaults/*" \
      -not -path "*/.git/*" \
      -not -path "*/.obsidian/*" \
      -not -path "*/.claude/*" \
      -newermt "$LAST" 2>/dev/null | sort)"
  if [ -z "$CHANGED" ]; then
    echo "(none)"
  else
    echo "$CHANGED" | sed "s|^$SRC/||" | sed 's/^/- /'
  fi
  echo ""

  # Inline the content of changed files (cap each to keep prompt bounded)
  if [ -n "$CHANGED" ]; then
    echo "## Content of changed files (capped)"
    echo "$CHANGED" | while IFS= read -r f; do
      [ -f "$f" ] || continue
      rel="${f#$SRC/}"
      echo ""
      echo "### $rel"
      echo '```'
      head -c 6000 "$f"
      echo ""
      echo '```'
    done
  fi

  # Flag new AI木曜会 profile files (gen_people.py will regenerate People notes)
  echo ""
  echo "## New/changed AI木曜会 profiles"
  PROF="$(find "$SRC/5_Docs/木曜会/プロフィール帳" -name '*.md' -newermt "$LAST" 2>/dev/null | sed "s|^$SRC/||" | sort)"
  if [ -z "$PROF" ]; then echo "(none)"; else echo "$PROF" | sed 's/^/- /'; fi
} > "$OUT"

LINES="$(wc -l < "$OUT" | tr -d ' ')"
echo "[collect_local] wrote $OUT ($LINES lines)"

# Emit a simple changed-count marker for the launcher to decide whether to run the AI step
echo "${CHANGED:+nonempty}" > "$INBOX/.local_has_changes_$TS"
exit 0
