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
# Target day = yesterday by default (the 4am run summarizes the day that just ended).
# Override with VAULTBRAIN_DATE=YYYY-MM-DD. All collectors read VAULTBRAIN_DATE.
USER_DATE="${VAULTBRAIN_DATE:-}"   # empty unless the user explicitly set a date (manual run)
TARGET_DATE="${USER_DATE:-$(date -v-1d +%Y-%m-%d)}"
export VAULTBRAIN_DATE="$TARGET_DATE"
NOTE_DATE="$(date -j -f %Y-%m-%d "$TARGET_DATE" +%m-%d-%Y 2>/dev/null)"
RUNTS="$(date +%Y-%m-%d)"
TS="$TARGET_DATE"
mkdir -p "$INBOX" "$DATA/logs"
LOG="$DATA/logs/run_$RUNTS.log"
MODEL="${VAULTBRAIN_MODEL:-haiku}"   # light model by default (cost); override VAULTBRAIN_MODEL=sonnet for heavy days
DRYRUN="${VAULTBRAIN_DRYRUN:-0}"

exec >>"$LOG" 2>&1
echo "================ Vault daily update $(date) target=$TARGET_DATE (model=$MODEL dryrun=$DRYRUN) ================"
caffeinate -i -w $$ &   # prevent sleep during the run

# Run-once-per-target-day guard. The agent fires at 04:00 AND at login/boot (RunAtLoad), so if
# the 4am run was missed (Mac off / logged out) it catches up on next login — but if the day's
# summary is already done, skip cheaply instead of re-running. Manual runs with an explicit
# VAULTBRAIN_DATE, or VAULTBRAIN_FORCE=1, bypass the guard.
if [ -z "$USER_DATE" ] && [ "${VAULTBRAIN_FORCE:-0}" != "1" ] && [ "$DRYRUN" != "1" ]; then
  if [ "$(cat "$DATA/last_completed_target" 2>/dev/null)" = "$TARGET_DATE" ]; then
    echo "target $TARGET_DATE already completed; skipping (VAULTBRAIN_FORCE=1 to override)."
    exit 0
  fi
fi

STATUS="OK"; NOTES=""

# 1) collect local deltas (read-only on source)
bash "$PIPE/collect_local.sh" || { STATUS="WARN"; NOTES="$NOTES collect_local_failed"; }

# 2) collect the target day's Chrome history (Google searches + visits), read-only
python3 "$PIPE/collect_chrome.py" || { STATUS="WARN"; NOTES="$NOTES chrome_failed"; }

# 2b) collect iPhone/Mac Screen Time for SNS (experimental; skips cleanly if not set up)
python3 "$PIPE/collect_screentime.py" || { STATUS="WARN"; NOTES="$NOTES screentime_failed"; }

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
HAS_SCREEN="no"; [ -s "$INBOX/screentime_$TS.md" ] && HAS_SCREEN="yes"

if [ "$DRYRUN" = "1" ]; then
  echo "DRYRUN: stopping before AI synthesis. target=$TARGET_DATE local='$HAS_LOCAL' chrome='$HAS_CHROME' screen='$HAS_SCREEN' notion='$HAS_NOTION'"
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
  claude -p "$(cat "$PIPE/daily_update_prompt.md")" \
        --model "$MODEL" \
        --permission-mode acceptEdits \
        --allowedTools "Read Edit Write Grep Glob" \
        --add-dir "$VAULT" \
        --output-format json > "$CLAUDE_JSON" 2>>"$LOG"
  # Parse cost + error reason regardless of exit code (work may complete then hit a limit).
  eval "$(python3 - "$CLAUDE_JSON" <<'PY'
import json,sys
try:
    d=json.load(open(sys.argv[1]))
except Exception:
    print('AI_COST=0; AI_ERR=parse; AI_REASON=no_json'); sys.exit()
