# X Cron Jobs (monorepo)

Local-first, multilingual job discovery (India-first). PRD baseline v1.0.  
**Brand:** X Cron / Jobs. **Audience:** younger job seekers (Gen Z–first).

## Packages

| Dir | Role | CLAUDE.md |
| --- | --- | --- |
| `api/` | NestJS `/v1/*` API | [api/CLAUDE.md](api/CLAUDE.md) |
| `mobile/` | Ionic + Capacitor Android client | [mobile/CLAUDE.md](mobile/CLAUDE.md) |
| `web/` | Angular SSR public SEO site | [web/CLAUDE.md](web/CLAUDE.md) |
| `e2e/` | Playwright journeys (mobile + web + opt-in Android) | [e2e/README.md](e2e/README.md) |
| `docs/` | Roadmap, FILE_MAP, DEVELOPER, [SYSTEM_ARCHITECTURE.md](docs/SYSTEM_ARCHITECTURE.md), [REDIS.md](docs/REDIS.md), MVP notes | — |

**E2E:** from repo root `npm run test:e2e` → `scripts/run-e2e.mjs` (API + clients + Playwright api+mobile+web; `npm run test:e2e:api` = browserless `/v1` contract specs). **Unit:** `npm test` in `api/`, `npm run test:unit` in `web/` + `mobile/`. Android Chrome (emulator/device): `npm run test:e2e:android` (needs `adb devices`). Failures listed in `e2e/test-results/ISSUES.md`.

## UI / UX standards (web + mobile)

Keep **web (`:4201`)** and **mobile (`:4200`)** visually aligned. Prefer modern app feel over print/classifieds or raw-form HTML.

### Brand & color

- Brand name **X Cron** is a hero-level signal on Discover/home; **Jobs** is a small uppercase secondary label.
- **Premium night sky:** purple-black canvas (`#070412`), starfield wash, violet→amber CTAs (avoid blue/rose pairing).
- Tokens: `--xcron-primary` `#7c5cff`, `--xcron-primary-hover` `#9580ff`, `--xcron-accent` `#f5a524`, `--xcron-cta-gradient` violet→amber, `--xcron-ink` `#ffffff`, `--xcron-bg` `#070412`, `--xcron-bg-elevated` `#14101f`, `--xcron-wash` `#1b162b`, `--xcron-line` `#2a2440`, danger `#f43f5e`, success `#22c55e`.
- Atmosphere via night-sky gradients + star dots + amber/violet radial glow + elevated dark cards — not flat white or solid navy-only chrome.
- Dark product theme is the brand default (`html[data-theme=dark]` / `:root`). Signed-in Settings → **Theme** also offers System / Light / Warm (`ThemeService` + prefs `theme`). Avoid light mint/teal regressions and solid-blue-only CTAs (use `--xcron-cta-gradient` for primary actions).

### Typography

- Display / brand: **Outfit** (`--xcron-display` / `--xcron-font-display`) — page titles + section headers only.
- Quote / hero line: **Fraunces** italic (`--xcron-quote` / `--xcron-font-quote`) — warm soft curly-quoted home headline only.
- Body / UI: **Manrope** (`--xcron-sans` / `--xcron-font-body`) — meta, body, labels, buttons, inputs, tabs.
- Tamil: **Noto Sans Tamil** as fallback alongside the pair above.
- Do **not** use system defaults as the primary face (Segoe UI, Arial, Roboto, Inter).
- Shared type-scale tokens (web `styles.scss` + mobile `variables.scss`): `--xcron-text-display|title|body|meta|label|button`, `--xcron-weight-*`, `--xcron-leading-*`, `--xcron-tracking-*`. Prefer these over one-off `font-size` / `font-weight`.
- Role map: display ~22–36px / 700 Outfit · title 17px / 600 Outfit · body 15px / 400 Manrope · meta 14px / 500 · label 11px / 600 · button 15px / 600.
- Tight display tracking on brand/headlines; clear hierarchy (title → employer → facts → about).

### Shape, depth, controls

