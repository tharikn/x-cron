# CLAUDE.md — `web/` (Angular SSR)

X Cron Jobs **public SEO site**. Dev server `:4201`. Production-like SSR: build then `serve:ssr` → `:4000`.

Parent monorepo: [../CLAUDE.md](../CLAUDE.md) · [../docs/DEVELOPER.md](../docs/DEVELOPER.md) · [../docs/FILE_MAP.md](../docs/FILE_MAP.md)

## Commands

```bash
npm install
npm start                  # ng serve --port 4201
npm run build              # development config
npm run build:prod
npm run serve:ssr          # node dist/web/server/server.mjs  (after build)
```

API dependency: `environment.apiUrl` (default `http://localhost:3000/v1`). Start `../api` for live jobs.

## Architecture

- Angular 22 + `@angular/ssr` + Express (`src/server.ts`)
- Entry: `main.ts` (browser), `main.server.ts` + `server.ts` (SSR)
- App: `src/app/app.ts`, configs `app.config.ts` / `app.config.server.ts`
- Routes: `app.routes.ts` + `app.routes.server.ts`
- Pages: `src/app/pages/home|job-detail|location/`
- Core: `jobs.service.ts`, `seo.service.ts`, `ads.service.ts`, `models/job.model.ts`, `utils/format.ts`
- Env: `src/environments/environment*.ts` (`apiUrl`, `siteUrl`, `siteName`)
- SSR extras in `server.ts`: `/sitemap.xml`, robots hints

## Product / SEO rules

- Brand **X Cron** is hero-level on marketing surfaces; monochrome only
- Guest-readable job pages; **no unmasked contacts** in HTML, meta, or JSON-LD
- Use `SeoService` for title/description/canonical on every public page
- Keep shareable canonical URLs aligned with job slugs from the API
- Home may show a **labelled** ad rail (`ads.service` → `web_home_rail`); never disguise ads as jobs
- Promoted jobs may show a badge when API returns `promoted` / `promotionBadge`

## When changing code

- Prefer SSR-safe code (no `window` without guards)
- Job list/detail must tolerate API down (clear error, empty state)
- After route or SEO changes, verify sitemap still lists published jobs when API is up
- Do not add colorful UI themes; stay black/white/grayscale
- Keep changes scoped — no drive-by refactors

## Out of scope for this package

- Employer posting, OTP unlock UI, bulk import (those live in `mobile/` + `api/`)
- Live payment checkout UI (API stubs; mobile handles seeker checkout today)
