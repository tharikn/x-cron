# Deployment, Observability and Cost

## Initial deployment
Use a modular monolith plus one worker and CDN.

Components:
- Angular editor
- public runtime
- NestJS API
- worker
- PostgreSQL
- Redis
- object storage
- CDN

## CI/CD
Lint -> typecheck -> unit -> schema -> security -> build -> visual regression -> performance -> deploy -> smoke test.

## Observability
Use structured logs, request IDs, site IDs, workspace IDs, publish job IDs, error metrics, latency, queue depth, cache hit/miss and media failures.

Never log full portfolio JSON or private content by default.

## Cost controls
CDN-first public delivery, immutable caching, optimized media, direct uploads, asynchronous workers, PostgreSQL before specialized databases, Redis only where measured useful, no per-request AI and aggregated analytics.

## Disaster recovery
Back up PostgreSQL, template catalog, published JSON versions and media metadata. Define object-storage lifecycle/recovery policy.

## Scaling rule
Extract services only for measurable scaling, independent deployment or ownership needs.
