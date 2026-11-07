# System architecture (X Cron)

Target-state map from job-portal doc `01-SYSTEM-ARCHITECTURE` applied to this monorepo.  
Related: [DEVELOPER.md](./DEVELOPER.md) · [REDIS.md](./REDIS.md) · [JOB_DISCOVERY.md](./JOB_DISCOVERY.md) · [api/src/outbox/CLAUDE.md](../api/src/outbox/CLAUDE.md) · [api/src/files/CLAUDE.md](../api/src/files/CLAUDE.md)

## Topology (KEEP)

```text
Web (:4201 SSR) / Mobile (Ionic+Capacitor)
        |
   NestJS /v1 modular monolith
     |        |         |
 Postgres   Redis*   Local/S3 files*
     |        |
  Outbox → BullMQ workers (notify fan-out)
```

\* Redis and object storage are optional; unset `REDIS_URL` / `FILE_STORAGE=local` keeps the MVP runnable.

## Shipped seams (2026-11-07 architecture pass)

| Seam | Status | Notes |
| --- | --- | --- |
| Modular NestJS monolith | KEEP | Feature modules under `api/src/` |
| Env fail-fast | BUILD→done | `config/env.validation.ts` via Zod + `ConfigModule.validate` |
| Postgres SoR | IMPROVE | Dual stores; `.env.example` defaults `*_STORE=prisma` |
| Transactional outbox | BUILD→done | `OutboxEvent` + relay → BullMQ/inline |
| Redis / BullMQ | KEEP | Optional; see [REDIS.md](./REDIS.md) |
| PG FTS + `pg_trgm` | BUILD→done | `Job.searchDocument` + GIN; `SEARCH_FTS_ENABLED` |
| Files / object storage | BUILD→done | `/v1/files` + local/stub/s3-mirror adapters |
| OpenTelemetry | BUILD→stub | `OTEL_ENABLED=1` console tracer |
| OpenAPI export | BUILD→done | `OPENAPI_EXPORT=1` → `api/openapi.json` |
| Mobile refresh vault | REFACTOR→done | Capacitor Preferences via `TokenVaultService` |
| Company ownership | KEEP | `CompaniesService.requireAction` |
| Job expiry on apply | KEEP | `ApplicationsService.isOpenForApply` |

## Deferred / BACKLOG

- Meilisearch / OpenSearch (only after measuring PG FTS)
- Real AWS S3 SDK (s3 mode mirrors to local disk today)
- OTLP exporter + dashboards
- OpenAPI → generated Angular clients (export file is the input)
- Domain-folder rename (`candidate/` etc.) — avoid big-bang; page folders stay
- Microservices — only when scale-out triggers in doc 01 §9 are measured
