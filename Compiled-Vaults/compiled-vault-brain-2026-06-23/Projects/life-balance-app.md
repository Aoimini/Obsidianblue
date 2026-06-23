---
type: project
name: "Life Balance MVP"
aliases:
  - "ライフバランス"
  - "Life Balance"
tags:
  - project
  - self-built
  - tool
source_status: source-backed
status: active
sensitivity: normal
last_verified: 2026-06-23
---

# Life Balance MVP

## Summary
[[People/endo-aoi]] の自主開発プロジェクト。Macの活動ログをローカルのSQLiteに収集し、レスポンシブHTMLダッシュボードとして可視化するセルフトラッキングツール。有料APIを避けるローカルファースト設計。

## What it does (source-backed)
- Phase1収集: 最前面のmacOSアプリ／Chromeアクティブタブ／入力アクティビティのタイムスタンプ（キー内容は保存しない）／Obsidian的ファイル編集／git commit。
- Phase2: focus / learning / rest / exercise / sleep のスコア化、アプリ使用率表示、任意のNotionタスク同期。
- CLI: `python3 -m src.lifebalance {init, collect, report, serve, sync-notion}`、ダッシュボードは localhost:8080。

## Notes
- プライバシー配慮設計（キーストローク内容・アイドル時間は保存しない）。
- Notion連携は任意（トークン設定時のみ）。**認証情報はcompiled vaultに非掲載**。

## Related
- [[People/endo-aoi]]
- [[Commitments/goals-2026]]（生活に余白を作る／生活の可視化）

## Provenance
- [[Sources/src-local-life-balance-readme]] — README（3_Project/Life Balance/README.md）
