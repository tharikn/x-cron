# API Contracts

## Principles

REST/JSON, versioned under /api/v1, cursor pagination, consistent errors, request IDs, idempotent mutation where retries are possible and optimistic concurrency for drafts.

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
