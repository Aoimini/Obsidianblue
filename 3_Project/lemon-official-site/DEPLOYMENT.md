# LEMON Official Site Deployment

## Recommended Hosting

Use Cloudflare Pages for the public site.

- Hosting cost: free tier is enough for this static HTML/CSS site.
- GitHub integration: enabled.
- Build command: leave blank.
- Build output directory: `public`
- Production branch: `main`

## GitHub Repository

Create a dedicated repository for this site, for example:

```text
Aoimini/lemon-official-site
```

This project should be managed as a standalone site repository instead of using the current `Obsidianblue` repository.

## Cloudflare Pages Setup

1. Create a Cloudflare account or log in.
2. Go to Workers & Pages.
3. Select Create application > Pages > Connect to Git.
4. Connect GitHub and select the LEMON site repository.
5. Set the build settings:
   - Framework preset: None
   - Build command: blank
   - Build output directory: `public`
6. Deploy and confirm the temporary `*.pages.dev` URL.
7. Add the custom domain after checking the temporary URL.

## Domain

Preferred domain:

```text
lemonfood.co.jp
```

Important notes:

- `.co.jp` is for companies registered in Japan.
- As a general rule, one organization can register one `.co.jp` domain.
- Registration usually requires company information that matches the corporate registry.
- The domain fee is separate from hosting.

After the domain is registered, add it to Cloudflare Pages as a custom domain and update DNS according to Cloudflare's instructions.

## Pre-Launch Checklist

- Check all pages on desktop and smartphone.
- Confirm the contact form submits correctly.
- Confirm Google Form notifications arrive at the intended Gmail address.
- Confirm `privacy.html` is linked from the footer and contact form.
- Confirm `works.html` filters work as expected.
- Confirm no test URLs or local paths remain in public pages.
- Confirm the domain opens with HTTPS.
