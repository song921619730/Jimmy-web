# Agent Notes

## Project

This repository is GangJin Song / Jimmy Song's personal portfolio website.

It is a static Vite + React + TypeScript site for an AI + 3D workflow artist. The site includes a bilingual portfolio, selected works, gallery, resume content, optimized local media, and a WebGL black-hole/starfield background.

## Tech Stack

- Vite
- React
- TypeScript
- Three.js for the black-hole shader background
- GSAP and Framer Motion for motion
- Local media processing with Node scripts and Sharp

## Common Commands

```powershell
npm install
npm run dev
npm run build
npm run preview
npm run prepare:media
npm run generate:resume
npm run verify
```

For local development, keep one dev server for this project. The current preferred local URL is:

```text
http://127.0.0.1:5174/
```

If multiple Vite servers are running for this same project, stop the extra ones and keep a single active server.

## Important Paths

- `src/App.tsx`: main page composition.
- `src/components/`: React components.
- `src/components/ParticleBackground.tsx`: canvas/WebGL background orchestration.
- `src/components/blackHoleShader.ts`: black-hole and starfield shader.
- `src/data/`: profile, project, and generated media data.
- `src/styles/index.css`: global layout and visual styles.
- `resource/`: original source media. Do not modify originals.
- `public/media/`: generated optimized media.
- `public/resume/`: generated resume PDF.
- `scripts/prepare-media.mjs`: media optimization pipeline.
- `scripts/generate-resume-pdf.mjs`: resume PDF generation.

## Working Rules

- Do not revert user changes unless explicitly asked.
- Keep edits narrowly scoped to the requested behavior.
- Prefer existing project patterns over introducing new abstractions.
- Use `npm run build` after code or shader changes.
- For media changes, update originals in `resource/`, then run `npm run prepare:media`.
- For resume PDF changes, run `npm run generate:resume`.
- For full verification, run `npm run verify`.
- Avoid starting multiple dev servers. Reuse the active local server when possible.

## Visual Guidelines

- Keep the site dark, cinematic, and portfolio-focused.
- Preserve text readability over background effects.
- The black-hole background should stay subtle and should not compete with the hero copy.
- Star/light streaks around the black hole should follow the black-hole center and feel orbital, not random.
- Avoid adding decorative effects that make the page feel noisy or less professional.
- For responsive changes, check both desktop and mobile layouts.

## Git Notes

- Check `git status --short` before editing.
- There may be unrelated dirty files in the worktree. Leave them alone.
- Do not run destructive git commands such as `git reset --hard` or `git checkout --` unless the user clearly asks for that exact operation.
