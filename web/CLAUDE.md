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
- Pages: `src/app/pages/home|job-detail|location|settings-hub|settings|language|preferences|sign-in/`
- User Settings hub (`/settings`): drawer **Settings** with **vertical left tabs** Account · Language · Preferences · **Site** (admins only); clicked tab loads in the **right panel** (`/settings/account|language|preferences|site`). Default `/settings` → Account. Old `/language`, `/preferences`, `/sign-in`, `/admin/settings` redirect here (sign-in keeps query params).
- Admin Post job (`/post`): full-width quick form (3-col → 2-col → 1-col); description/contacts span; paste mode stays full-bleed textarea
- Admin Site config (`/settings/site`, Settings hub **Site** tab — no separate drawer **Site** item): payments master switch, post-job fee mode, unlock/post prices, auth TTLs — full-width multi-column field grid (same pattern as Post a job), not a narrow left column
- Admin Payment history (`/admin/payments`): full-width table + Excel CSV / PDF export → Prisma `SiteConfig` (survives API restart); toolbar controls share `--xcron-btn-height`, Commerce settings link right-aligned
- Admin Notification + Feeds menu labels (`/admin/notifications`, `/my-jobs`): nested under drawer **Logs** (not top-level). Notification page: full-width dispatch + delivery history for job-publish fan-out; wide split (`minmax(0, 1.6fr) / detail`) under 960px+
- Admin Job Fare (`/admin/job-fare`): nested under drawer **Post** (not a top-level drawer item). Telegram/WA bridge status, manual pull with batch-size split, inbox, sources, morning/evening schedule, pull history → `/import?batchId=&tab=review` (Review tab only — Import upload UI stays on the Import tab). Full-bleed page (`width/max-width: 100%`, no 1100px cap) like other admin desks; Channel status facts use multi-column `auto-fit`. Styles use night-sky elevated/wash tokens (`--xcron-bg-elevated`, `--xcron-line`) — no light `#fafafa` / `#f4f4f4` panels (those clash with white ink)
- Bulk import (`/import`): nested under drawer **Post** (with Job Fare). Tabbed **Import** (CSV/paste/OCR) vs **Review** (per-record Edit & publish; no bulk “Approve selected”). **Job Fare pull** sits in the same tab row (outline control next to Import/Review — not `margin-left: auto` / far-right float). Job Fare pull opens Review directly
- Admin Bulk import (`/import`): full-width review **table** with row actions **Edit & publish** / **Chat** / **Improve with AI**; Edit/Chat open a **popup modal** (not page footer) with form fields; save via `PATCH .../records/:id`, chat/AI via `POST .../records/:id/enrich` (`instruction` optional). Stacks to labeled rows under ~760px; modal goes fullscreen on small screens. Edit Save + Post quick form validate via `core/utils/job-form.validation.ts` (required fields + regex for phone/email/URL/salary/vacancies/language)
- Admin Blog Approval (`/blog-approval`): moderator desk for noisy Telegram/import jobs — big field boxes, Improve with AI + chat instructions (`AiService` → `/v1/ai/job-enrich`), save via `PATCH /v1/admin/jobs/:id`, web/mobile preview toggle before approve. Page host is `display: block`; long Telegram URLs in queue titles/fields must `overflow-wrap` so they do not blow out the shell width
- User Notifications (`/notifications`): **inbox list only** — drawer + top-bar when present; alert channel toggles live on `/settings/preferences`. Shell polls inbox ~20s + on tab focus while signed in. Inbox rows use night-sky wash + blue/magenta accents. **View role** uses notification `data.slug` (SEO path). Job detail also accepts `/jobs/:id` as a fallback.
- Core: `jobs.service.ts`, `ai.service.ts`, `seo.service.ts`, `site.service.ts`, `ads.service.ts`, `models/job.model.ts`, `utils/format.ts`
- Auth: `AuthService.ensureSession()` (`APP_INITIALIZER` + `adminGuard`) confirms `/auth/me` before admin nav/routes; stores access + refresh tokens (not Google idToken); `authInterceptor` refreshes once on 401 then clears. Sign-in links device via `POST /devices`; logout / session death calls `POST /devices/unlink`. Admin chrome only when `isAdmin()` (validated). Site footer (`app.html`) is hidden for admin sessions.
- Env: `src/environments/environment*.ts` (`apiUrl`, `siteUrl`, `siteName`)
- SSR extras in `server.ts`: `/sitemap.xml`, robots hints

