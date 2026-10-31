# X Cron Jobs — build roadmap (from PRD §26)

| Step | Release | Scope | Status |
| --- | --- | --- | --- |
| 0 | R0 | Brand, monorepo, cost model, PRD baseline | Done |
| 1 | R1 foundation | NestJS API jobs/search/preferences + Prisma schema + mobile wired to API | Done |
| 2 | R1 discovery | Auth (OTP), employer accounts, admin moderation | **Done** |
| 3 | R1 web | Angular SSR public job pages + SEO | Next |
| 4 | R2 | Bulk ingestion, OCR adapters, Capacitor camera/files | Planned |
| 5 | R3 | Contact vault, ₹5 unlock, Razorpay webhooks, entitlements | Planned |
| 6 | R4 | Synced preferences, FCM notifications | Planned |
| 7 | R5 | Ads, promotions, scale/cost tuning | Planned |

## Step 2 acceptance

- [x] `POST /v1/auth/otp/start` + `POST /v1/auth/otp/verify` (guest browse still public)
- [x] Optional Google endpoint stub (not required)
- [x] `GET /v1/auth/me`, logout, employer profile create
- [x] Employer job post endpoints require auth + employer/admin role
- [x] New posts enter `needs-review` before public search
- [x] Admin queue approve/reject + guest report endpoint
- [x] Mobile Account OTP + moderation UI; Post gated on sign-in
