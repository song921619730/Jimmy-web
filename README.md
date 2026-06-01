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
public/resume/Jimmy_Song_AI_3D_Resume.pdf
```

The website download buttons point to this PDF.

## Deployment

Run `npm run build` and deploy the `dist/` directory to any static host. The site does not need a backend.

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
