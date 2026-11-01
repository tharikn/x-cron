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

API dependency: `environment.apiUrl` — local (`npm start`) uses `http://localhost:3000/v1`; prod build swaps in `environment.prod.ts` (`https://x-cron-api.onrender.com/v1`). Start `../api` for live jobs.

## Architecture

- Angular 22 + `@angular/ssr` + Express (`src/server.ts`)
- Entry: `main.ts` (browser), `main.server.ts` + `server.ts` (SSR)
- App: `src/app/app.ts`, configs `app.config.ts` / `app.config.server.ts`
- Routes: `app.routes.ts` + `app.routes.server.ts`
- Pages: `src/app/pages/home|job-detail|location|settings/`
- Admin Settings (`/settings`): payments master switch, post-job fee mode, unlock/post prices, auth TTLs
- Admin Payment history (`/admin/payments`): table + Excel CSV / PDF export → Prisma `SiteConfig` (survives API restart)
- Admin Alert log (`/admin/notifications`): dispatch + delivery history for job-publish fan-out
- Admin Job Fare (`/admin/job-fare`, drawer **Job Fare**): Telegram/WA bridge status, manual pull with batch-size split, inbox, sources, morning/evening schedule, pull history → `/import?batchId=&tab=review` (Review tab only — Import upload UI stays on the Import tab)
- Bulk import (`/import`): tabbed **Import** (CSV/paste/OCR) vs **Review** (per-record Edit & publish; no bulk “Approve selected”). Job Fare pull opens Review directly
- Admin Bulk import (`/import`): full-width review **table** with row actions **Edit & publish** / **Chat** / **Improve with AI**; Edit/Chat open a **popup modal** (not page footer) with form fields; save via `PATCH .../records/:id`, chat/AI via `POST .../records/:id/enrich` (`instruction` optional). Stacks to labeled rows under ~760px; modal goes fullscreen on small screens
- Admin Blog Approval (`/blog-approval`): moderator desk for noisy Telegram/import jobs — big field boxes, Improve with AI + chat instructions (`AiService` → `/v1/ai/job-enrich`), save via `PATCH /v1/admin/jobs/:id`, web/mobile preview toggle before approve. Page host is `display: block`; long Telegram URLs in queue titles/fields must `overflow-wrap` so they do not blow out the shell width
- User Notifications (`/notifications`): **inbox list only** (drawer nav + top-bar bell with unread count). Alert channel toggles live on `/preferences`. Shell polls inbox ~20s + on tab focus while signed in. Only the unread **count badge** uses red (`#e11d48`); inbox/new row chrome stays soft monochrome. **View role** uses notification `data.slug` (SEO path). Job detail also accepts `/jobs/:id` as a fallback.
- Core: `jobs.service.ts`, `ai.service.ts`, `seo.service.ts`, `site.service.ts`, `ads.service.ts`, `models/job.model.ts`, `utils/format.ts`
- Auth: `AuthService.ensureSession()` (`APP_INITIALIZER` + `adminGuard`) confirms `/auth/me` before admin nav/routes; stores access + refresh tokens; `authInterceptor` refreshes once on 401 then clears. Admin chrome only when `isAdmin()` (validated). Site footer (`app.html`) is hidden for admin sessions.
- Env: `src/environments/environment*.ts` (`apiUrl`, `siteUrl`, `siteName`)
- SSR extras in `server.ts`: `/sitemap.xml`, robots hints

## Product / SEO rules

- Brand **X Cron** is hero-level on marketing surfaces; monochrome only
- Guest-readable job pages; **no unmasked contacts** in HTML, meta, or JSON-LD
- Use `SeoService` for title/description/canonical on every public page
- Keep shareable canonical URLs aligned with job slugs from the API
- Home may show a **labelled** ad rail (`ads.service` → `web_home_rail`); never disguise ads as jobs
- Promoted jobs may show a badge when API returns `promoted` / `promotionBadge`

## UI / UX (follow monorepo standards)

Full standards: [../CLAUDE.md](../CLAUDE.md) § **UI / UX standards**. Web specifics:

- Fonts loaded in `src/index.html` (Syne + DM Sans + Noto Sans Tamil)
- Design tokens + motion in `src/styles.scss`; shell in `src/app/app.scss`
- Home: oversized brand hero, floating search panel, elevated job cards with stagger/hover
- Home search starts with empty location (optional saved prefs only); **Clear preferences** resets filters + device prefs
- Preferences page: search prefs (Save + Clear) + signed-in **Alert channels** (job/in-app/push/email); inbox link to `/notifications`
- Home / Discover **Open roles** badge uses API search `total` (stable while infinite-scroll appends pages)
- Job cards show uploaded/published **date + time** via `formatPostedDate`
- Job detail contact: private/unlocked badge, channel chips, frosted vault peek, Unlock CTA → in-page **Pay to unlock** panel (UPI QR / UPI ID when `PAYMENT_GATEWAY=upi`); Save/Share sit as a secondary side-by-side pair
- Stay visually aligned with mobile (`:4200`); do not regress to sharp boxes / system fonts / flat white-only chrome

## When changing code

- Prefer SSR-safe code (no `window` without guards)
- Job list/detail must tolerate API down (clear error, empty state)
- After route or SEO changes, verify sitemap still lists published jobs when API is up
- Do not add colorful UI themes; stay black/white/grayscale per UI standards
- Keep changes scoped — no drive-by refactors

## Out of scope for this package

- Employer posting, bulk import (those live in `mobile/` + `api/`)
- Hosted PSP SDKs (Razorpay Checkout widget) — UPI panel + stub/dev confirm only for now; follow `.cursor/skills/xcron-payments`
