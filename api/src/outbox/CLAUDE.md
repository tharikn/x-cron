# CLAUDE.md — `api/src/outbox/`

Transactional outbox for durable async side effects (doc 01 §5).

## Flow

1. Domain write succeeds (job published).
2. `OutboxService.record('job.published', { jobId })` inserts a row (Prisma when `JOBS_STORE=prisma`).
3. `OutboxRelay` claims pending rows on `OUTBOX_TICK_MS` (default 5s).
4. Relay enqueues BullMQ `notification-fanout` when Redis queues are on; otherwise runs `NotificationsService.runJobPublishedFanout` inline.
5. Mark processed / schedule retry (exponential backoff). Consumers stay idempotent via dispatch + dedupe keys.

## Env

| Key | Default | Notes |
| --- | --- | --- |
| `OUTBOX_ENABLED` | follow `JOBS_STORE=prisma` | `0` forces off; `1` forces on |
| `OUTBOX_TICK_MS` | `5000` | Relay poll interval (min 2s) |

## Models

Prisma `OutboxEvent` — migration `20261107180000_outbox_and_job_fts`.

## Agent rules

- Prefer outbox over fire-and-forget queue enqueue after durable domain writes.
- Do not treat Redis as the source of truth for “was this job published event recorded?”
- Unknown topics: log + mark processed (avoid poison loops).
