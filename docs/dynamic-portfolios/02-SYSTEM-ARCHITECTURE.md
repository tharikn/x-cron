# System Architecture

## Target stack

- Web editor/runtime: Angular + TypeScript
- Backend: NestJS + TypeScript
- Database: PostgreSQL
- Cache: Redis
- Object storage: S3-compatible storage
- CDN: CloudFront or equivalent
- Worker: NestJS worker/queue for asynchronous jobs

## Logical architecture

Angular Editor
  -> API
  -> identity/workspace
  -> portfolio
  -> template
  -> media
  -> localization
  -> publishing
  -> domain
  -> SEO
  -> analytics
  -> entitlements

API -> PostgreSQL
API -> Redis
API -> object storage
API -> queue -> worker -> image processing/publishing/sitemap/analytics

Visitor -> CDN -> published artifact
CDN miss -> public runtime -> published JSON -> CDN

## Service strategy

Start as a modular NestJS backend rather than many deployed microservices. Keep modules independently testable and extraction-ready.

Modules:
- identity
- workspace
- portfolio
- template
- editor
- media
- publishing
- domain
- localization
- SEO
- analytics
- billing/entitlements
- admin

The editor can later become a separate microfrontend. Public rendering can later become a dedicated runtime service.

## Save flow

Editor -> authenticated API -> validate JSON -> persist draft JSONB -> revision increment -> cache invalidation.

## Preview flow

Editor -> preview endpoint -> draft JSON -> renderer -> isolated preview response.

## Publish flow

Draft -> validation -> immutable version -> publish worker -> optimized artifact/cache -> CDN.

## Public flow

Visitor -> CDN -> immutable published representation. On miss, read published version and render/cache.

## Reliability

- Public reads must not depend on editor UI.
- Published snapshots are immutable.
- Draft content must never leak to public cache.
- Publish is idempotent.
- Media and analytics are asynchronous.
- All important operations have request/publish IDs.

## Recommended repository layout

apps/portfolio-editor
apps/portfolio-public
apps/portfolio-api
apps/portfolio-worker

libs/site-schema
libs/renderer
libs/design-system
libs/template-sdk
libs/localization
libs/validation
libs/seo
libs/media

## Architecture decision

Do not render arbitrary stored HTML. Render a validated component tree from JSON. This provides security, portability and template evolution.
