# Compiled Vault Brain — 遠藤 葵 (2026-06-23)

LLM/エージェントが参照する、出典付きの永続コンテキスト層（Obsidian互換vault）。
元vault `/Users/aoi/Desktop/Bluenote` を素材に、canonicalな知識として構造化したもの。

> **状態: スモークパス（Phase 2）完了 / Hard Checkpoint 2 — 本格取り込みの承認待ち**

## How this vault is organized
| フォルダ | 役割（記憶の種別） |
|---|---|
| `People/` | 人物（宣言的記憶） |
| `Companies/` | 企業・組織・コミュニティ |
| `Projects/` | プロジェクト |
| `Products/` | プロダクト・システム |
| `Topics/` | テーマ・概念 |
| `Decisions/` | 意思決定（理由・代替案・帰結） |
| `Commitments/` | 約束・目標・open loops |
| `Procedures/` | 手順（手続き的記憶） |
| `Preferences/` | 嗜好・働き方・自己モデル |
| `Context Packs/` | タスク特化のコンテキスト束 |
| `Sources/` | 出典トレース（provenance） |
| `Maps/` | 索引・地図 |
| `Reports/` | 進捗・監査レポート |
| `_tools/` | 検証スクリプト（決定的機械） |

## How agents should use it
1. タスクに合う `Context Packs/` をまず読む。
2. canonicalノート内の wikilink を辿り、必要な人物/企業/決定/手順を取得する。
3. 主張の根拠は各ノートの `## Provenance` → `Sources/` を確認する。
4. 出典の鮮度は `SOURCE-MANIFEST.md` を参照。
5. **外部書き込み（メール送信・カレンダー登録・Slack/Notion書き込み等）は必ず事前にユーザー承認を取る。**
6. 事実は捏造しない。不確実性はノート内に明示してある（confidence / Open questions）。

## Key files
- `SOURCE-MANIFEST.md` — ソース/コネクタとアカウント検証
- `VALIDATION-REPORT.md` — 検証スクリプトの実行結果
- `COMPLETION-AUDIT.md` — 要件↔エビデンスの対応
- `INGESTION-LOG.md` / `state.json` — 進捗・再開状態
- `Reports/ORIENTATION-REPORT.md` — フェーズ1の棚卸し

## Sensitivity
健康・メンタル・家計など機微情報は frontmatter の `sensitivity` で明示。認証情報（トークン・カード番号・口座番号等）は一切コピーしない方針。