- Rounded corners: ~10–14px controls/cards, ~22px large panels (`--xcron-radius*`). Avoid sharp `border-radius: 0` chrome.
- Soft elevation (`--xcron-shadow` / hover) with deep night-sky shadows instead of hairline-only boxes.
- Primary actions: violet→amber gradient (`--xcron-cta-gradient`), white label. Secondary: outline / translucent fill with light text.
- Badges/chips: compact uppercase, pill radius OK for meta only — do not overuse pill clusters.
- Inputs sit on purple wash backgrounds with violet focus ring (`--xcron-wash` + 3px primary glow). Shared baseline lives in web `styles.scss` / mobile `global.scss`; `app-pii-field` styles its own input (Angular encapsulation).

### Layout & content UX

- Web shell stays centered at `min(1080px, calc(100% - 2rem))`; mobile `ion-app` keeps the 480px phone frame on wide viewports.
- Mobile-first density; thumb-friendly tap targets (~44px+); CTAs use `--xcron-btn-height` (gradient primary + outline secondary).
- First viewport: brand + one headline + one short lead + search/CTA — avoid clutter (no stat strips, promo stickers on hero media).
- Job rows/cards are the interactive containers; hover/press lift + optional “View role” cue.
- Guest browse is first-class; employer contact (phone/email/WhatsApp/website) is shown directly on job detail — no unlock paywall.
- **Guest chrome:** hide Settings, Notifications, My Rating, Applied jobs, and Saved jobs (plus header notif bell / auth-only footer quick links) until `isSignedIn()` after `/auth/me`. Guests keep Home/Discover, Get the app, and Sign in. Follow [`.cursor/skills/xcron-ui-auth/SKILL.md`](.cursor/skills/xcron-ui-auth/SKILL.md).
- **Role chrome (seeker vs recruiter):** `isEmployer()` gates Post / Feeds / Recruiter desk. Seekers only: Account **Apply**, Easy apply, Applied/Saved nav, Career accordion. Recruiters’ Account **Activity** shows incoming applications + posted jobs — never seeker saved/applied lists. Same skill.
- House ad slots / Ads admin UI are removed from clients; promoted jobs may still use an explicit badge when the API returns one.
- Respect `prefers-reduced-motion`; keep motion intentional (enter rise, hover lift, drawer/tab transitions) — 2–3 motions, not noise. Menu/nav route opens use a light overlay: **web left→right**, **mobile/Android bottom→top** (`web/.../route-enter`, `mobile/.../xcron-nav-animation`).
- **Loading UX:** prefer **layout-matched** shimmer skeletons (job cards, tables, list rows, detail panels) over spinners or centered icon stacks. Shared: `web|mobile/src/app/shared/skeleton/` + `.sk*` tokens. Global API busy = thin top bar only. Button busy = `.sk--btn-bar`, never a circular spinner icon.

### Tokens & files of record

| Surface | Tokens / globals |
| --- | --- |
| Web | `web/src/styles.scss` (colors + `--xcron-text-*` type scale), page SCSS under `web/src/app/` |
| Mobile | `mobile/src/theme/variables.scss` (same type tokens), `mobile/src/global.scss`, page/shared SCSS |

When changing UI, update **both** clients unless the change is package-specific (SEO/SSR vs Capacitor/Ionic).

## Shared rules for agents

