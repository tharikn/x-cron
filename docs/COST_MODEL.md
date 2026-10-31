# X Cron Jobs — low-cost operating model (PRD §22)

Currency: **INR**. Figures are planning estimates; live spend comes from cloud billing + `GET /v1/ops/cost-model` (admin).

## Starting footprint

| Component | Role | Est. ₹ / month |
| --- | --- | ---: |
| API compute | Single small instance | 2,500 |
| Managed Postgres | Primary store | 1,800 |
| Object storage | Uploads / OCR sources | 200 |
| CDN + static web | SSR assets / SEO | 500 |
| OCR / LLM | Extraction pages | 2,000 |
| FCM + email | Alerts | 400 |
| Payment fees | Unlocks + promotions | 800 |
| **Total estimate** | | **~8,200** |

Default monthly budget alert: **₹15,000** (`MONTHLY_BUDGET_INR`), warn at **80%** (`BUDGET_ALERT_PCT`).

## Hard caps (env)

| Env | Default | Purpose |
| --- | --- | --- |
| `OCR_MONTHLY_PAGE_CAP` | 5000 | Stop runaway extraction spend |
| `IMPORT_DAILY_BATCH_CAP` | 50 | Per-day import pressure |
| `UNLOCK_DAILY_CAP` | 200 | Abuse / fee exposure |

## Scale triggers

- Search RPS / p95 latency → add read path / search index before more API replicas
- OCR page volume → dedicated worker pool + concurrency limits
- Notification volume → outbox sharding; keep quiet hours + daily caps
- Stay single-box until metrics say otherwise (`GET /v1/ops/scale`)

## Unit economics to watch

- Cost per **published job**
- Cost per **MAU**
- Gateway fee % on **₹5 unlocks** (may need bundles)
- OCR cost per **import batch**
