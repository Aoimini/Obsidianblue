---
type: source
source_id: src-local-life-balance-readme
medium: local-file
origin: "/Users/aoi/Desktop/Bluenote/3_Project/Life Balance/README.md"
captured: 2026-06-23
sensitivity: normal
tags: [source, local]
---

# Source: Life Balance MVP README

ユーザーの自主開発プロジェクト「Life Balance MVP」のREADME。

## What this source supports
- Mac活動ログをローカルのSQLiteに収集し、レスポンシブHTMLダッシュボードで可視化するツール。有料API回避方針。
- Phase1収集: 最前面アプリ／Chromeアクティブタブ／入力アクティビティのタイムスタンプ（キー内容は保存しない）／Obsidian的ファイル編集／git commit。
- Phase2: focus/learning/rest/exercise/sleep のスコア、アプリ使用率、任意のNotionタスク同期。
- CLI: `python3 -m src.lifebalance {init,collect,report,serve,sync-notion}`。

## Redaction note
READMEにはNotion連携トークンの**プレースホルダ**（`secret_xxx`）とDB IDが例示されているが、これらは実認証情報ではなく、compiled vaultには一切コピーしない。