cost=d.get('total_cost_usd',0) or 0
err=bool(d.get('is_error'))
res=(d.get('result') or '')[:120].replace('"','').replace('\n',' ')
reason='ratelimit' if ('limit' in res.lower()) else ('err' if err else 'ok')
print(f'AI_COST={cost:.4f}; AI_ERR={int(err)}; AI_REASON={reason}; AI_MSG="{res}"')
PY
)"
  COST="${AI_COST:-0}"
  echo "AI synthesis: cost≈\$$COST (subscription usage) reason=$AI_REASON ${AI_MSG:+— $AI_MSG}"
  NOTES="$NOTES cost=\$$COST"
  if [ "$AI_REASON" = "ratelimit" ]; then
    STATUS="RATELIMIT"; NOTES="$NOTES session_limit"
  elif [ "${AI_ERR:-0}" = "1" ]; then
    STATUS="WARN"; NOTES="$NOTES claude_error"
  fi
else
  echo "No new local/Chrome/Notion input for $TARGET_DATE; skipping AI synthesis."
  NOTES="$NOTES no_input"; AI_SKIPPED_NO_INPUT=1
fi

# 5b) inject the day's auto-summary into the Obsidian daily note `## 1. MEMO`
#     (deterministic + idempotent; creates the note from template if missing; preserves voice diary)
python3 "$PIPE/inject_memo.py" || { STATUS="WARN"; NOTES="$NOTES inject_failed"; }

# 5c) auto-heal unresolved wikilinks the AI may have created (prevents validate_fail commits)
python3 "$PIPE/fix_links.py" || true

# 6) validation gate (compiled vault)
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
printf -- '- %s — status: **%s**%s (model=%s, local=%s, chrome=%s, screen=%s, notion=%s)\n' \
  "$TARGET_DATE" "$STATUS" "${NOTES:+ —$NOTES}" "$MODEL" "${HAS_LOCAL:-none}" "$HAS_CHROME" "$HAS_SCREEN" "$HAS_NOTION" >> "$STATUSFILE"

# 7) commit (local only, never push). Stage ONLY the compiled vault + the one daily note we
#    touched — never sweep in the repo's other uncommitted changes.
cd "$SRC" || exit 1
git add "$VAULT" >/dev/null 2>&1
[ -n "$NOTE_DATE" ] && [ -f "$SRC/2_daily/$NOTE_DATE.md" ] && git add "$SRC/2_daily/$NOTE_DATE.md" >/dev/null 2>&1
if git diff --cached --quiet; then
  echo "no changes to commit"
else
  git commit -m "vault: daily auto-update $TARGET_DATE [$STATUS]" >/dev/null 2>&1 && echo "COMMITTED [$STATUS]"
fi

# 8) advance watermark + mark this target day done (so login/boot runs don't repeat it).
#    Mark done ONLY if the digest was actually produced (ties completion to the real artifact), or
#    if there was genuinely no input. A timeout / rate-limit / error that produced no summary leaves
#    the day UNmarked, so the afternoon retry slot or next login retries it.
date +%Y-%m-%dT%H:%M:%S > "$DATA/last_run"
if [ -f "$VAULT/Reports/daily-digests/$TARGET_DATE.md" ] || [ "${AI_SKIPPED_NO_INPUT:-0}" = "1" ]; then
  echo "$TARGET_DATE" > "$DATA/last_completed_target"
else
  echo "no digest produced for $TARGET_DATE — leaving UNmarked for retry"
fi
find "$INBOX" -type f -mtime +14 -delete 2>/dev/null

# If this is the 05:xx wake-run, keep the Mac awake ~20 min so the 06:00 notification fires
# before it goes back to sleep (relevant when running from a scheduled wake, lid closed).
if [ "$(date +%H)" = "05" ]; then caffeinate -u -t 1200 >/dev/null 2>&1 & fi

echo "================ done: status=$STATUS notes=$NOTES ================"
