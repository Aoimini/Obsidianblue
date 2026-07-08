#!/bin/bash
# Post a macOS notification about yesterday's auto-summary. Scheduled at 06:00 via launchd.
# Read-only; just reads the digest and shows a banner.
export PATH="/Users/aoi/.local/bin:/opt/homebrew/bin:/usr/local/bin:/usr/bin:/bin:/usr/sbin:/sbin"
VAULT="/Users/aoi/Desktop/Bluenote/Compiled-Vaults/compiled-vault-brain-2026-06-23"

TARGET="${VAULTBRAIN_DATE:-$(date -v-1d +%Y-%m-%d)}"   # 06:00 reports on the day the 04:00 run summarized
MD="$(date -j -f %Y-%m-%d "$TARGET" +%-m/%-d 2>/dev/null || echo "$TARGET")"
DIGEST="$VAULT/Reports/daily-digests/$TARGET.md"

sanitize() { tr -d '"\\`' | tr '\n' ' '; }

if [ -f "$DIGEST" ]; then
  HL="$(awk '/\*\*行動ハイライト\*\*/{f=1;next} /^\*\*/{f=0} f&&/^- /{print}' "$DIGEST" | head -3 | sed 's/^- //' | sanitize)"
  PC="$(awk -F'合計 ' '/PC:.*合計/{print $2}' "$DIGEST" | head -1 | sanitize)"
  TITLE="🧠 ${MD} のまとめができました"
  BODY="$(echo "${HL}${PC:+ ｜PC ${PC}}" | cut -c1-170)"
  [ -z "$BODY" ] && BODY="日記のMEMOに自動まとめを追記しました。Obsidianで確認できます。"
else
  TITLE="🧠 ${MD} のまとめは未完成"
  BODY="4時の実行が完了していません。16時／次回ログインで自動リトライします。"
fi

osascript -e "display notification \"${BODY}\" with title \"${TITLE}\" sound name \"Glass\""
