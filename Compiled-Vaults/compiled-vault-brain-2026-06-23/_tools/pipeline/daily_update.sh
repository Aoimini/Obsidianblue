#!/bin/bash
# Vault Brain — daily local (+Notion) auto-update.
# SAFE: reads local files + Notion (read-only); writes ONLY to the compiled vault + local git.
# No external sends. No git push. Runs unattended via launchd (04:00).
#
# Manual run:  bash daily_update.sh
# Dry run (collect only, no AI/commit):  VAULTBRAIN_DRYRUN=1 bash daily_update.sh

export PATH="/Users/aoi/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
SRC="/Users/aoi/Desktop/Bluenote"
VAULT="$SRC/Compiled-Vaults/compiled-vault-brain-2026-06-23"
PIPE="$VAULT/_tools/pipeline"
DATA="$HOME/.local/share/vaultbrain"
INBOX="$DATA/inbox"
TS="$(date +%Y-%m-%d)"
mkdir -p "$INBOX" "$DATA/logs"
LOG="$DATA/logs/run_$TS.log"
MODEL="${VAULTBRAIN_MODEL:-sonnet}"
DRYRUN="${VAULTBRAIN_DRYRUN:-0}"

exec >>"$LOG" 2>&1
echo "================ Vault daily update $(date) (model=$MODEL dryrun=$DRYRUN) ================"
caffeinate -i -w $$ &   # prevent sleep during the run

STATUS="OK"; NOTES=""

# 1) collect local deltas (read-only on source)
bash "$PIPE/collect_local.sh" || { STATUS="WARN"; NOTES="$NOTES collect_local_failed"; }

# 2) collect today's Chrome history (Google searches + visits), read-only
python3 "$PIPE/collect_chrome.py" || { STATUS="WARN"; NOTES="$NOTES chrome_failed"; }

# 3) collect Notion (optional; skips cleanly if no token)
if [ -f "$DATA/notion_token" ]; then
  NOTION_TOKEN="$(cat "$DATA/notion_token")" python3 "$PIPE/collect_notion.py" \
    || { STATUS="WARN"; NOTES="$NOTES notion_failed"; }
else
  echo "INFO no Notion token; skipping Notion (run setup_notion.sh to enable)"
fi

# 4) regenerate generated People notes (idempotent, deterministic)
python3 "$VAULT/_tools/gen_people.py" || { STATUS="WARN"; NOTES="$NOTES gen_people_failed"; }

# Decide whether there is anything new to synthesize
HAS_LOCAL="$(cat "$INBOX/.local_has_changes_$TS" 2>/dev/null)"
HAS_NOTION="no"; [ -s "$INBOX/notion_$TS.md" ] && HAS_NOTION="yes"
HAS_CHROME="no"; [ -s "$INBOX/chrome_$TS.md" ] && HAS_CHROME="yes"

if [ "$DRYRUN" = "1" ]; then
  echo "DRYRUN: stopping before AI synthesis. local='$HAS_LOCAL' chrome='$HAS_CHROME' notion='$HAS_NOTION'"
  echo "Inbox files:"; ls -la "$INBOX" | sed 's/^/  /'
  exit 0
fi

# 5) AI synthesis only if there is new input (cost control / 'skip step' principle)
#    SAFE SCOPING: acceptEdits auto-approves FILE edits only; allowedTools excludes Bash and
#    every connector/network/destructive tool. No bypassPermissions. The AI can only read +
#    edit files (constrained by the prompt to the vault path). Deterministic steps
#    (gen_people, validate, git) are done by THIS shell, not the AI.
COST="0"
if [ -n "$HAS_LOCAL" ] || [ "$HAS_NOTION" = "yes" ] || [ "$HAS_CHROME" = "yes" ]; then
  echo "Running AI synthesis (claude -p, $MODEL, acceptEdits, file tools only)..."
  CLAUDE_JSON="$DATA/logs/claude_$TS.json"
  if claude -p "$(cat "$PIPE/daily_update_prompt.md")" \
        --model "$MODEL" \
        --permission-mode acceptEdits \
        --allowedTools "Read Edit Write Grep Glob" \
        --add-dir "$VAULT" \
        --output-format json > "$CLAUDE_JSON" 2>>"$LOG"; then
    COST="$(python3 -c "import json;print(f\"{json.load(open('$CLAUDE_JSON')).get('total_cost_usd',0):.4f}\")" 2>/dev/null || echo '?')"
    echo "AI synthesis cost: \$$COST USD"
    NOTES="$NOTES cost=\$$COST"
  else
    STATUS="WARN"; NOTES="$NOTES claude_failed"
  fi
else
  echo "No new local/Chrome/Notion input today; skipping AI synthesis."
  NOTES="$NOTES no_input"
fi

# 5) validation gate
if python3 "$VAULT/_tools/validate.py"; then
  echo "VALIDATE PASS"
else
  echo "VALIDATE FAIL"
  STATUS="FAIL"; NOTES="$NOTES validate_fail"
  touch "$DATA/NEEDS_REVIEW_$TS"
fi

# 6) record run status inside the vault (committed; original vault untouched)
STATUSFILE="$VAULT/Reports/auto-update-log.md"
[ -f "$STATUSFILE" ] || printf -- '---\ntype: report\nreport: auto-update-log\n---\n\n# Auto-update log\n\n' > "$STATUSFILE"
printf -- '- %s — status: **%s**%s (model=%s, local_changes=%s, notion=%s)\n' \
  "$TS" "$STATUS" "${NOTES:+ —$NOTES}" "$MODEL" "${HAS_LOCAL:-none}" "$HAS_NOTION" >> "$STATUSFILE"

# 7) commit (local only, never push). Broken-but-recorded states still commit per
#    "keep going + record anomaly"; everything is reversible via git history.
cd "$SRC" || exit 1
git add "$VAULT" >/dev/null 2>&1
if git diff --cached --quiet; then
  echo "no vault changes to commit"
else
  git commit -m "vault: daily auto-update $TS [$STATUS]" >/dev/null 2>&1 && echo "COMMITTED [$STATUS]"
fi

# 8) advance watermark + tidy old inbox files (>14 days)
date +%Y-%m-%dT%H:%M:%S > "$DATA/last_run"
find "$INBOX" -type f -mtime +14 -delete 2>/dev/null
echo "================ done: status=$STATUS notes=$NOTES ================"
