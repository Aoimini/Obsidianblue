# LEMON official site static rebuild

Studioで公開されていた `https://olive681833.studio.site/` をもとに、独自環境へ移しやすい静的HTML/CSSとして再構築したものです。

## Structure

- `public/index.html` - 公開用HTML
- `public/styles.css` - 公開用CSS
- `public/assets/` - Studioサイトから取得した画像・ロゴ・背景素材
- `source/original.html` - 取得時点のStudio公開HTML
- `source/asset-gallery.html` - アセット確認用ギャラリー

## Local preview

```bash
python3 -m http.server 8765
```

Then open:

```text
http://localhost:8765/public/
```

## Deployment

`public/` 配下をそのまま静的ホスティング環境に配置できます。

例:

- Netlify
- Vercel static output
- GitHub Pages
- S3 + CloudFront
- さくら / Xserver などの通常Webサーバー

## Google Forms contact

ContactフォームはGoogleフォームへPOSTする独自デザインフォームです。

Googleフォーム側の情報:

- 回答フォーム: `https://forms.gle/XtuhKVzeRgFnrkjM9`
- 送信先: `https://docs.google.com/forms/d/e/1FAIpQLSfRInkn23eLqlQxKyBbJ5Ob9gZqm6r0w9NNK3cm9I-RB_jIlA/formResponse`

サイト側の各入力名:

- 会社名: `entry.1971247697`
- 氏名: `entry.1625760064`
- メールアドレス: `entry.1146405264`
- 電話番号: `entry.1232560881`
- お問い合せ内容: `entry.2116563505`
- お問い合わせ内容: `entry.2115222511`

Googleフォームの質問を作り直した場合は、上記の`entry.*` IDが変わることがあります。その場合は、公開フォームURLのHTMLから`FB_PUBLIC_LOAD_DATA_`または`entry.`を検索して、新しいIDに差し替えてください。

## Works updates

案件事例は [public/works.html](public/works.html) にまとめています。

追加・修正する場合は、`case-card` を追加・編集してください。

- `data-category="program"` - 番組制作・動画制作
- `data-category="recipe"` - レシピ監修
- `data-category="event"` - イベントサポート

トップページの各「案件事例」ボタンは、`works.html#program` のように別ページへ移動し、該当カテゴリの案件だけを表示します。

更新頻度が増える場合は、案件データをGoogleスプレッドシートやCMSから読み込む形に変更すると、コードを触らずに案件を追加できます。

## Notes

- Studioの巨大なNuxt/JavaScriptランタイムには依存しない構成です。
- 画像は可能な範囲でローカル保存済みです。
- Google FontsとGoogle Maps iframeは外部読み込みです。
- ContactフォームはGoogleフォームへ接続済みです。
- 元サイトのStudioバナー、Studio内部のフォーム送信、Studio CMS連携は移植していません。
