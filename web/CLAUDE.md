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
- Pages: `src/app/pages/home|job-detail|location|settings-hub|settings|language|preferences|sign-in/` — signed-in `/sign-in` Account hub tabs Profile · Apply · Activity · Rating · Account; **Profile** accordion matches mobile (personal / location / career via `PATCH /v1/me/profile`)
- Standalone **Sign in** page (`/sign-in`): guest stack — Username · Password · **Login**, then **Sign Up → Create new account** (**I am a**: Job Seeker / Recruiter → `intendedRole=seeker|employer`; Post/My Jobs returnUrl preselects Recruiter), then **Guest use → Sign in with Google**. **Signed-in** (drawer profile / avatar) shows the same Account hub as mobile: tabs **Profile** · **Apply** · **Activity** · **Rating** · **Account** (`?tab=`). Seeker login stays on the hub (no home bounce). Not nested under Settings. Drawer **Sign in** (or initials avatar + profile name + red **Log out** when signed in) is the **last** nav block. Old `/settings/account` redirects here (keeps query params). Auth feedback uses bottom-center `ToastService` toasts (success = primary violet, error = red); `friendlyHttpMessage` maps network noise (`Failed to fetch`) to end-user copy.
- User Settings hub (`/settings`): drawer **Settings** (signed-in only) with **vertical left tabs** Language · Preferences (signed-in) · **Site** (admins only); clicked tab loads in the **right panel** (`/settings/language|preferences|site`). Default `/settings` → Language. Old `/language`, `/preferences`, `/admin/settings` redirect here.
- Recruiter desk (`/post`, `employerGuard`): Compose \| Review \| Preview on-page; AI Improve + instruction chat (`AiService` → `/v1/ai/job-enrich`); confirm modal (“did you preview?”) then `directPublish: true` (live — not Blog Approval). Full-width quick form (3-col → 2-col → 1-col). Gate uses `isEmployer()`. Bulk import / Job Fare / Blog Approval links show for admins only
- Admin Site config (`/settings/site`, Settings hub **Site** tab — no separate drawer **Site** item): payments master switch, unlock price, auth TTLs — full-width multi-column field grid (same pattern as Post a job), not a narrow left column. Post-job fee removed (jobs post free)
- Admin Payment history (`/admin/payments`): full-width table + Excel CSV / PDF export → Prisma `SiteConfig` (survives API restart); toolbar controls share `--xcron-btn-height`, Commerce settings link right-aligned
- Admin Notification + Feeds menu labels (`/admin/notifications`, `/my-jobs`): nested under drawer **Logs** (not top-level). Notification page: full-width dispatch + delivery history for job-publish fan-out; wide split (`minmax(0, 1.6fr) / detail`) under 960px+
- Admin Job Fare (`/admin/job-fare`): nested under drawer **Post** (not a top-level drawer item). Telegram/WA bridge status, manual pull with batch-size split, inbox, sources, morning/evening schedule, pull history → `/import?batchId=&tab=review` (Review tab only — Import upload UI stays on the Import tab). Full-bleed page (`width/max-width: 100%`, no 1100px cap) like other admin desks; Channel status facts use multi-column `auto-fit`. Styles use night-sky elevated/wash tokens (`--xcron-bg-elevated`, `--xcron-line`) — no light `#fafafa` / `#f4f4f4` panels (those clash with white ink)
- Bulk import (`/import`): nested under drawer **Post** (with Job Fare). Tabbed **Import** (CSV/paste/OCR) vs **Review** (per-record Edit & publish; no bulk “Approve selected”). **Job Fare pull** sits in the same tab row (outline control next to Import/Review — not `margin-left: auto` / far-right float). Job Fare pull opens Review directly
- Admin Bulk import (`/import`): full-width review **table** with row actions **Edit & publish** / **Chat** / **Improve with AI**; Edit/Chat open a **popup modal** (not page footer) with form fields; save via `PATCH .../records/:id`, chat/AI via `POST .../records/:id/enrich` (`instruction` optional). Stacks to labeled rows under ~760px; modal goes fullscreen on small screens. Edit Save + Post quick form validate via `core/utils/job-form.validation.ts` (required fields + regex for phone/email/URL/salary/vacancies/language)
- Admin Blog Approval (`/blog-approval`): **admin-only** moderator desk for noisy Telegram/import jobs (not the recruiter post path) — big field boxes, Improve with AI + chat, save via `PATCH /v1/admin/jobs/:id`, web/mobile preview before approve. Recruiter live posts never enter this queue when `directPublish` is set
- User Notifications (`/notifications`): **inbox list only** — drawer + top-bar when present; alert channel toggles live on `/settings/preferences`. Lead copy is seeker-facing only (no FCM/SMTP/stub provider wording — that stays on `/admin/notifications`). Shell polls inbox ~20s + on tab focus while signed in. Inbox rows use night-sky wash + blue/magenta accents. **View role** uses notification `data.slug` (SEO path); `data.action=complete_profile` → `/settings/account`, `browse_jobs` → home. Job detail also accepts `/jobs/:id` as a fallback.
- Core: `jobs.service.ts`, `ai.service.ts`, `seo.service.ts`, `site.service.ts`, `ads.service.ts`, `models/job.model.ts`, `utils/format.ts`
- Auth: `AuthService.ensureSession()` (`APP_INITIALIZER` + `adminGuard`) confirms `/auth/me` before admin nav/routes; HttpOnly cookies + in-memory Bearer (sessionStorage refresh fallback); `TabSessionService` one-tab lock (`X-Tab-Id`); `authInterceptor` sends `withCredentials` + CSRF/tab headers and refreshes once on 401 then clears. Local auth is username/password (`/auth/register` + `/auth/login`); Google via GIS button on `/sign-in` (`GoogleIdentityService` + `POST /auth/google`). Sign-in links device via `POST /devices`; logout / session death calls `POST /devices/unlink`. Admin chrome only when `isAdmin()` (validated). Drawer **Post** (+ recruiter **Feeds**/my-jobs) and footer Post link use `isEmployer()`; Job Fare / Import / Logs stay under `isAdmin()`. Routes still use `employerGuard` + register role picker / login `intendedRole=employer`. Site footer (`app.html`) is hidden for admin sessions. Drawer **last** item: **Sign in** (`/sign-in`) when guest; when signed in, a profile row with default initials avatar + name (`displayName` → `username` → `email`) and a red **Log out** button (`App.logout()` → home).
- **Guest chrome:** drawer/header hide Settings · Notifications · Performance Score · Saved jobs · notif bell until `isSignedIn()`; guests keep Home · Get the app · Sign in. Footer filters auth-only quick links via `showFooterQuickLink`. Skill: [../.cursor/skills/xcron-ui-auth/SKILL.md](../.cursor/skills/xcron-ui-auth/SKILL.md)
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
- **Get the app** (Android APK sideload): `shared/get-app-cta` — home **panel** (indigo→coral), footer **band** (elevated night-sky + soft indigo/coral wash; never white→grey), drawer **link** pinned in `.drawer__foot` (gradient CTA). Drawer link stacks **Get the app** + `Android · v{version}` + **Published** date/time from GitHub `published_at`. All CTAs keep white labels on gradient/dark fills. Loads `ApkReleasesService.loadLatest()` → `…/releases/latest`. Prod publish: `node scripts/release-apk.mjs --ship` or tag `v{versionName}` → `.github/workflows/android-release.yml`. `npm run sync:apk` is **local smoke only**. See `public/downloads/README.md`
- Home search: salary / remote / postedWithin / walk-in filters; empty location by default; **Clear preferences** resets filters + prefs. Filter checkboxes are inline flex (not stacked); inputs/selects share 48px control height for grid alignment
- Notification empty states use `--xcron-wash` (not light-grey dashed cards)
- Settings → Preferences: sync to `/v1/me/preferences` when signed in + alert channels; `/me` **Saved jobs** hub (apply profile versions — no CV — + list/Remove + Applications timeline, drawer nav **Saved jobs**); `/performance` Performance Score (drawer + Saved callout); job detail **Easy apply** picks a version; `/me/applications/:id` seeker timeline + in-app chat; `/employer-applications` employer review desk (from My Jobs, shows seeker score + fit %); `/employers/:id` company page; Post/My Jobs via `employerGuard`
- **Apply profiles + easy apply:** `/me` (Saved) + Account **Apply** tab manage multi-version apply profiles (name, headline, band, **skill badges 2–7**, summary, portfolio `Label|url` lines — no CV / no comma-skills text). Job detail loads `/v1/me/apply-profiles` when signed in; **Easy apply** requires a selected version (`POST /v1/jobs/:id/apply` with `applyProfileId`). `/me/applications/:id` shows frozen `applyProfileSnapshot`, timeline, and in-app chat; employers use `?as=employer` (same page, employer message endpoints).
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
