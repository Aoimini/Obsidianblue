---
type: source
source_id: src-thursday-profile-book
medium: local-file
origin: "/Users/aoi/Desktop/Bluenote/5_Docs/木曜会/プロフィール帳/ (95 files)"
captured: 2026-06-23
sensitivity: normal
tags: [source, local, people]
---

# Source: AI木曜会 プロフィール帳（コレクション）

[[Companies/ai-mokuyokai]]（AI木曜会）メンバーのプロフィール帳。約95名分の個別Markdownファイル。
各ファイルは `基本情報（メール/SNS/会社・所属/Fincs）`、`出会ったイベント`、`メモ` の構成。
元vaultでは people.json + _build.py により生成運用（ユーザーのメモリ "luma-profile-book" 参照）。

## What this source supports
- `People/` 配下に生成された木曜会メンバーの canonical note 群（frontmatterの `origin` に個別ファイルを記録）。
- 各人物の所属企業（例: 株式会社100、Michikusa株式会社 等）、SNS、ユーザーとの接点イベント（バレー会・Claude Code語ろう会・採用説明会など）。

## Provenance note
連絡先（他者のメール・SNS）は本人がプロフィール帳に記録したもの。sensitivity: normal。認証情報ではない。
個別ノートのProvenanceは本コレクショントレースを指す。
