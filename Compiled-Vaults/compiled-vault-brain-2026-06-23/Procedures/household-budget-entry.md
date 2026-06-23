---
type: procedure
name: "家計簿スプレッドシート記入フロー"
tags:
  - procedure
  - finance
source_status: source-backed
sensitivity: financial
last_verified: 2026-06-23
---

# Procedure: 家計簿スプレッドシート記入

## When to use
[[People/endo-aoi]] のカード/PayPay/銀行明細を、家計簿Googleスプレッドシートに記入するとき。

## Tools
- スキル `meisai-md`: 三井住友カードの月次PDF明細を Markdown 化（保存先 `5_Docs/`）。
- スキル `okane-entry`: 明細データを分類してスプレッドシートに記入。
- スキル `okane`: 家計簿スプレッドシートをブラウザで開く。

## Column schema（記入ルール, source-backed）
| 列 | 内容 |
|---|---|
| B | 支払い月 MM |
| C | 支払日 YY/MM/DD |
| D | 口座（三井住友 / PayPay / みずほ / 現金） |
| E | 入出金（入金 / 出金） |
| F | 資産額（口座間送金=チャージ時に金額をここに。G〜J空白、送金元E=出金/送金先E=入金） |
| G | 項目1（収入 / 税金 / 貯蓄 / 固定費 / 変動費） |
| H | 費目（G列に応じて選択） |
| I | 金額（数字のみ。チャージ以外） |
| K | 店舗・摘要 |

### 費目の選択肢（H列）
- 収入: 給料 / 副業 / ポイント / 返金
- 税金: 健康保険 / 厚生年金 / 雇用保険 / 所得税 / 住民税
- 貯蓄: NISA / PayPay / 個別株
- 固定費: 通信費 / 定期 / Amazon / Kindle / ジム / 木曜会 / 英語 / スマホ代 / 推し / AI / その他 / サブスク
- 変動費: 食費 / 交通費 / 交際費 / 勉強費 / 衣美容費 / 医療費 / 雑費 / 旅行費 / 外食費 / 日用品 / 娯楽費

## Notes
- PayPayチャージなど口座間送金は F列に金額、G〜J空白。送金元口座にE=出金、送金先口座にE=入金。
- 認証情報・口座番号は扱わない。

## Related
- [[Topics/spending-overview]]
- [[People/endo-aoi]]

## Provenance
- [[Sources/src-local-finance]] — 記入ルール（5_Docs/収支/支出管理.md）
