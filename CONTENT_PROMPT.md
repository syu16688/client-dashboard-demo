# Build the site content (project is already scaffolded)

This directory is ALREADY scaffolded and builds cleanly with Vite + React 18 +
TypeScript + Tailwind v3. **Do NOT rescaffold, do NOT reinstall deps, do NOT
touch the build config or vite.config.ts.** `base` is already `/northeast-hvac/`.
Inter font is already loaded in index.html.

Tailwind is configured with these semantic color tokens — USE THESE CLASSES:
- `primary` (cool blue #0A66C2) + `primary-light` `primary-dark`
- `accent` (warm amber #E87722) + `accent-light`
- `surface` `surface-cool` `surface-warm` (cool-gray / warm-tinted backgrounds)
- `ink` (#1C2833 text) + `ink-muted` (#5D6D7E)
- `emergency` (#DC2626 red)
- font family `sans` = Inter; `max-w-content` = 1200px

So e.g. `bg-primary text-white`, `bg-accent`, `bg-surface-cool`, `text-ink-muted`,
`bg-emergency`, etc.

## Your job
Read **BUILD_PROMPT.md** in this directory and build the COMPLETE marketing
website it describes — all 10 sections, the dual cooling(blue)/heating(amber)
services layout, realistic testimonials, the front-end-only quote form with a
thank-you state, the dark footer, etc.

Write `src/App.tsx` and split the page into clean components under
`src/components/`. Real Unsplash photos (HVAC technicians / vans / equipment —
no ice/fire clichés), descriptive alt text, lazy-loaded. Mobile-first
responsive down to 360px. No lorem ipsum, no placeholder text, no broken links.

## Finish criteria
1. Run `npm run build` yourself and fix until `dist/` builds with ZERO errors.
2. Write a short `BUILD_NOTES.md` (components built + confirm build succeeded).
Work efficiently and autonomously. Do not ask questions.
