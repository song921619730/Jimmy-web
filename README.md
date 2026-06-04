# GangJin Song AI + 3D Portfolio

Static H5 portfolio for GangJin Song / 宋港进, built with Vite, React, TypeScript, Framer Motion and optimized local media.

## Commands

```powershell
npm install
npm run prepare:media
npm run generate:resume
npm run dev
npm run build
npm run preview
```

## Media Pipeline

Original assets stay in `resource/` and are not modified.

`npm run prepare:media` generates:

- `public/media/thumbs/`: WebP thumbnails around 640px.
- `public/media/large/`: optimized large WebP images around 1920px.
- `public/media/posters/`: video poster frames.
- `public/media/videos/`: copied video files.
- `src/data/generatedMedia.ts`: generated media manifest used by the app.

## Resume PDF

`npm run generate:resume` writes:

```text
public/resume/GangJin_Song_Resume_ZH.pdf
public/resume/GangJin_Song_Resume_EN.pdf
```

The website download button points to the Chinese PDF in Chinese mode and the two-page English PDF in English mode. A legacy Chinese copy is also written to `public/resume/Jimmy_Song_AI_3D_Resume.pdf`.

## Deployment

This is a pure static Vite site. You can deploy it with any static host.

### Recommended: GitHub Pages (auto deploy)

1. Create a GitHub repository and push this project to `main`.
2. In GitHub > Settings > Pages, set Source to `GitHub Actions`.
3. Push to `main` (or add `.github/workflows/deploy.yml` manually in your repo).
4. GitHub Actions will run `npm run build` and publish `dist/` automatically.
5. Your site will be available at `https://<your-github-username>.github.io/<repo>/`.

The repository already includes `.github/workflows/deploy.yml` for one-click deploy.

### Manual deploy fallback

- Run:

```powershell
npm run build
```

- Upload the `dist/` directory to any static host such as Vercel, Netlify, Cloudflare Pages, or any CDN.

## Acceptance Checklist

- Header navigation works on desktop and mobile.
- English / Chinese language toggle updates page copy.
- Selected Works switches one project per wheel, key or swipe input.
- Selected Works releases normal page scroll at first and last project boundaries.
- Gallery filters by category.
- Horizontal / Square / Vertical ratio controls change crop presentation.
- Work modal shows all optimized media for each project.
- Resume PDF downloads.
- Email copy button works.
- Unknown social links are hidden.
- Mobile layout has no horizontal overflow.
- Production build completes with `npm run build`.
