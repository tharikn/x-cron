# X Cron Jobs — developer guide

Engineering notes for everything built against PRD v1.0 (roadmap R0–R5 + MVP+).  
**Audience:** developers picking up the monorepo.  
**Release status:** see [Is this ready for release?](#is-this-ready-for-release) at the bottom.

Related docs: [ROADMAP.md](./ROADMAP.md) · [FILE_MAP.md](./FILE_MAP.md) · [MVP_COMPLETE.md](./MVP_COMPLETE.md) · [COST_MODEL.md](./COST_MODEL.md) · [MOBILE_MVP.md](./MOBILE_MVP.md) · [CHANNEL_PULL.md](./CHANNEL_PULL.md) · [PERFORMANCE_SCORE.md](./PERFORMANCE_SCORE.md) · [APPLICATIONS_TIMELINE.md](./APPLICATIONS_TIMELINE.md) · [FEEDBACK.md](./FEEDBACK.md) · [E2E.md](./E2E.md)  

Agent guides: [../CLAUDE.md](../CLAUDE.md) · [../api/CLAUDE.md](../api/CLAUDE.md) · [../mobile/CLAUDE.md](../mobile/CLAUDE.md) · [../web/CLAUDE.md](../web/CLAUDE.md)

---

## Monorepo layout

| Path | Stack | Role |
| --- | --- | --- |
| `mobile/` | Ionic 9 + Capacitor 8 + Angular 22 | Android-first client (also `ng serve` in browser) |
| `api/` | NestJS 11 + Prisma schema | Modular monolith, OpenAPI at `/docs` |
| `web/` | Angular SSR | Public SEO job pages + sitemap |
| `docker-compose.yml` | Postgres 16 | Optional; API still defaults to **memory** store |
| `docs/` | Markdown | Roadmap, MVP checklist, cost model, this guide |

Node **22.22.3+** required.

---

## What was implemented (by release)

### R0 — Foundation
- Brand: **X Cron** / Jobs; monochrome UI tokens
- Monorepo + GitHub (`main`)
- Cost planning model (`docs/COST_MODEL.md`, later `/v1/ops/*`)

### R1 — Discovery MVP
- NestJS jobs search/filter/sort, categories, related jobs
- Public DTOs never include `privateContact` (`jobs.mapper.ts`)
- Username/password auth (register + login; no email/SMS OTP); optional Google stub kept on API
- Employer/recruiter quick-post: desk with Compose · Review · Preview + AI chat; confirm “did you preview?” then `directPublish` → **live** (`published`). Without the flag (legacy / admin import) → `needs-review`
- Admin approve/reject + job reports
- Angular SSR web: home, location, job detail, sitemap/robots
- Mobile discover / job detail / post / account / preferences

### R2 — Bulk ingestion
- `POST /v1/import-batches` + text/file upload + review + approve
- Parser registry: CSV, pasted WhatsApp/text, image/PDF **OCR stub**
- Contacts masked in record DTOs; within-batch dedupe
- Mobile bulk import: clipboard, camera, file picker
- Android camera permission declared in Capacitor config

### R3 — Contacts & commerce
- Contact vault (in-memory); `GET /v1/jobs/:id/contact` + `Cache-Control: no-store`
- `POST /v1/jobs/:id/contact-orders` (₹5 / 500 paise)
- Razorpay **stub** + HMAC webhook; `POST /v1/payments/dev/confirm` when `PAYMENT_MODE=stub`
- Entitlements separate from payments; webhook retries idempotent

### R4 — Preferences & notifications
- Guest prefs by `deviceId`; account `GET/PUT/DELETE /v1/me/preferences` + claim
- Device registration `POST /v1/devices` (stub FCM token)
- Notification prefs (in-app / push / mail), quiet hours, daily cap
- In-app inbox; job publish → subscriber fan-out via push + mail stubs (₹0)
- Dispatch + delivery history: `GET /v1/admin/notification-dispatches`
- Pluggable: `PUSH_PROVIDER=stub|fcm`, `MAIL_PROVIDER=stub|console|smtp`
- Mobile: hydrate/claim prefs, alert toggle, Account inbox
- **OS notification permission (web + mobile):** after sign-in (and on session restore when push alerts are on), clients call `promptOsPermissionAfterSignIn` → browser `Notification.requestPermission` / Capacitor `LocalNotifications.requestPermissions`. Toast once when the user answers the prompt or when OS permission flips (Permissions API / app resume watch). Preferences shows live system status (`Allowed` / `Blocked` / `Not decided`) + **Enable system notifications** when still prompt/denied. Push channel toggle re-asks and mirrors the same status.
- **Bug fix — OS shade icon + line breaks (2026-11-06):** Browser/Windows tray used the plain favicon (or a wrong default) and middot-joined bodies wrapped poorly. Fix: web + mobile `Notification` / LocalNotifications use square `xcron-logo-mark-square.png` (`icon`/`badge`; Android `largeIcon=ic_notification_large` + status-bar `ic_stat_xcron`); API job/feedback bodies use `\n` separators; inbox cards `white-space: pre-line`.
- **Appearance theme (signed-in):** preference field `theme` = `system` | `light` | `dark` | `warm` on `/v1/me/preferences`. Settings → **Theme** tab (web `/settings/theme`, mobile Settings segment) applies `html[data-theme]` + CSS token variants (night-sky dark default, light violet wash, warm paper). System follows `prefers-color-scheme` (light/dark only). Guests keep brand dark until login; Theme UI is auth-only. Shell chrome uses `--xcron-toolbar-bg` (web sticky `.top`, mobile `ion-tab-bar` / toolbar) + drawer/page brand marks use `--xcron-ink` (not hardcoded `#fff` / night-sky hex) so light/warm keep header + hero readable
- **Onboarding (welcome + profile):** on `register` / Google new user → welcome + day-0 “Complete your profile”; `NotificationsScheduler` auto-nudges incomplete seeker profiles for `PROFILE_REMINDER_MAX_DAYS` (default 2). Inbox `data.action` → Complete profile / Browse jobs CTAs on web + mobile

### R5 — Ads, promotions, ops
- Configurable ad slots + frequency caps; labelled creatives
- Impression/click events; employer Featured packages (stub pay)
- Boosted jobs badged / sorted in search
- Admin ops: cost-model, metrics, quotas, scale hints

### MVP+ (gap close after R5)
- **Feedback hub (FAQ + Contact Admin messenger):** `api/src/feedback/` — Repository store (`FEEDBACK_STORE` memory|prisma) + Strategy FAQ (`StaticFaqProvider`) + Facade service. Public `GET /v1/feedback/faq`; signed-in threads for **Seeker→Admin** and **Recruiter→Admin** (`audience=seeker|employer`); admin desk `GET/POST /v1/admin/feedback/threads*`. Notifies via `support_event` / inbox `action=open_feedback` (in-app + push/OS tray on mobile + web browser Notification API; not gated on job-alert prefs). Clients deep-link `?thread=` on Feedback / admin desk from inbox CTA and OS tap. Web `/feedback` + `/admin/feedback`; mobile `/tabs/feedback` + `/tabs/admin-feedback`. Design: [FEEDBACK.md](./FEEDBACK.md). Prisma migration `20261105120000_feedback_support_threads`.
- **Feedback presence / typing (2026-11-05):** WhatsApp-style peer **Online** / **Last active** + live **is typing…** via in-memory `FeedbackPresenceTracker` + `POST /v1/feedback/threads/:id/typing` (admin twin). Thread detail returns `presence`; clients poll ~2.5s and heartbeat while composing. Replaced static “Waiting for user/admin…” fake typing rows. Not Prisma-backed (multi-instance → Redis later).
- **Bug fix — Mobile `session_tab_mismatch` / CSRF / apply-profile save (2026-11-06):** Capacitor cold starts mint a new `X-Tab-Id` while cross-origin API cookies (`xcron_access`) can still be sent; AuthGuard preferred the stale cookie and blocked login with `session_tab_mismatch`. Mutating calls also hit `CSRF validation failed` because `document.cookie` cannot read `xcron_csrf` on another host, so profile / apply-profile / help-chat saves failed intermittently. Fix: prefer Bearer over cookie; skip CSRF when `Authorization: Bearer` is present; public routes ignore tab mismatch so login can replace the stale session. Mobile locale fallback also adds `nav.feedback` / `nav.feedbackAdmin`.
- **Bug fix — Mobile feedback chat spinner (2026-11-06):** Opening/sending on mobile Feedback used a blocking busy path + global overlay could still flash from `/auth/refresh` or help-chat `/ai/help`. Fix: optimistic send (instant pending bubble), quiet open/poll, silent interceptor markers for `/auth/refresh` + `/ai/help`.
- **Bug fix — Open feedback inbox CTA:** Web/mobile notifications built `[routerLink]` strings with embedded `?thread=` / `?as=`, which Angular encoded (`%3F`) so navigation never reached Feedback chat. Fixed via separate `[queryParams]`; mobile Feedback/admin desk re-open thread on view enter.
  - **Bug fix (live replies):** open Contact Admin / admin-desk threads quiet-poll ~5s (+ tab focus / Ionic re-enter) so the other side’s messages show without a manual page refresh.
- **Form security hardening:** shared India-first validators (`api/src/security/validation/` — email/phone/pincode/salary/URL/safe-text) on seeker, auth, jobs, applications, apply-profiles, ingestion DTOs; `ValidationPipe` returns field-keyed `{ errors: { field: message } }`; `InputProtectorMiddleware` blocks XSS/SQLi payload patterns + prototype pollution (Prisma remains parameterized — no UI→SQL interpolation). Web + mobile: `form-validation.ts` + Profile field errors; `app-pii-field` eye/View toggle masks seeker profile mobile/email/pincode/address/salaries (job-detail employer contacts stay public).
- **Branded date/datetime pickers (web):** shared `app-xcron-datetime-picker` replaces native browser `date` / `datetime-local` on Post Job (Effective from / End date), My Jobs edit, and Admin dashboard From/To. Night-sky calendar + time columns; values stay local `YYYY-MM-DD` / `YYYY-MM-DDTHH:mm` (no API change). Mobile: `ion-datetime` themed in `global.scss` for when forms gain date fields (Post Job on mobile still has no Effective/End fields).
- **Subscriptions:** `GET /v1/subscriptions/plans`, `POST /v1/subscriptions/checkout` → `subscription_contact` entitlement (unlimited unlocks while valid)
- **Saved jobs:** `POST/DELETE/GET /v1/me/saved-jobs`
- **Feed:** `GET /v1/feed` (prefs-matched)
- **Account deletion:** `DELETE /v1/me` (and `DELETE /v1/auth/me`)
- Quota checks on import batches and contact unlocks
- Prisma models extended: `SavedJob`, `Subscription` (schema ready; runtime still memory)
- **ATS applications anti-spam (P0.1):** `@ApplyThrottle` (~5/min) + per-seeker `APPLY_DAILY_CAP` (default 20, UTC day) on `POST /v1/jobs/:jobId/apply`
- **Apply profile gate (P0.2):** require owned `applyProfileId` that passes readiness (skills/headline/summary/project) + display name + phone or email (apply DTO → auth user → Account seeker profile `mobile`/`email`/`displayName`); freeze snapshot on the application
- **Identical cover-note anti-spam (P1):** block reuse of the same normalized cover note beyond `APPLY_IDENTICAL_NOTE_MAX` (default 2) in `APPLY_IDENTICAL_NOTE_WINDOW_MS` (default 24h)
- **Job screening question (P1):** optional `Job.screeningQuestion` on create/update; when set, apply requires `screeningAnswer` (stored on the application)
- **Velocity spam badge (P2):** soft `likelySpam` snapshot at apply (`APPLY_VELOCITY_FLAG_HOURLY` / `_DAILY`); employer APIs expose `spamBadge: "Likely spam"` — does not auto-reject

### Applied jobs + ATS timeline (seeker)
- Signed-in **Applied jobs** menu: web drawer → `/me/applied`; mobile `/tabs/applied` (+ Account Activity **Open all**)
- List shows current status + last update `dd MMM yyyy, HH:mm`; detail timeline records every stage with exact date + time (`ApplicationEvent.at`)
- Detail UI (web + mobile) is tabbed **Overview · Chat · Timeline** (`?tab=`) so fit/profile/actions, chat, and history are not one long noisy scroll
- Dual-role notify on apply / view / status / offer / note / withdraw / chat via `onApplicationEvent`; inbox CTA **View timeline** uses `data.applicationId` (+ `recipientRole`)
- Architecture + million-scale plan: [APPLICATIONS_TIMELINE.md](./APPLICATIONS_TIMELINE.md) · module [../api/src/applications/CLAUDE.md](../api/src/applications/CLAUDE.md)

### Performance Score / My Rating (seeker + recruiter) — MVP
- Dual-role trust score 0–100 (start 50): Rising / Steady / Needs care
- Apply-time **match %** (skills + experience); ≥50% raises seeker score, &lt;50% lowers it; active apply + chat reply + employer view/status also earn points (daily caps)
- API: `GET /v1/reputation/me`, `GET /v1/reputation/users/:id`; application DTOs include `matchPercent` + counterpart `reputation`
- Clients: mobile `/tabs/performance`, web `/performance` + Account/Saved/employer inbox callouts — **UI label is My Rating** (drawer `nav.myRating`; routes unchanged)
- Store: `REPUTATION_STORE` (falls back to `JOBS_STORE`); Prisma `UserReputation` / `ReputationEvent` + `JobApplication.matchPercent`
- Design + E2E diagram: [PERFORMANCE_SCORE.md](./PERFORMANCE_SCORE.md) · [../api/src/reputation/CLAUDE.md](../api/src/reputation/CLAUDE.md)

### Hiring activity badge (job opening list) — MVP
- Public job DTO fields `hiringActivity` (`high` \| `medium` \| null) + `hiringActivityBadge` (“Actively reviewing” / “Usually responds”)
- Thresholds align with LinkedIn (14d active review; ~35% coverage) + Indeed Responsive Employer (>51% / 30d); **no public “low” badge**
- Computed from per-job applications (`viewedAt` / status past `applied`); wired on search, detail, related
- Clients: web home Open roles + mobile `job-card`
- Design: [HIRING_ACTIVITY.md](./HIRING_ACTIVITY.md) · util `api/src/applications/hiring-activity.util.ts`

### Channel pull (Job Fare) — free
- Telegram Bot API adapter (long-poll default; optional webhook) — ₹0
- WhatsApp **bridge** via admin paste (no unofficial WA clients)
- Morning/evening schedule + **Pull now** → `IngestionService.ingestDigestText`
- Admin workflow UI: mobile `/tabs/job-fare` (pipeline + inbox + sources + history)
- Design: [CHANNEL_PULL.md](./CHANNEL_PULL.md) · agent guide: [../api/src/channels/CLAUDE.md](../api/src/channels/CLAUDE.md)

### In-app help chatbot (signed-in, free/low model)
- Floating **?** FAB bottom-right on web + mobile — only after account / `isSignedIn()` and `AI_HELP_ENABLED=1`
- Default scope: app usage help (search, apply, post, settings) — locked system prompt; no invented contacts
- Free path: Groq `openai/gpt-oss-20b` (or stub canned FAQ / local Ollama tiny). Note: `llama-3.1-8b-instant` shut down 2026-08-16 — defaults updated to Groq’s replacement.
- Security: auth required · `@ChatThrottle` (~3/min) · per-user cooldown (`AI_HELP_COOLDOWN_MS`) · daily token budget (`AI_HELP_DAILY_TOKEN_BUDGET`) → **429** + cool-down when exhausted
- API: `GET /v1/ai/help/status`, `POST /v1/ai/help/chat` · module [../api/src/ai/help/CLAUDE.md](../api/src/ai/help/CLAUDE.md)
- Clients: `shared/help-chat` on web shell + mobile `app.component`

### Bug fix — hide provider stub copy from seekers
- Seekers no longer see FCM / SMTP / “free stub provider” wording on Notifications or Preferences (web labels + ta/hi `notif.lead` / `prefs.leadSignedIn`). Ops still sees provider notes on `/admin/notifications`.

### Bug fix — Easy apply dead click with no profile version
- Job detail **Easy apply** was `[disabled]` when signed in with no `selectedProfileId`, but the CTA still looked live (no `:disabled` styles) — clicks never fired, so no toast and no `POST /v1/jobs/:id/apply`.
- Fix (web + mobile): disable only while `applyBusy()`; missing profile shows an error toast pointing at Saved / Account apply versions. Create a profile version first, then Easy apply issues the apply API.

### Bug fix — Easy apply ignored saved Account contact
- After saving phone/email on Account → Profile (seeker `mobile`/`email`), Easy apply still returned `Complete your profile: add a phone or email before applying` because `requireApplyContact` only read auth-user `phone`/`email` (usually empty for username/password accounts) and the client does not send `seekerPhone`/`seekerEmail` on apply.
- Fix (API): fall back to seeker profile contact when resolving apply contact; also accept profile `displayName` / username for the name gate.

### Web shell — drawer auth + standalone Sign in
- Drawer **last** item: guest **Sign in** → `/sign-in`; after login shows a **profile row** (default initials avatar + name from `displayName` → `username` → `email`) plus a red **Log out** action that clears the session and returns home
- **Guest drawer/header:** Home · Sign in only in the nav list; **Get the app** is pinned to the drawer bottom (`.drawer__foot`) with current APK version + last GitHub release date/time. **Settings**, **Notifications**, **My Rating**, **Applied jobs**, **Saved jobs**, and the header notif bell appear only after `isSignedIn()` (validated `/auth/me`). Footer quick links hide the same auth-only destinations for guests
- `/sign-in` is a **standalone** page (not a Settings tab): guest stack — Username / Password / Login → Sign Up → Create new account (**I am a**: Job Seeker / Recruiter → `intendedRole`) → Guest use (Sign in with Google) → Forgot password (copy + Sign Up for now; no reset API yet) → **Admin password login** (email/password via `POST /v1/auth/admin/login`; also `?mode=admin`). **Signed-in seeker/employer hub** (drawer profile → `/sign-in`) matches mobile Account segments: **Profile** · **Apply** · **Activity** · **Rating** · **Account** (`?tab=`); seekers stay on the hub after login (no bounce to home)
- Auth toasts sit **bottom-center** (same as mobile): success = primary violet; error = red (`ToastService` + `friendlyHttpMessage`) — never raw browser text like `Failed to fetch`
- Settings hub tabs are Language · Theme (signed-in) · Preferences (signed-in) · Site (admin); `/settings/account` redirects to `/sign-in`
- Agent skill: [`.cursor/skills/xcron-ui-auth/SKILL.md`](../.cursor/skills/xcron-ui-auth/SKILL.md)

### Mobile tabs — Profile last + gated account chrome
- Bottom nav **last** tab: **Sign in** → `/tabs/account`; after login shows truncated profile name
- **Guest tabs:** Discover · Sign in. **Notifications** and **Settings** tabs appear only after sign-in (employers also get Post)
- Account page guest stack (centered): Login → Sign Up · Google guest · Forgot password
- Signed-in Account segments on **mobile** `/tabs/account` and **web** `/sign-in`: **Profile** (accordion personal / location via `PATCH /v1/me/profile`; **Career** seeker-only — hidden for recruiters/`isEmployer()`) · **Apply** (seeker-only — versioned skillsets as **badges**, **2–7** skills; `?tab=apply` clamps to Profile for recruiters) · **Activity** (role-split: seekers → saved / applied / contacted / searches; recruiters → incoming applications + posted jobs) · **Rating** (My Rating / Performance Score) · **Account** (sign out; Recruiter desk when `isEmployer()`) — deep-link via `?tab=`; no subscription checkout or Notifications section on Profile (inbox stays on Notifications)
- **Role chrome (2026-11):** Recruiters no longer see Account Apply, Easy apply, drawer Applied/Saved, footer saved/applied, `/me` seeker hub, or Settings Saved. Applied-jobs routes redirect recruiters to employer applicant review. Skill: `.cursor/skills/xcron-ui-auth/SKILL.md`
- Seeker profile career fields + Prisma migration `20261104235000_seeker_profile_career`
- **Bug fix — profile not retaining:** `PATCH/GET /v1/me/profile` previously wrote only to in-memory `SeekerStore`, so values vanished after API restart and Account forms reloaded empty. Wired dual `SEEKER_STORE=prisma|memory` (follows `JOBS_STORE`) via `seeker.prisma-store.ts` / `seeker.memory-store.ts` so personal/location/career (+ saved jobs / hidden / contact markers / saved searches) persist in Postgres when `SEEKER_STORE=prisma`
- Toasts: bottom-center; `xcron-toast--success` (primary) / `xcron-toast--error` (red) + friendly network copy
- Settings segments: Language always when Settings is open; **Theme**, **Prefs**, and **Saved** only after sign-in (guests who deep-link see a Sign in CTA)

---

## API modules (`api/src/`)

| Module | Purpose |
| --- | --- |
| `auth/` | Username/password register+login, sessions, employers, roles/guards |
| `jobs/` | Search, CRUD-ish, moderation; memory or Prisma store + seed |
| `ingestion/` | Import batches + parsers |
| `channels/` | Job Fare inbox, Telegram/WA-bridge, scheduled digest pulls |
| `payments/` | Unlock orders, subscriptions, Razorpay stub, entitlements |
| `preferences/` | Device + account preferences |
| `notifications/` | Devices, FCM stub, in-app notifications |
| `ads/` | Placements, creatives, promotions |
| `ops/` | Cost model, metrics, quotas, scale hints (admin) |
| `seeker/` | `/me` tabbed Saved hub (Apply · Saved · Applied · For you / recent+feed) |
| `applications/` | Formal ATS apply → offer letter; throttle + daily quota + profile gate; reputation hooks |
| `apply-profiles/` | Multi-version skill/project apply profiles (no CV); **2–7 skills**/version; readiness for apply |
| `reputation/` | Performance Score for seeker + employer; match % + event ledger |
| `account/` | Account deletion orchestration |
| `site/` | Public footer config (`GET /v1/site/footer`; admin PUT) |
| `health/` | `GET /v1/health` |

Global: `AuthGuard` via `APP_GUARD`; mark public routes with `@Public()`.

Default in code if unset: **in-memory**. Set `JOBS_STORE=prisma` (local `.env` does) to persist jobs + import batches in Postgres (`api/prisma/`). Auth/payments/prefs remain in-memory.

---

## Key env vars (`api/.env`)

| Var | Default / notes |
| --- | --- |
| `PORT` | `3000` |
| `JOBS_STORE` | `prisma` (jobs + bulk import) or `memory` |
| `REPUTATION_STORE` | Performance Score; default follows `JOBS_STORE` |
| `DATABASE_URL` | Present for future Postgres |
| `CORS_ORIGINS` | Local mobile/web origins |
| `UNLOCK_PRICE_PAISE` | `500` |
| `ADMIN_IDENTITIES` | legacy allowlist notes; admin role is via `SUPER_ADMIN_*` password login only |
| `SUPER_ADMIN_EMAIL` / `SUPER_ADMIN_PASSWORD` | password login via `POST /v1/auth/admin/login` |
| `PAYMENT_MODE` | `stub` → use `/payments/dev/confirm` |
| `RAZORPAY_WEBHOOK_SECRET` | `dev_secret` for HMAC tests |
| `MONTHLY_BUDGET_INR` / quota caps | See ops + COST_MODEL |
| `TELEGRAM_BOT_TOKEN` | Optional free Job Fare bot |
| `CHANNEL_SCHEDULE_ENABLED` | `1` morning/evening watcher |

---

## Local run

```bash
# API
cd api && npm install --legacy-peer-deps && npm run start:dev
# http://localhost:3000/v1/health  ·  http://localhost:3000/docs

# Mobile
cd mobile && npm install && npm start
# http://localhost:4200 → API :3000

# Web SSR
cd web && npm install && npm start   # :4201
# or: npm run build && npm run serve:ssr  # :4000

# Postgres for JOBS_STORE=prisma (jobs + bulk import)
docker compose up -d
```

### Demo accounts / flows
- Local auth: `POST /v1/auth/register` `{ username, password, confirmPassword }` then `POST /v1/auth/login` (scrypt; Prisma `User.username` / `passwordHash` / `passwordSalt` when `AUTH_STORE=prisma`)
- Bugfix: `AUTH_STORE=prisma` sign-in race — concurrent `persistUser` + `persistSession`/`persistEmployer` user upserts no longer abort session write on `P2002` (`User.id`)
- Super admin: `POST /v1/auth/admin/login` with `SUPER_ADMIN_EMAIL` + `SUPER_ADMIN_PASSWORD` (see `api/.env`)
- Seeker: drawer **Sign in** (last item) → `/sign-in` username/password or Google → save jobs / prefs / alerts; drawer then shows initials avatar + profile name + red Log out
- Employer / Recruiter: create account picks **Recruiter** (or Post returnUrl preselects it) → `intendedRole=employer` → **Recruiter desk** `/post` (mobile `/tabs/post`) · My jobs
- Recruiter desk (separate from admin Blog Approval): Compose | Review | Preview on the same page; AI Improve + instruction chat; confirm modal asks if they previewed; posts with `directPublish: true` go **live** (no Blog Approval queue). Admin import / Job Fare / Blog Approval remain the moderation path for channel/OCR noise
- Bug fix: Recruiter desk Compose no longer pre-fills Location with **Palani** or Employer from the employer profile — both fields start empty (web + mobile)
- Bug fix: web site footer no longer shows **Visit / Operations** HQ address (Near Bus Stand Road, Palani) — `addresses` seed + SiteConfig cleared; Visit column hidden when empty
- **Recruiter job analytics (MVP):** posted-jobs list shows views / applied / contacted; per-job board at web `/my-jobs/:id` + mobile `/tabs/my-jobs/:id` with KPI cards + daily funnel chart. API: `POST /v1/jobs/:id/events` (view, once/viewer/day), enriched `GET /v1/employers/jobs`, `GET /v1/employers/jobs/:id/analytics?days=`. Prisma `JobViewEvent` when `JOBS_STORE=prisma`. Applied = ATS applications; contacted = seeker contact-tap markers. See `api/src/jobs/analytics/CLAUDE.md`
- Bug fix: web `/post` no longer shows “not an admin” / admin@xcron.local gate for recruiters — page uses `isEmployer()` (API already `@Roles('employer','admin')`); Bulk import / Job Fare links remain admin-only
- Bug fix: web drawer **Post** (+ **Feeds**/my-jobs) and footer “Post a job” show for recruiters via `isEmployer()` — previously hidden behind `isAdmin()` only
- Removed **post-job fee** across app: no Post fee UPI panel after create; Site settings no longer expose post fee mode/price; commerce seed/load forces `postJobPaymentMode=none` / ₹0; `POST /v1/jobs/:id/post-orders` rejects
- Payments: stub confirm only unless real Razorpay keys + `PAYMENT_MODE=razorpay`

---

## Stubs vs production providers

| Concern | Current | Production need |
| --- | --- | --- |
| Job/auth/payment storage | Memory maps | Prisma + Postgres |
| Razorpay | Stub order + HMAC webhook | Live keys, checkout SDK, settlements |
| FCM / mail | Live FCM wired (`PUSH_PROVIDER=fcm` + service account + mobile `google-services.json`); default still stub | Real SMTP/Resend; Play/prod Firebase project |
| OCR / LLM | Stub parser | Real provider + workers/queue |
| Contact vault | Plain fields in memory | Encryption at rest, KMS |
| Local auth | Username/password (scrypt); Google API path optional | Optional Google Identity later |
| Play Billing | Not integrated | Policy review + IAP if required |

---

## Testing done so far

- `npm run build` for `api`, `mobile`, `web` on each push slice
- Manual API smoke scripts for auth, import, unlock, webhook idempotency, prefs/FCM, ads/promos, subscriptions/saved/feed/delete
- **Playwright journeys (2026-11-06):** monorepo `e2e/` covers guest → seeker register/profile/Easy apply → recruiter post/My jobs → applications timeline → feedback/prefs/theme/rating + routing guards on **mobile + web**. One command: `npm run test:e2e` (root) → `scripts/run-e2e.mjs` boots/reuses API `:3000` + clients, writes `e2e/test-results/ISSUES.md` + HTML report. Design note: [e2e/README.md](../e2e/README.md). Admin desk specs skip when `@SensitiveThrottle` (1/hour) blocks reuse of a long-lived API.
- Not done: CI green gate on full e2e, load tests, security pen-test, backup/restore drills

---

## Git / delivery habit

- Branch: `main` on https://github.com/tharikn/x-cron.git
- Pattern: implement step → build → smoke → commit → push
- Commits roughly map to roadmap steps (R0–R5 + MVP+)

---

## Is this ready for release?

**No — not for production / Play Store / public paid launch.**

| Question | Answer |
| --- | --- |
| Demoable local MVP covering PRD roadmap slices? | **Yes** |
| End-to-end product story (guest → seeker → employer → admin)? | **Yes** (with stubs) |
| Production data durability? | **Jobs/imports yes** with `JOBS_STORE=prisma`; auth/payments/prefs still memory |
| Real payments / push / OCR? | **No** (stubs) |
| PRD AC-20 Play Store + billing review? | **No** |
| PRD AC-23 backups, load tests, security gates? | **No** |
| Legal/privacy/ops launch checklist? | **Not completed** |

**Ship bar for a real release (minimum):**
1. Persist with Postgres + Prisma (or equivalent) and migrations  
2. Live payment provider + webhook verification in prod  
3. Real FCM (and Play Billing decision for in-app unlocks)  
4. Production OCR/async workers for bulk import  
5. Backups, monitoring, rate limits, contact encryption  
6. Play Store build, privacy disclosures, policy review  
7. Load + entitlement leak tests passing  

Until then: treat this as a **development MVP / architecture demo**, not a release candidate.
