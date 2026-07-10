---
type: project
name: "ポム & マフィン メニューバーアプリ"
aliases:
  - "Pomu Search Companion"
  - "ポムポムプリン監視アプリ"
tags:
  - project
  - self-built
  - tool
  - macOS
  - SwiftUI
source_status: source-backed
status: active
sensitivity: normal
last_verified: 2026-07-09
---

# ポム & マフィン メニューバーアプリ

## Summary
[[People/endo-aoi]] の自主開発プロジェクト。不安から同じ検索を何度も繰り返す「検索ループ」を検知し、macOSメニューバーで小さく動く見守りキャラクター「ポム」と「マフィン」として気づきを促すツール。SwiftUI + MenuBarExtraで実装。

## What it does (source-backed)
- **メニューバー常駐**: macOSメニューバーに22×22pxのミニポムを表示。
- **5状態アニメーション**: Idle / Searching / Looping / Stuck / Resting の状態を自動判定＆ダンス・点滅で表現。
- **ポップオーバーUI**: クリックでポムとマフィンのセリフ、「10秒休む」「あと1ページ」「メモする」ボタンを表示。
- **検索ループ判定**: ユーザーが記録した検索語に対し、同一テーマの反復回数・継続時間・不安ワード・深夜帯反復を判定。
- **プライバシー設計**: 検索データはローカル（~/Library/Application Support/PomuSearchCompanion/）のみ保存、24時間で自動削除、外部送信コードなし。

## MVP実装済み（2026-07-09）
1. メニューバーに22×22のミニ・ポムを常駐表示
2. 手動テスト表示ピッカーでの5状態切り替え可能
3. Looping/Stuck時のダンス・点滅アニメーション
4. ポップオーバーによるポム＋マフィン表示
5. 「10秒休む」「あと1ページ」「メモする」ボタン実装
6. ローカルログ保存（~/Library/Application Support/...）

## Design Philosophy
**役割**
- 検索を止める、叱る、正解を出すのではなく、「今、安心を探しすぎているかも」と、かわいく身体感覚で知らせる。

**基本定格**
- 急がせない
- 説教しない
- 結論を押し付けない
- 先に踊る、あとから少しだけ話す
- 禁止ではなく、選択肢を出す
- 不安を否定せず、手を止めるきっかけを作る

## Characters

### ポム
- **見た目**: クリームイエロー、ダークチョコレート輪郭、頭にカラメルソース付きプリン。
- **性格**: のんびり、ちょっと眠そう、自分のペースがある、不安を直接論破しない。
- **口調**: 語尾「ぽむ」、ひらがな多め、断定を弱める。

### マフィン
- **見た目**: 白〜ミルク色、ぶち（キャラメルブラウン）、ポムの40〜50%サイズ。
- **性格**: 小さいけれどよく見ている、心配性の味方、深呼吸をすすめる係。
- **口調**: 語尾「でちゅ」、少し赤ちゃんっぽいが核心をつく。

## Technical

### Build & Run
```sh
cd PomuMenuBar
swift run           # 開発実行
./build_app.sh      # .appビルド
open PomuMenuBar.app
```

### Architecture
- **Language**: Swift / SwiftUI
- **UI Framework**: MenuBarExtra (macOS 13+)
- **Data**: ローカルファイル保存（~/Library/Application Support/）
- **外部依存**: なし（有料API回避）

## Deferred / Out of Scope (MVP後)
- Chrome拡張などによる実ブラウザ履歴・検索イベント自動検知
- 開いているタブ数取得
- 同一ページ再訪判定
- アプリアイコン・ログイン時自動起動UI

## Related
- [[People/endo-aoi]]
- [[Commitments/goals-2026]]（安心探しループの観察と緩和）

## Provenance
- [[Sources/src-auto-2026-07-09]] — README / design-guideline.md（2026-07-09 delta from 3_Project/pomu-search-companion/）
