# Performance, Caching and Scalability

## Goal

Public portfolios must be fast on mobile and desktop. Performance budgets are enforced in CI.

## Public delivery order

1. Browser cache
2. CDN/edge cache
3. immutable published artifact
4. runtime rendering fallback
5. database as last fallback

## Cache key

Use site ID, immutable published version ID, locale, path and theme mode.

## Database

Index workspaceId, siteId, status, publishedVersionId, slug, domain and updatedAt. Add JSONB indexes only when a measured query needs them.

## Scaling

API is stateless. Horizontal scaling uses shared PostgreSQL, Redis, object storage, queue and CDN.

## Workers

Process image variants, publish artifacts, sitemaps and analytics aggregation. Jobs must be idempotent.

## Editor performance

Use patch-based updates, debounced persistence, lazy panels, virtualization for large lists and memoized previews where safe.

## Public bundle

Never ship editor, admin or drag/drop libraries to public visitors.

## Performance checks

Track LCP, INP, CLS, HTML size, JS size, image transfer, cache hit rate, API latency and publish latency.

## Scaling rule

Extract a service only when a measurable bottleneck or independent ownership/deployment need justifies it.
