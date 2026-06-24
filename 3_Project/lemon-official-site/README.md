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

## Notes

- Studioの巨大なNuxt/JavaScriptランタイムには依存しない構成です。
- 画像は可能な範囲でローカル保存済みです。
- Google FontsとGoogle Maps iframeは外部読み込みです。
- Contactフォームは見た目を再現した静的フォームです。送信機能を使う場合は、Formspree、Google Forms、Netlify Forms、独自APIなどの送信先に `form action` を差し替えてください。
- 元サイトのStudioバナー、Studio内部のフォーム送信、Studio CMS連携は移植していません。
