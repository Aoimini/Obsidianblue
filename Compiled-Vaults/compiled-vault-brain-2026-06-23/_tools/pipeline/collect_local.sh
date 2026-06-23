#!/bin/bash
# Collect deltas from the SOURCE vault since the last run. Read-only on the source.
# Writes a delta file into the runtime inbox (OUTSIDE the vault, not committed).
# Exit 0 even on partial failure (pipeline principle: keep going, record anomalies).

SRC="/Users/aoi/Desktop/Bluenote"
VAULT="$SRC/Compiled-Vaults/compiled-vault-brain-2026-06-23"
DATA="$HOME/.local/share/vaultbrain"
INBOX="$DATA/inbox"
mkdir -p "$INBOX"
# Target day = VAULTBRAIN_DATE (set by launcher) or today; used for the delta filename + label
TS="${VAULTBRAIN_DATE:-$(date +%Y-%m-%d)}"
OUT="$INBOX/local_delta_$TS.md"

LAST="$(cat "$DATA/last_run" 2>/dev/null || echo '2000-01-01T00:00:00')"
echo "[collect_local] target=$TS since=$LAST"

{
  echo "# Local delta — target day $TS (changed since $LAST)"
  echo ""
  echo "Source vault: $SRC. The day being summarized is **$TS** — focus the digest on that day's"
  echo "daily note (2_daily/$(date -j -f %Y-%m-%d "$TS" +%m-%d-%Y 2>/dev/null || echo "$TS").md, incl. any voice diary) and the changes below."
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
      # strip our own auto-summary block so the AI never re-summarizes its own output
      awk '/<!-- auto-summary:start -->/{skip=1} !skip; /<!-- auto-summary:end -->/{skip=0}' "$f" | head -c 6000
      echo ""
      echo '```'
    done
  fi

  # ALWAYS include the target day's daily note (the day being summarized), even if unchanged
  # since last run — this carries the voice diary / hand-written memo for that day.
  NOTE_MD="$(date -j -f %Y-%m-%d "$TS" +%m-%d-%Y 2>/dev/null).md"
  NOTE_PATH="$SRC/2_daily/$NOTE_MD"
  echo ""
  echo "## Target day's daily note ($NOTE_MD)"
  if [ -f "$NOTE_PATH" ]; then
    echo '```'
    awk '/<!-- auto-summary:start -->/{skip=1} !skip; /<!-- auto-summary:end -->/{skip=0}' "$NOTE_PATH" | head -c 8000
    echo ""
    echo '```'
    TARGET_NOTE_EXISTS=1
  else
    echo "(まだ作成されていない。inject_memo がテンプレから作成して挿入します)"
    TARGET_NOTE_EXISTS=""
  fi

  # Flag new AI木曜会 profile files (gen_people.py will regenerate People notes)
  echo ""
  echo "## New/changed AI木曜会 profiles"
  PROF="$(find "$SRC/5_Docs/木曜会/プロフィール帳" -name '*.md' -newermt "$LAST" 2>/dev/null | sed "s|^$SRC/||" | sort)"
  if [ -z "$PROF" ]; then echo "(none)"; else echo "$PROF" | sed 's/^/- /'; fi
} > "$OUT"

LINES="$(wc -l < "$OUT" | tr -d ' ')"
echo "[collect_local] wrote $OUT ($LINES lines)"

# Trigger the AI step if there were changes OR the target day's note exists (has diary content)
if [ -n "$CHANGED" ] || [ -n "${TARGET_NOTE_EXISTS:-}" ]; then echo nonempty; else echo ""; fi \
  > "$INBOX/.local_has_changes_$TS"
exit 0