- Prefer **small, focused changes**; do not drive-by refactor or fix unrelated lint.
- **RBAC / security:** API `SecurityModule` (rate limit + CSRF) + `AuthGuard` + `RolesGuard` are authoritative (`@Roles` / `@Public`). Cookie sessions + Bearer fallback; one browser tab via `X-Tab-Id`; `@SensitiveThrottle` = **1/hour** on admin login / account wipe / payment+notification dev. Clients hide admin nav only after `GET /v1/auth/me` — never trust localStorage roles alone; clear on 401.
- Job contact values are public on job DTOs / detail UI. Keep phone/email/WhatsApp out of SEO meta and JSON-LD.
- Payments use Strategy/Adapter (`PAYMENT_GATEWAY=stub|upi|razorpay`). Free path: stub or UPI VPA/QR (`upi` + `PAYMENT_UPI_VPA`). Follow [`.cursor/skills/xcron-payments/SKILL.md`](.cursor/skills/xcron-payments/SKILL.md). Notifications use the same adapter pattern (`PUSH_PROVIDER=stub|fcm`, `MAIL_PROVIDER=stub|console|smtp`) — job publish fans out in-app + push + mail with dispatch/delivery history; stubs are ₹0. Image OCR uses free local Tesseract (`OCR_PROVIDER=tesseract`; `stub` to disable). Do not assume live Razorpay/Firebase.
- Optional AI job-text enrich is **off by default** (`AI_ENRICH_ENABLED=0`). Prefer free Groq or local Ollama — see `api/src/ai/CLAUDE.md`. Never invent contacts in public descriptions.
- In-app help chatbot is **off by default** (`AI_HELP_ENABLED=0`); signed-in floating FAB only. Free/low model + heavy throttle/token budget — see `api/src/ai/help/CLAUDE.md`.
- Job Fare channel pull is **free-first**: Telegram Bot API + WhatsApp paste bridge only — never unofficial WA scrapers. See [docs/CHANNEL_PULL.md](docs/CHANNEL_PULL.md) · [api/src/channels/CLAUDE.md](api/src/channels/CLAUDE.md).
- Free recruiter job import integrations (Excel/CSV, Partner API, XML/JSON feeds, Zapier/Sheet webhook) — see [docs/JOB_IMPORT_INTEGRATIONS.md](docs/JOB_IMPORT_INTEGRATIONS.md) · [api/src/integrations/CLAUDE.md](api/src/integrations/CLAUDE.md).
- When you change a package or feature folder, update that package’s `CLAUDE.md` (and add a folder `CLAUDE.md` for new modules). Keep technical project docs current for every feature, bug fix, and release (`docs/DEVELOPER.md`, `ROADMAP.md`, `FILE_MAP.md`, etc.) — follow [`.cursor/skills/xcron-claude-md/SKILL.md`](.cursor/skills/xcron-claude-md/SKILL.md).
- Guest vs signed-in **and** seeker vs recruiter menus/nav: follow [`.cursor/skills/xcron-ui-auth/SKILL.md`](.cursor/skills/xcron-ui-auth/SKILL.md) whenever adding drawer, tab, header, account links, Easy apply, or Activity.
- Default data store is **in-memory**; Prisma schema exists but is not the live path yet.
- Node **22.22.3+**. Install API with `npm install --legacy-peer-deps` if peers complain.
- After substantive API/mobile/web work: `npm run build` in that package.
- Only commit/push when the user asks (or when continuing the established daily push workflow they requested).

## Docs to read first

- [docs/DEVELOPER.md](docs/DEVELOPER.md) — what shipped, stubs, release gate  
- [docs/FILE_MAP.md](docs/FILE_MAP.md) — folder-wise file inventory  
- [docs/ROADMAP.md](docs/ROADMAP.md) — R0–R5 + MVP+  
- [docs/MVP_COMPLETE.md](docs/MVP_COMPLETE.md) — MVP vs production gaps  
- [docs/CHANNEL_PULL.md](docs/CHANNEL_PULL.md) — Job Fare Telegram/WA bridge design
- [docs/JOB_IMPORT_INTEGRATIONS.md](docs/JOB_IMPORT_INTEGRATIONS.md) — Excel / Partner API / feeds / Zapier (free)
- [docs/PERFORMANCE_SCORE.md](docs/PERFORMANCE_SCORE.md) — seeker + recruiter Performance Score
- [docs/APPLICATIONS_TIMELINE.md](docs/APPLICATIONS_TIMELINE.md) — Applied jobs timeline + dual-role notify + scale plan
- [docs/HIRING_ACTIVITY.md](docs/HIRING_ACTIVITY.md) — job-list hiring-activity badge (Indeed/LinkedIn; no public “low”)
- [docs/FEEDBACK.md](docs/FEEDBACK.md) — FAQ + Contact Admin messenger (seeker/recruiter → admin) 
- [docs/JOB_DISCOVERY.md](docs/JOB_DISCOVERY.md) — search filters, ranking, match reasons, aliases (Phase 1)
- [docs/WEBSITE_AND_ANDROID_UX.md](docs/WEBSITE_AND_ANDROID_UX.md) — Doc 10 UX map (routes, deep links, split view, correlation)
- [docs/SECURITY_PRIVACY.md](docs/SECURITY_PRIVACY.md) — threat model, privacy/AI/DPDP, incident response
- [docs/AUTHENTICATION.md](docs/AUTHENTICATION.md) — sessions, refresh reuse, RBAC, account status
- [docs/TRACKING.md](docs/TRACKING.md) — admin user access / engagement / hours spent  

## Release reality

This is a **dev MVP**, not production/Play-ready. See DEVELOPER.md § release.