## Product / SEO rules

- Brand **X Cron** is hero-level on marketing surfaces; premium night sky + violet→amber CTAs (see root CLAUDE.md)
- Guest-readable job pages; employer contact shown on detail. Keep phone/email/WhatsApp out of meta / JSON-LD
- Use `SeoService` for title/description/canonical on every public page
- Keep shareable canonical URLs aligned with job slugs from the API
- Home ad rail is removed; do not reintroduce unlabelled promo cards as jobs
- Promoted jobs may show a badge when API returns `promoted` / `promotionBadge`

## UI / UX (follow monorepo standards)

Full standards: [../CLAUDE.md](../CLAUDE.md) § **UI / UX standards**. Web specifics:

- Fonts loaded in `src/index.html` (Outfit + Manrope + Fraunces italic quote + Noto Sans Tamil). Home hero quote uses soft Fraunces italic + curly quotes.
- Design tokens + motion in `src/styles.scss` (incl. shared `--xcron-text-*` type scale); shell in `src/app/app.scss` (gradient primary CTAs, night-sky chrome, starfield)
- Job detail uses role tokens (Outfit titles, Manrope body/UI) — keep in sync with mobile job-detail
- **Full-bleed shell:** `.shell` is `width: 100%` with `--xcron-pad-x`; sticky `.top` spans `100vw` so it does not read as an inset square
- Home: oversized brand hero, floating search panel, elevated job cards with stagger/hover
- **Get the app** (Android APK sideload): `shared/get-app-cta` — home **panel** (indigo→coral), footer **band** (elevated night-sky + soft indigo/coral wash; never white→grey), drawer **link** (gradient CTA). All CTAs keep white labels on gradient/dark fills. Loads `ApkReleasesService.loadLatest()` → `…/releases/latest`. Prod publish: `node scripts/release-apk.mjs --ship` or tag `v{versionName}` → `.github/workflows/android-release.yml`. `npm run sync:apk` is **local smoke only**. See `public/downloads/README.md`
- Home search: salary / remote / postedWithin / walk-in filters; empty location by default; **Clear preferences** resets filters + prefs. Filter checkboxes are inline flex (not stacked); inputs/selects share 48px control height for grid alignment
- Notification empty states use `--xcron-wash` (not light-grey dashed cards)
- Settings → Preferences: sync to `/v1/me/preferences` when signed in + alert channels; `/me` **Saved jobs** hub (list + Remove, drawer nav **Saved jobs**); `/employers/:id` company page; Post/My Jobs via `employerGuard`
- Home / Discover **Open roles** badge uses API search `total` (stable while infinite-scroll appends pages)
- Job cards show uploaded/published **date + time** via `formatPostedDate`
- Home job-list type ladder (aligned with mobile `job-card`): title Outfit `--xcron-text-title` / bold / ink; employer Manrope body / medium / ink-soft; facts + time Manrope meta (time faint); CTA label token
- Job detail contact: show phone/email/WhatsApp/website directly from the public job DTO (no unlock/paywall); Save/Share sit as a secondary side-by-side pair
- Stay visually aligned with mobile (`:4200`); do not regress to sharp boxes / system fonts / flat white-only chrome

## When changing code

- Prefer SSR-safe code (no `window` without guards)
- Job list/detail must tolerate API down (clear error, empty state)
- After route or SEO changes, verify sitemap still lists published jobs when API is up
- Keep UI on the shared night-sky token system (web + mobile aligned); do not regress to light mint/teal, monochrome, or solid-navy-only CTAs
- Keep changes scoped — no drive-by refactors

## Out of scope for this package

- Bulk import / Job Fare admin desks stay admin-only (Post/My Jobs are employer+admin)
- Hosted PSP SDKs (Razorpay Checkout widget) — UPI panel + stub/dev confirm only for now; follow `.cursor/skills/xcron-payments`
