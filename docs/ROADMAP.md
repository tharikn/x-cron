# X Cron Jobs — build roadmap (from PRD §26)

| Step | Release | Scope | Status |
| --- | --- | --- | --- |
| 0 | R0 | Brand, monorepo, cost model, PRD baseline | Done |
| 1 | R1 foundation | NestJS API jobs/search/preferences + Prisma schema + mobile wired to API | Done |
| — | Discovery Phase 1 gap-close | URL filter chips, match reasons, skills/verified/fresher/easyApply filters, feed/search aliases (no Meilisearch) | **Done** |
| 2 | R1 discovery | Auth (username/password; OTP removed), employer accounts, admin moderation | Done |
| 2b | Company workspace | Company ≠ user: team roles, verification, invites, recruiter dashboard (`/v1/companies`) | Done (MVP) |
| 3 | R1 web | Angular SSR public job pages + SEO | Done |
| 4 | R2 | Bulk ingestion, OCR adapters, Capacitor camera/files | Done |
| 5 | R3 | Contact vault, ₹5 unlock, Razorpay webhooks, entitlements | Done |
| 6 | R4 | Synced preferences, FCM notifications (+ category prefs, conversations aliases) | Done |
| 7 | R5 | Ads, promotions, scale/cost tuning | Done |
| — | MVP+ | Subscriptions, saved jobs, feed, account delete, quotas | **Done** |
| — | Channel pull | Free Telegram Bot + WhatsApp bridge → Job Fare admin workflow | **Done (MVP)** |
| — | Job import integrations | Excel/CSV templates, Partner API, XML/JSON feeds, Zapier/Sheet (₹0 lean API) | **Done (MVP lean A)** |
| — | Apply anti-spam | Throttle/quota/cooldown, profile gate, identical notes, screening Q, velocity badge | **Done** |
| — | Performance Score | Seeker + recruiter trust score (fit ≥50% up / &lt;50% down, chat + review discipline); clear UI + roadmap highlight | **Done (MVP)** |
| — | Onboarding alerts | Welcome + profile-complete on first login; auto profile nudges for first 2 days | **Done** |
| — | Recruiter desk | Separate post screen: Review + Preview + AI chat; confirm preview → `directPublish` live (not Blog Approval) | **Done (MVP)** |
| — | Job lifecycle (scope A) | Central status transitions + auto-expire `published`→`expired`; `needs-review` ≈ PENDING_REVIEW | **Done (MVP)** |
| — | Recruiter job analytics | Posted-jobs list + per-job board (views / applied / contacted graphs); `JobViewEvent` + analytics API | **Done (MVP)** |
| — | In-app help chat | Signed-in floating help FAB; free/low model; token budget + cooldown | **Done (MVP)** |
| — | Feedback hub | FAQ + Contact Admin messenger (seeker/recruiter → admin); admin desk | **Done (MVP)** |
| — | User tracking | Admin users/IPs/email + engagement % + hours spent | **Done (MVP)** |
| — | Admin trust & moderation | Cases/queues, reports, risk signals, audit, suspend/appeals, `moderator` role, web Trust desk | **Done (MVP)** |
| — | Redis / queues / cache | Optional Redis: public job cache, BullMQ notify queues, distributed throttle, feedback presence | **Done (optional)** |
| — | Architecture seams (doc 01) | Env validation, transactional outbox, PG FTS, Files module, OTel stub, OpenAPI export, mobile token vault | **Done (MVP)** |

## Step 7 acceptance

- [x] Configurable ad placements + frequency caps (`GET /v1/ads/slots/{slot}`)
- [x] Clearly labelled creatives; impression/click events (`POST /v1/ads/events`)
- [x] Employer promotion packages + stub purchase; boosted jobs badged in search
- [x] Admin placement/creative management
- [x] Cost model + quotas + scale hints (`/v1/ops/*`, `docs/COST_MODEL.md`)
- [x] Mobile discover/detail ad slots; Post → promote; web home ad rail

## Channel pull acceptance (MVP)

- [x] Telegram Bot API adapter (free long-poll / optional webhook) — no paid scrapers
- [x] WhatsApp **manual bridge** only (paste into Job Fare inbox)
- [x] Morning/evening configurable schedule (`Asia/Kolkata`)
- [x] Digest pull → existing import-batch review
- [x] Admin workflow UI (`/tabs/job-fare`) with pipeline tracking
- [x] Design doc: [CHANNEL_PULL.md](./CHANNEL_PULL.md)

## Applied jobs + timeline (MVP UX)

- [x] Formal ATS apply → offer with append-only `ApplicationEvent` (date + time per stage)
- [x] Dual-role notifications on every application action (`onApplicationEvent`)
- [x] Seeker **Applied jobs** surfaces: web `/me/applied`, mobile `/tabs/applied` (+ drawer/Activity links)
- [x] Timeline UI shows stage + `dd MMM yyyy · HH:mm`; inbox deep-links via `applicationId`
- [x] Architecture + scale plan: [APPLICATIONS_TIMELINE.md](./APPLICATIONS_TIMELINE.md)
- [ ] Scale: cursor pagination, async notify queue, denormalized job fields on application

## Performance Score acceptance (MVP)

- [x] Dual-role score (seeker + employer/recruiter), start 50, bands Rising / Steady / Needs care
- [x] Apply-time match % (skills + experience); ≥50% raises seeker score, &lt;50% lowers it
- [x] Points for active apply, chat reply, employer view + status advance (daily caps)
- [x] API `GET /v1/reputation/me` + public summary on application DTOs
- [x] Clear UI: mobile `/tabs/performance`, web `/performance`, callouts on Account / Saved / employer inbox
- [x] Design + E2E diagram: [PERFORMANCE_SCORE.md](./PERFORMANCE_SCORE.md)
