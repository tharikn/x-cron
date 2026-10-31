# X Cron Jobs — developer guide

Engineering notes for everything built against PRD v1.0 (roadmap R0–R5 + MVP+).  
**Audience:** developers picking up the monorepo.  
**Release status:** see [Is this ready for release?](#is-this-ready-for-release) at the bottom.

Related docs: [ROADMAP.md](./ROADMAP.md) · [FILE_MAP.md](./FILE_MAP.md) · [MVP_COMPLETE.md](./MVP_COMPLETE.md) · [COST_MODEL.md](./COST_MODEL.md) · [MOBILE_MVP.md](./MOBILE_MVP.md)

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
- OTP auth (phone/email); optional Google stub
- Employer quick-post + paste → `needs-review`
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
- Notification prefs, quiet hours, daily cap
- In-app inbox; job publish → match alerts via FCM stub
- Mobile: hydrate/claim prefs, alert toggle, Account inbox

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

---

## API modules (`api/src/`)

| Module | Purpose |
| --- | --- |
| `auth/` | OTP, sessions, employers, roles/guards |
| `jobs/` | Search, CRUD-ish, moderation; memory store + seed |
| `ingestion/` | Import batches + parsers |
| `payments/` | Unlock orders, subscriptions, Razorpay stub, entitlements |
| `preferences/` | Device + account preferences |
| `notifications/` | Devices, FCM stub, in-app notifications |
| `ads/` | Placements, creatives, promotions |
| `ops/` | Cost model, metrics, quotas, scale hints (admin) |
| `seeker/` | Saved jobs + feed |
| `account/` | Account deletion orchestration |
| `health/` | `GET /v1/health` |

Global: `AuthGuard` via `APP_GUARD`; mark public routes with `@Public()`.

Default data store: **in-memory** (`JOBS_STORE=memory`). Prisma client/schema exist under `api/prisma/` but are **not** the live path until wired.

---

## Key env vars (`api/.env`)

| Var | Default / notes |
| --- | --- |
| `PORT` | `3000` |
| `JOBS_STORE` | `memory` (Prisma switch not live yet) |
| `DATABASE_URL` | Present for future Postgres |
| `CORS_ORIGINS` | Local mobile/web origins |
| `UNLOCK_PRICE_PAISE` | `500` |
| `ADMIN_IDENTITIES` | `admin@xcron.local` |
| `PAYMENT_MODE` | `stub` → use `/payments/dev/confirm` |
| `RAZORPAY_WEBHOOK_SECRET` | `dev_secret` for HMAC tests |
| `MONTHLY_BUDGET_INR` / quota caps | See ops + COST_MODEL |

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

# Optional Postgres (schema only until JOBS_STORE=prisma is implemented)
docker compose up -d
```

### Demo accounts / flows
- OTP: any email/phone; API returns `devCode` (`123456`) in development
- Admin: `admin@xcron.local`
- Seeker: Preferences → Account (subscribe / saved / feed) → unlock or save on job detail
- Employer: OTP as employer → Post / Bulk import / Promote
- Payments: stub confirm only unless real Razorpay keys + `PAYMENT_MODE=razorpay`

---

## Stubs vs production providers

| Concern | Current | Production need |
| --- | --- | --- |
| Job/auth/payment storage | Memory maps | Prisma + Postgres |
| Razorpay | Stub order + HMAC webhook | Live keys, checkout SDK, settlements |
| FCM | Stub provider + web fake token | Firebase + Capacitor Push |
| OCR / LLM | Stub parser | Real provider + workers/queue |
| Contact vault | Plain fields in memory | Encryption at rest, KMS |
| Google sign-in | Explicit stub response | Google Identity |
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
| Production data durability? | **No** (memory store resets on restart) |
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
