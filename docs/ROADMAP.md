# X Cron Jobs — build roadmap (from PRD §26)

| Step | Release | Scope | Status |
| --- | --- | --- | --- |
| 0 | R0 | Brand, monorepo, cost model, PRD baseline | Done |
| 1 | R1 foundation | NestJS API jobs/search/preferences + Prisma schema + mobile wired to API | Done |
| 2 | R1 discovery | Auth (OTP), employer accounts, admin moderation | Done |
| 3 | R1 web | Angular SSR public job pages + SEO | Done |
| 4 | R2 | Bulk ingestion, OCR adapters, Capacitor camera/files | Done |
| 5 | R3 | Contact vault, ₹5 unlock, Razorpay webhooks, entitlements | **Done** |
| 6 | R4 | Synced preferences, FCM notifications | Next |
| 7 | R5 | Ads, promotions, scale/cost tuning | Planned |

## Step 5 acceptance

- [x] `POST /v1/jobs/{id}/contact-orders` creates ₹5 (500 paise) unlock order
- [x] `POST /v1/payments/webhooks/razorpay` verifies HMAC; retries do not duplicate entitlements
- [x] `GET /v1/jobs/{id}/contact` requires auth + active entitlement; `Cache-Control: no-store`
- [x] `GET /v1/me/entitlements` lists purchaser unlocks
- [x] Payment / entitlement / audit kept as separate memory entities (Prisma models ready)
- [x] Provider abstraction (`RazorpayStubProvider`); `PAYMENT_MODE=stub` + `POST /v1/payments/dev/confirm`
- [x] Mobile job detail: sign-in → pay stub → reveal phone/email/WhatsApp
- [x] Public job DTOs still mask contacts (`hasPhone` / unlock label only)
