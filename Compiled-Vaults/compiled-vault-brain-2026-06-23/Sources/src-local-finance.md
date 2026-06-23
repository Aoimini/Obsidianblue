---
type: source
source_id: src-local-finance
medium: local-file
origin: "/Users/aoi/Desktop/Bluenote/5_Docs/収支/, 3_Project/支出管理/"
captured: 2026-06-23
sensitivity: financial
tags: [source, local, finance]
---

# Source: 家計・収支ファイル群

家計管理用の支出明細（三井住友カード月次・PayPay期間別）とスプレッドシート記入ルール。

## What this source supports
- スプレッドシート記入スキーマ（列A〜K、口座=三井住友/PayPay/みずほ/現金、項目1=収入/税金/貯蓄/固定費/変動費、費目の選択肢）。
- 月次カード支払い合計: 三井住友 4月支払い 207,111円 / 5月支払い 318,520円。
- 費目別集計（5月明細, 出金）: 医療費88,600 / 旅行費52,090 / 外食費31,309 / 交通費30,350 / NISA30,000(貯蓄) / 娯楽費25,825 / 雑費20,419 / 衣美容費11,000 / サブスク10,730 / 勉強費9,763 / ジム8,778 / 通信費7,914 / AI5,570 ほか。
- 反復する固定費: ジム(約8,778/月)、木曜会(約5,250)、AI/Claude.ai(約3,643〜5,570)、英語 iels三軒茶屋(5,000)、各種サブスク(Apple/DMM 等)。
- 関連スキル: `okane-entry`（明細→スプレッドシート記入）、`meisai-md`（三井住友PDF明細→Markdown化）。

## Redaction note
口座番号・カード番号・認証情報は元データにも含まれず、compiled vaultにも一切記載しない。金額・店舗名・費目はユーザー方針により保持。sensitivity: financial。
