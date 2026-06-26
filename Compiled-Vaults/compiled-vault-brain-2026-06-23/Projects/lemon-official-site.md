---
type: project
name: "株式会社LEMON 公式サイト制作"
aliases:
  - "LEMONサイト"
  - "lemon-official-site"
tags:
  - project
  - web
  - client-work
source_status: source-backed
status: active
sensitivity: normal
last_verified: 2026-06-24
---

# 株式会社LEMON 公式サイト制作

## Summary
[[People/endo-aoi]] が制作を担当する株式会社LEMONの公式Webサイト。元vault内に `3_Project/lemon-official-site/` ディレクトリが存在し、本格的なプロジェクトとして進行中。旧Studio.designサイトからの独自サイト移行として06-23に着手、06-24にWORKSセクション・お問い合わせフォーム・プライバシーポリシーまで一気に構築。

## 株式会社LEMON
赤坂の番組制作・フードコーディネート会社。旧サイト: olive681833.studio.site。

## 制作進捗（source-backed）
- **06-23**: Studio.design→独自サイトへの移行開始。GitHub PAT作成、Antigravity IDE利用。
  Source: [[Sources/src-auto-2026-06-23]]
- **06-24**: WORKSセクションの実績棚卸しに集中。番組制作実績（料理の鉄人、CHEF-1グランプリ、家事ヤロウ!!!、ウワサのお客さま、坂上・指原のつぶれない店、新しいカギ、VS魂、100%アピールちゃん、アイアンシェフ、できたできたできた、宝メシグランプリ、夕食ばんざい）とフードコーディネート実績（JALホテルズ Parfait Amour、西武鉄道52席の至福、スーパースイーツ、Cafe余白）の画像/ロゴ収集。お問い合わせフォーム（Googleフォーム埋め込み/formrun検討）とプライバシーポリシーの設置作業。Codex 1h39m + Antigravity-ide 13m を使用しサイト開発。Michikusa株式会社サイトをベンチマーク参照。
  Source: [[Sources/src-auto-2026-06-24]]

- **06-25**: Cloudflare Workersへのデプロイ作業。お名前.comのDNS管理画面とCloudflare DNS設定画面を行き来し、lemon-akasaka.comのDNSレコード設定を実施。サイトがlemon-official-site.aoiendo05.workers.devで稼働確認済み（トップ・Works・Privacy Policyの3ページ）。GitHubリポジトリからのデプロイパイプライン構築（Cloudflare Workers and Pagesのインストール手順を参照）。
  Source: [[Sources/src-auto-2026-06-25]]

## Tech Stack
- ホスティング: **Cloudflare Workers**（lemon-akasaka.com / lemon-official-site.aoiendo05.workers.dev）
- ドメイン管理: お名前.com → Cloudflare DNS
- 開発ツール: Antigravity IDE、Codex（AIコーディング）
- フォーム: Googleフォーム埋め込みまたはformrun

## Related
- [[People/endo-aoi]]
- [[Decisions/career-change-2026]]（LEMONはクライアントワーク。06-22に企業調査もあり転職先候補の可能性も残るが、サイト制作の実作業が主）

## Provenance
- [[Sources/src-auto-2026-06-23]] — 移行着手
- [[Sources/src-auto-2026-06-24]] — WORKS/フォーム/PP構築
