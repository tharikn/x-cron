# Redis, queues & caching (X Cron)

Design adapted from job-portal technical doc §13 for the X Cron modular monolith.

**Status:** optional. Unset `REDIS_URL` → memory throttler, no public-job cache, inline notification delivery (current MVP). Introduce Redis when multi-instance or async volume needs it.

Related: [DEVELOPER.md](./DEVELOPER.md) · [api/src/redis/CLAUDE.md](../api/src/redis/CLAUDE.md) · [api/src/notifications/CLAUDE.md](../api/src/notifications/CLAUDE.md)

---

## Use cases (in scope)

| Use | Implementation |
| --- | --- |
| BullMQ job queue | `notification-fanout`, `push-delivery`, `email-delivery` |
| Rate-limit counters | Nest throttler Redis storage when enabled |
| Public job / company cache | Cache-aside keys `xcron:v1:job:public:*`, `company:public:*` |
| Feedback presence / typing | Redis keys when connected; memory otherwise |
| Short-lived OTP | N/A — local auth is username/password (no OTP) |
| Session revocation | Auth store (memory/Prisma); Redis not required for MVP |

**Do not** use Redis as the only store for applications, job records, audit logs, or notification history — those stay in memory Maps or Prisma.

---

## Cache-aside

1. Read cache  
2. On miss, query jobs store (memory or Postgres)  
3. Populate with bounded TTL (job 60s, company 120s)  
4. On mutation, invalidate after successful write  

Never decide whether a job is legally open for apply from cache — re-check store on submit.

---

## Queues

| Queue | Trigger | Payload |
| --- | --- | --- |
| `notification-fanout` | Job publish / approve | `{ jobId }` |
| `push-delivery` | Fan-out match | userId + jobId + dispatchId + title/body |
| `email-delivery` | Fan-out match | same |

- Idempotent via notification delivery dedupe keys  
- Attempts 5, exponential backoff from 2s  
- Business intent: `NotificationDispatch` / deliveries in notifications store  

When Redis queues are off, `NotificationsService.onJobPublished` runs the fan-out inline (unchanged caller UX — already fire-and-forget).

When the **transactional outbox** is enabled (`OUTBOX_ENABLED` or `JOBS_STORE=prisma`), publish writes an `OutboxEvent` first; `OutboxRelay` then enqueues BullMQ or runs inline. See [SYSTEM_ARCHITECTURE.md](./SYSTEM_ARCHITECTURE.md) · [api/src/outbox/CLAUDE.md](../api/src/outbox/CLAUDE.md).

---

## Rate limiting

Layered tracker (existing): IP + access-token prefix + tab id.  
With Redis: shared counters across API instances. Return 429 with `Retry-After` (Nest throttler).

---

## Ops / local

```bash
docker compose up -d redis
# api/.env
REDIS_URL=redis://127.0.0.1:6379
```

Compose Redis runs without AOF (`--appendonly no`) for cheap local use — enable persistence on managed Redis for queue durability in prod.

Do not expose Redis publicly. Prefer TLS (`rediss://`) on managed hosts. Set memory limits + eviction appropriate to cache vs queue (queues need persistence; cache can use `allkeys-lru`).

Health: `GET /v1/health` → `redis.ping` / feature flags.

---

## Low-cost path

Self-host Redis CE / Valkey via compose, or Upstash free tier. Until volume justifies it, leave `REDIS_URL` unset.
