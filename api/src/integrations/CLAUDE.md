# CLAUDE.md — `api/src/integrations/` (free job import integrations)

Lean MVP for recruiter bulk + automated job install — **₹0** (no paid ATS licenses, Zapier plans, or scrapers).

## Tiers (all free)

| Tier | What | Path |
| --- | --- | --- |
| 1 Excel/CSV | `.xlsx` / `.xls` / `.csv` upload + public templates | `ingestion` parsers + `GET /v1/import-batches/template.csv\|xlsx` |
| 2 Partner API | Company API keys → upsert/batch/close by `externalJobId` | `/v1/partner/*` + `/v1/integrations/api-keys` |
| 3 Inbound feed | HTTPS XML/JSON full-feed crawl (15m tick) | `/v1/integrations/feeds*` |
| 4 Webhook / Sheet | Zapier-style webhook + public Google Sheet CSV URL | `/v1/integrations/webhooks*` · `POST …/sheets/pull` |

Feeds / webhooks / sheets land in **import-batch review** (`IngestionService.ingestDrafts`). Partner upserts write jobs as `needs-review` unless `PARTNER_AUTO_PUBLISH=1` **and** key `autoPublish`.

## Env

| Key | Default | Notes |
| --- | --- | --- |
| `JOB_FEED_SCHEDULE_ENABLED` | `1` | `0` disables in-process feed crawler |
| `JOB_FEED_TICK_MS` | `900000` | Min 60s; default 15m |
| `PARTNER_AUTO_PUBLISH` | `0` | Gate for key-level autoPublish |

In-memory store (API keys, feeds, webhooks, externalJobId → jobId). Resets on API restart unless later `INTEGRATIONS_STORE=prisma` is added.

## Agent rules

- HTTPS-only outbound fetch; block localhost / RFC1918 (SSRF).
- Never add unofficial WhatsApp scrapers or paid job-board post APIs here.
- Keep partner routes `@Public` + API-key check (Bearer `xcron_pk_*` or `X-Api-Key`).
- After changes: this file + `api/CLAUDE.md` + `docs/JOB_IMPORT_INTEGRATIONS.md`.
