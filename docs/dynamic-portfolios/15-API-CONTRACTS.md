# API Contracts

## Principles

REST/JSON, versioned under /api/v1, cursor pagination, consistent errors, request IDs, idempotent mutation where retries are possible and optimistic concurrency for drafts.

## Implemented deviations from this spec

The MVP implementation follows the repository route conventions and ships only the core contract subset. Recorded deviations:

1. Base path: implemented as `/v1/portfolio/*` (project convention), not `/api/v1/portfolio/*` as written above. No alias is added; clients consume `/v1/portfolio/*`.
2. Public read path: implemented as `GET /v1/portfolio/public/:slug` (web SSR public route is `/p/:slug`). Subdomain routing is deferred.
3. Media: implemented as a URL-based asset registry (`POST /v1/portfolio/media`, `DELETE /v1/portfolio/media/:assetId`). The spec's `upload-intent` / `complete` binary upload pipeline is deferred.
4. AI: implemented as `POST /v1/portfolio/ai/generate` returning structured copy proposals with a deterministic fallback. Editor-side accept/reject workflow is deferred.
5. Public analytics: implemented as `POST /v1/portfolio/public/:slug/events` (privacy-light beacon).

## Core resources

Sites:
POST /api/v1/portfolio/sites
GET /api/v1/portfolio/sites
GET /api/v1/portfolio/sites/:siteId
PATCH /api/v1/portfolio/sites/:siteId
DELETE /api/v1/portfolio/sites/:siteId

Draft:
GET /api/v1/portfolio/sites/:siteId/draft
PUT /api/v1/portfolio/sites/:siteId/draft
POST /api/v1/portfolio/sites/:siteId/draft/validate

Versions:
GET /api/v1/portfolio/sites/:siteId/versions
GET /api/v1/portfolio/sites/:siteId/versions/:versionId

Publishing:
POST /api/v1/portfolio/sites/:siteId/publish
POST /api/v1/portfolio/sites/:siteId/rollback
POST /api/v1/portfolio/sites/:siteId/unpublish

Templates:
GET /api/v1/portfolio/templates
GET /api/v1/portfolio/templates/:templateId
GET /api/v1/portfolio/templates/:templateId/versions/:version

Media:
POST /api/v1/portfolio/media/upload-intent
POST /api/v1/portfolio/media/:assetId/complete
DELETE /api/v1/portfolio/media/:assetId

Domains:
GET /api/v1/portfolio/domains
POST /api/v1/portfolio/domains
POST /api/v1/portfolio/domains/:domainId/verify
DELETE /api/v1/portfolio/domains/:domainId

## Error envelope

{
  "error": {
    "code": "PORTFOLIO_SCHEMA_INVALID",
    "message": "The site contains an unsupported component.",
    "details": [],
    "requestId": "req_123"
  }
}

## Concurrency

Draft writes include revision number, base revision and client mutation ID. Stale updates return a conflict that the editor can reconcile.

## Public path

Public runtime uses a separate read path optimized for anonymous traffic. Never expose internal editor endpoints to visitors.
