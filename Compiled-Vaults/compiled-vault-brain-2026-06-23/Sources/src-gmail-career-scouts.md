---
type: source
source_id: src-gmail-career-scouts
medium: connector-gmail
origin: "Gmail — search_threads (転職/採用/選考, newer_than:120d)"
captured: 2026-06-23
sensitivity: personal
tags: [source, connector]
---

# Source: Gmail — career & work threads (smoke pass)

Gmailスモークパス（高シグナル12スレッドのメタデータのみ取得、本文は未取得）。アカウント aoiendo05@gmail.com。

## What this source supports
- 転職活動が活発: OpenWork / ビズリーチ / マイナビ / OpenWorkスカウト多数。スカウト文に「デジタルアクティベーション本部でのプロジェクト推進力」「年間予算1億円規模の案件を成功に導いた」という現職評価の記述。
- non-no編集部（松島氏）から「大学生エディターズ」宛の試泊会案内（大江戸温泉物語） → ユーザーはノンノ大学生エディターズとして稼働。
- 求人興味領域の傍証: ZOZO「fashion tech news」オウンドメディアPM（マスコミ・メディア経験者向け）。

## Provenance note
本文未取得（メタ/snippetのみ）。本格パスでは個別スレッドを get_thread で取得し、固有名詞・日付を確定する。スカウト文の「年間予算1億円」は送り手の推定値であり本人申告と要区別。
