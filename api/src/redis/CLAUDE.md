# CLAUDE.md — `api/src/redis/`

Optional **Redis** for X Cron: public-job **cache-aside**, **BullMQ** notification queues, distributed **throttler** storage, and multi-instance **feedback presence**.

Unset `REDIS_URL` → all of the above stay in-memory / inline (dev MVP default). Never use Redis as the only store for jobs, applications, audit, or notification history.

## Env

| Key | Default | Notes |
| --- | --- | --- |
| `REDIS_URL` | unset | e.g. `redis://127.0.0.1:6379` (compose service `redis`) |
| `REDIS_CACHE_ENABLED` | `1` when URL set | Public job / company cache |
| `REDIS_QUEUES_ENABLED` | `1` when URL set | BullMQ `notification-fanout`, `push-delivery`, `email-delivery` |
| `REDIS_THROTTLE_ENABLED` | `1` when URL set | Nest throttler Redis storage (multi-instance) |

Update `.env.example`, `.env`, and `env-dev` together. `env-dev` = live prod URL only (Upstash/`rediss://…`).

Local: `docker compose up -d redis` then set `REDIS_URL=redis://127.0.0.1:6379`.

## Layout

| File | Role |
| --- | --- |
| `redis.module.ts` | Global dynamic module; registers Bull root + queues when enabled |
| `redis.service.ts` | Optional ioredis client (`enabled` / `ping`) |
| `cache.service.ts` | Cache-aside get/set/invalidate |
| `redis-keys.ts` | Versioned keys `xcron:v1:…` |
| `redis.config.ts` | Feature flags |
| `queues/notification-queue.service.ts` | Enqueue helpers (no-op when queues off) |
| `queues/queue.types.ts` | Identifier-only payloads |

Processors live under `notifications/processors/` (need `NotificationsService`).

## Cache strategy

1. Read cache → miss → query store → populate with TTL  
2. On mutation (publish / edit / expire / hide) → invalidate `job:public:{id}` + slug + `company:public:{employerId}`  
3. Never decide apply eligibility from cache — re-check store/Postgres on submit  

TTLs: job public 60s · company public 120s.

## Queues (BullMQ)

| Queue | Purpose |
| --- | --- |
| `notification-fanout` | Job publish match + in-app; enqueues channel jobs |
| `push-delivery` | FCM/stub push (retries + backoff) |
| `email-delivery` | Mail provider send |

Jobs are idempotent via delivery dedupe keys in the notifications store. Payloads carry ids + short title/body — not resumes/PII blobs. Bounded attempts (5) + exponential backoff; failed jobs retained for inspection.

## Throttle

`SecurityModule` uses `@nest-lab/throttler-storage-redis` when `REDIS_THROTTLE_ENABLED`. Tracker remains IP + token prefix + tab (`SecurityThrottlerGuard`).

## Presence

`FeedbackPresenceTracker` writes Redis keys when connected; memory Maps otherwise.

## Health

`GET /v1/health` includes `redis: { configured, ping, cache, queues, throttle }`.

## Agent rules

- Keep Redis **optional** — do not require it for local/MVP smoke  
- Prefer store/Postgres for durable business intent (outbox / dispatch rows)  
- Do not cache private profile/resume without authenticated principal in the key  
- New queues: add name in `redis.constants.ts`, register in `RedisModule` + `NotificationsModule`, document here + `docs/REDIS.md`
