# Job import integrations (free MVP)

**Status:** lean Option A — API + review reuse · **₹0** product cost  
**Code:** [`api/src/integrations/`](../api/src/integrations/) · Excel via [`api/src/ingestion/parsers/excel.parser.ts`](../api/src/ingestion/parsers/excel.parser.ts)

Traditional job portals help recruiters list jobs via spreadsheets, partner APIs, XML/JSON feeds, and ATS/Zapier webhooks. X Cron ships all four on free adapters only (no paid ATS connectors or scrapers).

## Architecture

```text
Excel/CSV upload ──┐
Partner Job API ───┤
HTTPS XML/JSON feed┤──► import batch review ──► needs-review / publish
Zapier webhook ────┤         (ingestion)
Google Sheet CSV ──┘
```

Partner upserts write `Job` rows directly (`needs-review` by default) keyed by `externalJobId`. Feeds / webhooks / sheets create **import batches** for admin/recruiter review (same path as Job Fare).

## 1 — Excel / CSV

| Action | Endpoint |
| --- | --- |
| Download CSV template | `GET /v1/import-batches/template.csv` (public) |
| Download Excel template | `GET /v1/import-batches/template.xlsx` (public) |
| Upload | `POST /v1/import-batches/:id/uploads` (admin) — `.csv` / `.xlsx` / `.xls` |

Columns: `externalJobId,title,employer,location,jobType,salary,vacancies,description,language,phone,email,whatsapp,website`

## 2 — Partner Job API

1. Sign in as employer → `POST /v1/integrations/api-keys` `{ "label": "HRIS" }` → save `apiKey` once.  
2. Call partner routes with `X-Api-Key: xcron_pk_…` or `Authorization: Bearer xcron_pk_…`.

| Method | Path | Purpose |
| --- | --- | --- |
| POST | `/v1/partner/jobs` | Upsert by `externalJobId` |
| PUT | `/v1/partner/jobs/:externalJobId` | Update |
| POST | `/v1/partner/jobs/batch` | ≤100 jobs |
| DELETE | `/v1/partner/jobs/:externalJobId` | Close (`removed`) |
| GET | `/v1/partner/jobs` | List mapped jobs |

Publish gate: `PARTNER_AUTO_PUBLISH=1` **and** key `autoPublish: true` → `published`; else `needs-review`.

## 3 — Inbound XML / JSON feed

1. Host a full open-jobs feed over **HTTPS** (Indeed/LinkedIn-style `<job>` XML or JSON `{ "jobs": [...] }`).  
2. `POST /v1/integrations/feeds` with `{ "label", "url", "format": "auto"|"xml"|"json" }`.  
3. Manual: `POST /v1/integrations/feeds/:id/pull` · Schedule: every `JOB_FEED_TICK_MS` (default 15m).  

Crawl → import batch. `closeMissing` closes previously mapped feed jobs absent from the latest crawl.

SSRF guard: HTTPS only; localhost / private IPs rejected.

## 4 — Zapier / ATS webhook + Google Sheet

| Action | Endpoint |
| --- | --- |
| Create webhook | `POST /v1/integrations/webhooks` → `urlPath` |
| Ingest | `POST /v1/integrations/webhooks/:token` body `{ "jobs": [ … ] }` or one job object |
| Optional secret | Header `X-Webhook-Secret` / `X-Xcron-Signature` |
| Sheet pull | `POST /v1/integrations/sheets/pull` `{ "csvUrl": "https://docs.google.com/…/export?format=csv" }` |

Zapier free tier: Webhooks by Zapier → POST JSON. ATS: point outbound webhook at the same URL. No paid Zapier/Greenhouse license required on the X Cron side.

## Env

| Key | Default | Notes |
| --- | --- | --- |
| `JOB_FEED_SCHEDULE_ENABLED` | `1` | Feed crawler |
| `JOB_FEED_TICK_MS` | `900000` | 15 minutes |
| `PARTNER_AUTO_PUBLISH` | `0` | Partner live publish gate |

## Persistence note

API keys, feeds, webhooks, and `externalJobId` maps are **in-memory** for this lean MVP (reset on API restart). Job rows / import batches follow `JOBS_STORE`. Prisma persistence for integration config can land later without changing the HTTP contract.
