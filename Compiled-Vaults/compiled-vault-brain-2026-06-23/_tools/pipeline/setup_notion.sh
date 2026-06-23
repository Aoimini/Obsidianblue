#!/bin/bash
# Securely store a Notion internal integration token OUTSIDE the vault/git.
# Usage: bash setup_notion.sh   (you'll paste the token; input is hidden)
set -u
DATA="$HOME/.local/share/vaultbrain"
mkdir -p "$DATA"
echo "Notion internal integration token をペーストして Enter（入力は表示されません）"
echo "（https://www.notion.so/my-integrations で発行。'ntn_...' または 'secret_...'）"
read -rs TOK
if [ -z "${TOK:-}" ]; then echo "空でした。中止します。"; exit 1; fi
printf '%s' "$TOK" > "$DATA/notion_token"
chmod 600 "$DATA/notion_token"
unset TOK
echo "保存しました: $DATA/notion_token (chmod 600, git管理外)"
echo ""
echo "次にやること: Notionで対象ページ/DBを開き ••• -> 接続(Connections) -> このインテグレーションを追加。"
echo "確認テスト: NOTION_TOKEN=\"\$(cat $DATA/notion_token)\" python3 \"$(cd "$(dirname "$0")" && pwd)/collect_notion.py\""
