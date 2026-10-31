# MVP complete checklist (post R0–R5)

This marks the **product MVP slice** as complete for local demo and iteration. It is **not** a production launch certificate.

## Included in MVP

| Area | Status |
| --- | --- |
| Guest search + monochrome UI | Done |
| OTP auth, employer post, admin moderation | Done |
| SSR SEO job pages + sitemap | Done |
| Bulk import (CSV/text/OCR stub) | Done |
| ₹5 contact unlock + Razorpay webhook stub | Done |
| **Subscriptions** (weekly/monthly unlimited unlocks) | Done |
| Prefs sync + FCM stub + in-app alerts | Done |
| Ads / employer promotions + cost model | Done |
| **Saved jobs** + **personalised feed** | Done |
| **Account deletion** (`DELETE /v1/me`) | Done |
| Import / unlock **quota enforcement** | Done |
| Prisma schema (incl. SavedJob, Subscription) | Ready |

## Still deferred (post-MVP / production)

- Live Postgres runtime (`JOBS_STORE=prisma`) instead of memory
- Real Razorpay keys, Firebase FCM, production OCR/LLM
- Google Play packaging + billing policy review (AC-20)
- Backups, load tests, malware scan, encrypted vault at rest (AC-23)
- Radius search, email campaigns, DOCX/XLSX full parsers

## Local demo

```bash
cd api && npm run start:dev
cd mobile && npm start
```

Seeker: OTP → Preferences → Account subscribe / save jobs / feed.  
Employer: OTP → Post → promote. Admin: `admin@xcron.local`.
