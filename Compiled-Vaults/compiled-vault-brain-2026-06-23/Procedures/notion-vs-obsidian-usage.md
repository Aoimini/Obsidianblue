---
type: procedure
name: "NotionとObsidianの使い分け"
tags:
  - procedure
  - organization
source_status: source-backed
sensitivity: personal
last_verified: 2026-07-07
---

# Procedure: Notion と Obsidian の使い分け

## When to use
[[People/endo-aoi]] が新しい情報・タスク・記録をどちらのツールに置くか迷ったとき。

## 判断フロー（10秒, 本人記述）
1. 誰かと共有する？ → **Notion**
2. カレンダー・LINE・スマホ入力と連動させたい？ → **Notion**
3. それ以外（考える・記録する・学ぶ・作業する） → **Obsidian**

一言でいうと「Obsidianは自分の頭の中、Notionは人と回す場所」。

## Obsidian（Bluenote）＝ 思考と蓄積
| フォルダ | 役割 |
|---|---|
| 1_Inbox | 収集の入口（週次で空にする） |
| 2_daily | 日記・習慣・月次レビュー（自動化済み） |
| 3_Project | 案件の作業ファイル（LEMON・カイシャダルマ・non-no等） |
| 5_Docs | 学習の中身（単語カード・読書）・転職の本丸・家計簿明細の変換置き場 |
| 6_Personal | 内省・GOAL・心得・自分用レシピ |
| Clippings | 記事の切り抜き |
| 99_Archive | 迷ったらここ（四半期で掃除） |

git管理と自動化（launchd・Claude Code）はObsidian側のみ。

## Notion ＝ 共有とデータベース
| ワークスペース | 役割 |
|---|---|
| Aoi-private-（メイン・1名と共有） | GTDタスク（情報管理）・schedule・TOEIC進捗（正）・旅行・コミュニティ（AI木曜会/バレー）・収支記録（LINE家計簿の受け皿）・共有ページ（Plan/MEMO/Recipe） |
| Aostu（サブ） | タスク管理（プライベート、シェア）・仕事キャリア（面接AIノート）・HOME |

## テーマ別の「正」（複製を作らない）
| テーマ | 正（マスター） | 補助 |
|---|---|---|
| TOEIC | Notion Aoi-private-「📚 英語学習」 | Obsidian「単語カード」 |
| 家計簿 | Googleスプレッドシート（毎週土曜自動記入, [[Procedures/household-budget-entry]]） | Notion収支記録／Obsidian 5_Docs/収支 |
| 転職 | Obsidian 5_Docs/転職（「転職ボード」・企業ノート・「転職軸の整理」） | Notion面接AIノート → 終わったら企業ノートへ転記 |
| タスク | Notion「情報管理」のGTD | Obsidian日記のチェックは習慣だけ |
| レシピ | Notion「R e c i p e」 | Obsidian 6_Personal/レシピ |
| 記事の収集 | Obsidian Clippings／1_Inbox | Notionには作らない |
| AI木曜会 | Notion「🏐 コミュニティ」 | Obsidian 5_Docs/木曜会（プロフィール帳の生成元） |

## 運用ルール（本人のストレングス傾向より, [[Preferences/strengths-finder-gunshi]]）
- 着想×アレンジ対策: 新しい管理システムを作りたくなったら、まず「正」に追加できないか考える（TOEIC・収支で3箇所に増えた反省から）。
- 収集心の出口は1_Inboxのみに固定、週次で仕分け。
- 消さない: Obsidianは99_Archive、Notionは各🗄️アーカイブへ退避。
- 進捗の見える化（ヒートマップ・月次レビュー・TOEICダッシュボード）は既存のものを見る、新規に作らない。

## Related
- [[People/endo-aoi]]
- [[Preferences/strengths-finder-gunshi]]
- [[Procedures/household-budget-entry]]

## Provenance
- [[Sources/src-auto-2026-07-07]] — 🧭 NotionとObsidianの使い分け.md（新規作成）
