# X Cron Jobs — build roadmap (from PRD §26)

| Step | Release | Scope | Status |
| --- | --- | --- | --- |
| 0 | R0 | Brand, monorepo, cost model, PRD baseline | Done |
| 1 | R1 foundation | NestJS API jobs/search/preferences + Prisma schema + mobile wired to API | Done |
| 2 | R1 discovery | Auth (OTP), employer accounts, admin moderation | Done |
| 3 | R1 web | Angular SSR public job pages + SEO | Done |
| 4 | R2 | Bulk ingestion, OCR adapters, Capacitor camera/files | Done |
| 5 | R3 | Contact vault, ₹5 unlock, Razorpay webhooks, entitlements | Done |
| 6 | R4 | Synced preferences, FCM notifications | **Done** |
| 7 | R5 | Ads, promotions, scale/cost tuning | Next |

## Step 6 acceptance

- [x] Guest `POST/GET /v1/preferences` by `deviceId`; account `GET/PUT/DELETE /v1/me/preferences`
- [x] `POST /v1/me/preferences/claim` merges guest device prefs into signed-in account
- [x] `POST /v1/devices` registers FCM token (stub provider); links to user when authed
- [x] `GET/PUT/POST /v1/notifications/preferences` — job alerts, quiet hours, daily cap
- [x] `GET /v1/notifications` + `POST /v1/notifications/{id}/read` in-app inbox
- [x] Job publish triggers match alerts (dedupe, quiet hours → in-app only, daily cap)
- [x] Mobile: hydrate/claim prefs, stub device token, alert toggle, account inbox
