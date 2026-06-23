---
type: report
report: orientation
phase: 1-orientation
created: 2026-06-23
status: awaiting-user-approval
---

# ORIENTATION REPORT — Compiled Vault Brain

作成日: 2026-06-23
担当: Claude Code (Opus 4.8)
状態: **Hard Checkpoint 1 — ユーザー承認待ち**

---

## 1. 確認済みの基本情報 (Confirmed Basics)

| 項目 | 値 |
|---|---|
| 現在の作業ディレクトリ | `/Users/aoi/Desktop/Bluenote` |
| 出力ルート | `/Users/aoi/Desktop/Bluenote/Compiled-Vaults/compiled-vault-brain-2026-06-23/` |
| 元vaultの扱い | **読み取り専用**（一切変更しない） |
| ユーザー承認 | 「全部OK」= ローカル＋全コネクタ利用可、フェーズ1後に再確認の方針で合意 |

ユーザー本人（複数ソースから一致）:
- 氏名: **遠藤 葵 (Endo Aoi)** / 表示名 あおい
- Gmail: `aoiendo05@gmail.com`
- 所属(Slack Org): **Concon Inc**
- 学籍: 放送大学（Open University Japan）— Notion アカウントに紐づく

---

## 2. ローカルソース棚卸し (Local Source Inventory)

Markdown 合計 **738ファイル**（うち `.claude/` 配下290はClaude自身の作業ファイルで対象外）。
実コンテンツ対象は約 **448 md + 周辺ファイル**。

| 場所 | md数 | 中身 | 優先度 |
|---|---|---|---|
| `2_daily/` | 234 | 日次ノート（日記・習慣・目標・行動ログ）2025〜2026/06 | 高（行動・価値観・open loops の宝庫） |
| `5_Docs/木曜会/プロフィール帳/` | 95 | **AI木曜会**の人物プロフィール帳 | 最高（People の中核） |
| `5_Docs/転職/` | 7 | 転職リサーチ（VOISHING / notahotel / yutori / クラシコム / 東宝 / 履歴書 / 職務経歴書） | 高（Companies + Decision） |
| `5_Docs/収支/`・`3_Project/支出管理/` | ~10 | 家計（PayPay・三井住友カード明細、支出管理） | 中（Procedure: 家計記入 / 機微情報） |
| `5_Docs/自主マス/`・`note/`・`英語/`・`読書/` | ~13 | 就活講座スライド・note・英語学習・読書メモ | 中 |
| `3_Project/` | 12+ | Life Balance（アプリ）/ non-no（雑誌記事）/ 会社だるま_IVS（動画企画）/ 支出管理 | 高（Projects の中核） |
| `1_Inbox/` | 27 | 思考メモ・読書記録・企画アイデア・趣味（レシピ） | 中（Topics / Preferences） |
| `6_Personnal/` | 6 | ストレングスファインダー・やりたいこと・転職・占い | 高（Preferences / 自己理解） |
| `4_template/` | 5 | 日記・日報・読書記録テンプレ | 低（構造参照用） |
| `Clippings/` | 37 | Web クリップ（nonno / work） | 低〜中（参照素材） |

### 初期・高シグナルなエンティティ
- **人物ネットワーク: AI木曜会**（usutaku=臼井拓水 創設者、Michikusa株式会社）+ 約95名のプロフィール
- **クライアントワーク**: non-no（雑誌/SNS記事）、会社だるま_IVS（インタビュー動画企画）、デジマ案件
- **自社/所属**: Concon Inc
- **自主プロダクト**: Life Balance（アプリ、要件定義あり）、各種ブラウザゲーム（dive-game / eraser-game / hangul-pocha）
- **転職リサーチ対象企業**: VOISHING / NOT A HOTEL / yutori / クラシコム / 東宝
- **家計管理**: PayPay・三井住友カード明細 →スプレッドシート記入フロー（既存skill `okane-entry` / `meisai-md` あり）
- **自己理解の核**: ストレングスファインダーTOP（アレンジ/個別化/分析思考/慎重さ/着想 — 軍師型）

