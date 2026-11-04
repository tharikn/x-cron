# X Cron Jobs — developer guide

Engineering notes for everything built against PRD v1.0 (roadmap R0–R5 + MVP+).  
**Audience:** developers picking up the monorepo.  
**Release status:** see [Is this ready for release?](#is-this-ready-for-release) at the bottom.

Related docs: [ROADMAP.md](./ROADMAP.md) · [FILE_MAP.md](./FILE_MAP.md) · [MVP_COMPLETE.md](./MVP_COMPLETE.md) · [COST_MODEL.md](./COST_MODEL.md) · [MOBILE_MVP.md](./MOBILE_MVP.md) · [CHANNEL_PULL.md](./CHANNEL_PULL.md) · [PERFORMANCE_SCORE.md](./PERFORMANCE_SCORE.md)  

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
- **Onboarding (welcome + profile):** on `register` / Google new user → welcome + day-0 “Complete your profile”; `NotificationsScheduler` auto-nudges incomplete seeker profiles for `PROFILE_REMINDER_MAX_DAYS` (default 2). Inbox `data.action` → Complete profile / Browse jobs CTAs on web + mobile

### R5 — Ads, promotions, ops
- Configurable ad slots + frequency caps; labelled creatives
- Impression/click events; employer Featured packages (stub pay)
- Boosted jobs badged / sorted in search
- Admin ops: cost-model, metrics, quotas, scale hints

### MVP+ (gap close after R5)
- **Subscriptions:** `GET /v1/subscriptions/plans`, `POST /v1/subscriptions/checkout` → `subscription_contact` entitlement (unlimited unlocks while valid)
- **Saved jobs:** `POST/DELETE/GET /v1/me/saved-jobs`
- **Feed:** `GET /v1/feed` (prefs-matched)
- **Account deletion:** `DELETE /v1/me` (and `DELETE /v1/auth/me`)
- Quota checks on import batches and contact unlocks
- Prisma models extended: `SavedJob`, `Subscription` (schema ready; runtime still memory)
- **ATS applications anti-spam (P0.1):** `@ApplyThrottle` (~5/min) + per-seeker `APPLY_DAILY_CAP` (default 20, UTC day) on `POST /v1/jobs/:jobId/apply`
- **Apply profile gate (P0.2):** require owned `applyProfileId` that passes readiness (skills/headline/summary/project) + display name + phone or email; freeze snapshot on the application
- **Identical cover-note anti-spam (P1):** block reuse of the same normalized cover note beyond `APPLY_IDENTICAL_NOTE_MAX` (default 2) in `APPLY_IDENTICAL_NOTE_WINDOW_MS` (default 24h)
- **Job screening question (P1):** optional `Job.screeningQuestion` on create/update; when set, apply requires `screeningAnswer` (stored on the application)
- **Velocity spam badge (P2):** soft `likelySpam` snapshot at apply (`APPLY_VELOCITY_FLAG_HOURLY` / `_DAILY`); employer APIs expose `spamBadge: "Likely spam"` — does not auto-reject

### Performance Score (seeker + recruiter) — MVP
- Dual-role trust score 0–100 (start 50): Rising / Steady / Needs care
- Apply-time **match %** (skills + experience); ≥50% raises seeker score, &lt;50% lowers it; active apply + chat reply + employer view/status also earn points (daily caps)
- API: `GET /v1/reputation/me`, `GET /v1/reputation/users/:id`; application DTOs include `matchPercent` + counterpart `reputation`
- Clients: mobile `/tabs/performance`, web `/performance` + Account/Saved/employer inbox callouts
- Store: `REPUTATION_STORE` (falls back to `JOBS_STORE`); Prisma `UserReputation` / `ReputationEvent` + `JobApplication.matchPercent`
- Design + E2E diagram: [PERFORMANCE_SCORE.md](./PERFORMANCE_SCORE.md) · [../api/src/reputation/CLAUDE.md](../api/src/reputation/CLAUDE.md)

### Channel pull (Job Fare) — free
- Telegram Bot API adapter (long-poll default; optional webhook) — ₹0
- WhatsApp **bridge** via admin paste (no unofficial WA clients)
- Morning/evening schedule + **Pull now** → `IngestionService.ingestDigestText`
- Admin workflow UI: mobile `/tabs/job-fare` (pipeline + inbox + sources + history)
- Design: [CHANNEL_PULL.md](./CHANNEL_PULL.md) · agent guide: [../api/src/channels/CLAUDE.md](../api/src/channels/CLAUDE.md)

### Bug fix — hide provider stub copy from seekers
- Seekers no longer see FCM / SMTP / “free stub provider” wording on Notifications or Preferences (web labels + ta/hi `notif.lead` / `prefs.leadSignedIn`). Ops still sees provider notes on `/admin/notifications`.

### Web shell — drawer auth + standalone Sign in
- Drawer **last** item: guest **Sign in** → `/sign-in`; after login shows a **profile row** (default initials avatar + name from `displayName` → `username` → `email`) plus a red **Log out** action that clears the session and returns home
- **Guest drawer/header:** Home · Sign in only in the nav list; **Get the app** is pinned to the drawer bottom (`.drawer__foot`) with current APK version + last GitHub release date/time. **Settings**, **Notifications**, **Performance Score**, **Saved jobs**, and the header notif bell appear only after `isSignedIn()` (validated `/auth/me`). Footer quick links hide the same auth-only destinations for guests
- `/sign-in` is a **standalone** page (not a Settings tab): guest stack — Username / Password / Login → Sign Up → Create new account (**I am a**: Job Seeker / Recruiter → `intendedRole`) → Guest use (Sign in with Google) → Forgot password (copy + Sign Up for now; no reset API yet). **Signed-in seeker/employer hub** (drawer profile → `/sign-in`) matches mobile Account segments: **Profile** · **Apply** · **Activity** · **Rating** · **Account** (`?tab=`); seekers stay on the hub after login (no bounce to home)
- Auth toasts sit **bottom-center** (same as mobile): success = primary violet; error = red (`ToastService` + `friendlyHttpMessage`) — never raw browser text like `Failed to fetch`
- Settings hub tabs are Language · Preferences (signed-in) · Site (admin); `/settings/account` redirects to `/sign-in`
- Agent skill: [`.cursor/skills/xcron-ui-auth/SKILL.md`](../.cursor/skills/xcron-ui-auth/SKILL.md)

### Mobile tabs — Profile last + gated account chrome
- Bottom nav **last** tab: **Sign in** → `/tabs/account`; after login shows truncated profile name
- **Guest tabs:** Discover · Sign in. **Notifications** and **Settings** tabs appear only after sign-in (employers also get Post)
- Account page guest stack (centered): Login → Sign Up · Google guest · Forgot password
- Signed-in Account segments on **mobile** `/tabs/account` and **web** `/sign-in`: **Profile** (accordion personal / location / career via `PATCH /v1/me/profile`) · **Apply** (versioned skillsets as **badges**, **2–7** skills per version — not comma text) · **Activity** (feed / saved / applications / contacted / searches) · **Rating** (Performance Score) · **Account** (sign out) — deep-link via `?tab=`; no subscription checkout or Notifications section on Profile (inbox stays on Notifications)
- Seeker profile career fields + Prisma migration `20261104235000_seeker_profile_career` (memory store live; DDL for higher envs)
- Toasts: bottom-center; `xcron-toast--success` (primary) / `xcron-toast--error` (red) + friendly network copy
- Settings segments: Language always when Settings is open; **Prefs** and **Saved** only after sign-in (guests who deep-link see a Sign in CTA)

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
| `seeker/` | Saved jobs + feed |
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
- Not done: automated full e2e suite green against CI, load tests, security pen-test, backup/restore drills

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