---

## 3. コネクタ検証 (Connector Verification) — 全て読み取りで実施

| コネクタ | 接続アカウント | 一致 | 取り込み可否 |
|---|---|---|---|
| **Gmail** | `aoiendo05@gmail.com`（ラベル: ✈️, Oliveデビット通知） | ✅ 本人 | 承認済み（スモークパスで5-10通から） |
| **Google Calendar** | `aoiendo05@gmail.com`（プライベート/家族/★/日本の祝日） | ✅ 本人 | 承認済み |
| **Google Drive** | `aoiendo05@gmail.com` | ✅ 本人 | 承認済み |
| **Slack** | `aoiendo05` / 遠藤 葵 / Org **Concon Inc** (U0B5BQDULLT) | ✅ 本人 | 承認済み |
| **Notion** | ⚠️ **`Aostu` / `2520095291@campus.ouj.ac.jp`（放送大学アカウント）** | ⚠️ 別アカウント | **要確認（下記フラグ）** |

詳細は `SOURCE-MANIFEST.md` に記録。

---

## 4. ブロッカー / 要確認フラグ (Blockers)

1. **⚠️ Notion が別アカウントに接続されている**
   Gmail/Slack/Drive は `aoiendo05@gmail.com`（本人）だが、Notion だけ放送大学の学籍アカウント
   `2520095291@campus.ouj.ac.jp`（表示名 Aostu）に繋がっている。
   - これがあなたのメインNotionでない場合、取り込むと別人格/別用途のデータが混ざる恐れ。
   - → **このNotionを取り込み対象に含めてよいか確認したい。**（含めない／含める／メインに繋ぎ直す）

2. **機微情報の扱い（家計・金融）**
   `収支/`・`支出管理/` にカード明細・PayPay履歴あり。Gmail にも「Oliveデビット通知」ラベル。
   方針: **金額の生データは最小限に要約**し、口座番号・カード番号・認証コード等は一切コピーしない。
   家計の「やり方」は Procedure として残す。→ この方針でよいか確認。

3. **大容量・非テキスト資産**
   ルートに動画（554MB mp4）、Drive に多数のMOV、PDF/PPTX/DOCX。これらは**内容を取り込まずメタ情報＋参照リンクのみ**を Sources に残す方針。

---

## 5. 提案する取り込み計画 (Proposed Ingestion Plan)

コンパイラ方式: `parse → group → classify → extract → canonicalize → 出典付与 → author → linkвалидation → critic`

**フェーズ2: スモークパス（次の作業・承認後）**
- ローカル: 高シグナルから着手（木曜会プロフィール→People、転職→Companies+Decision、3_Project→Projects、6_Personnal+日記→Preferences/自己理解）
- Gmail: 高シグナルなスレッド 5-10 件のみ
- 成果物として 3-5枚の canonical note、source trace 1、context pack 1、SOURCE-MANIFEST、VALIDATION-REPORT を提示
- → **Hard Checkpoint 2 で再度停止し、本格取り込みの可否を確認**

**フェーズ3以降（承認後）**: ローカル全体の本格取り込み → Gmail直近60-120日の300-500スレッド → エンティティ特化パス。深い履歴取り込みは明示承認時のみ。

**外部書き込み（メール送信・カレンダー登録・Notion書き込み等）は一切行わない**（明示承認がない限り）。

---

## 6. 次のアクション（あなたの返答待ち）

以下を確認したら、フェーズ2（スモークパス）に進みます:

- **Q1. Notion**（放送大学アカウント）を取り込み対象に含める？ → 含める / 含めない / 後でメイン垢に繋ぎ直す
- **Q2. 家計・金融の機微情報** → 「金額は要約・口座/カード番号等は非コピー」方針でOK？
- **Q3. スモークパスはローカル優先で着手**（Gmailは5-10通の軽いパス）でOK？

承認をもらえれば、上記方針でスモークパスを実行します。
