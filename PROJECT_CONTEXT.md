# Project Context — Dynamic Portfolios

## Overview

Dynamic Portfolios is a JSON-first portfolio builder embedded in the X Cron Jobs platform (Angular SSR web + Ionic/Capacitor Android). Signed-in users create a site from a starter template, edit sections and theme in a browser editor, publish an immutable version, and share a public `/p/:slug` page. The feature is additive: job-portal endpoints and flows are untouched.

## Architecture

```
                 X Cron platform (unchanged)
   Jobs / Auth / Applications      AI providers (AiService)
             |                              |
             +----------- PortfolioModule --+
                               |
        +----------------------+----------------------+
        |                      |                      |
   API /v1/portfolio      Web (Angular SSR)     Mobile (Ionic)
   schema + registry      editor + public       list + quick edit
   drafts + versions      renderer (shared)     renderer (duplicate)
   memory store           /p/:slug SSR          /tabs/portfolio
```

## Module structure

### API — `api/src/portfolio/`

- `portfolio.module.ts` — imports `AiModule`, registers controller, store port, service, and AI assist service.
- `portfolio.controller.ts` — REST endpoints for catalog, sites, drafts, versions, publishing, analytics, AI assist, and the anonymous public runtime.
- `portfolio.service.ts` — ownership checks, revision-aware autosave, publish/rollback/unpublish, SEO payload, analytics summaries.
- `site-schema.ts`, `portfolio.validation.ts` — schema v1 validation, URL sanitization, reserved slugs, publish checks (errors block; warnings/suggestions do not).
- `component-registry.ts` — allow-listed section types and schema-driven property fields for the editor.
- `templates/template-catalog.ts` — 13 built-in starter templates (MVP subset of the 100+ catalog spec).
- `design-tokens.ts`, `portfolio.seo.ts` — theme tokens and JSON-LD / social metadata generation.
- `portfolio.store.ts`, `portfolio.memory-store.ts` — repository port and in-memory implementation.
- `portfolio-ai.service.ts` — optional copy assist through `AiService`, with deterministic fallback.

### Web — `web/src/app/`

- `pages/portfolio/` — list and full draft editor (sections, schema-driven property forms, theme, locale, device preview, undo/redo, autosave, validation, publish, rollback, insights).
- `pages/portfolio-public/` — server-rendered public page at `/p/:slug`; reads only published JSON and sends privacy-light beacons.
- `shared/portfolio-renderer/` — single renderer used by both editor preview and public runtime.
- `core/models/portfolio.model.ts`, `core/services/portfolio.service.ts`, `core/guards/portfolio.guard.ts` — local contracts, API client, and portfolio-local auth guard.

### Mobile — `mobile/src/app/`

- `pages/portfolio/` — list/create and detail (preview plus Hero/About quick edit).
- `shared/portfolio-renderer/` — deliberate duplicate of the web renderer so clients stay decoupled.
- `core/models/portfolio.model.ts`, `core/services/portfolio.service.ts` — local contracts and API client.

## Key decisions and deviations

1. **Storage:** in-memory via the `PortfolioStore` port, matching the project's default data store. Prisma/JSONB is a future swap; no migration was added.
2. **API prefix:** `/v1/portfolio/*` (project convention) instead of the spec's `/api/v1/portfolio/*`. No alias endpoint was added.
3. **Public route:** `GET /v1/portfolio/public/:slug` with web SSR at `/p/:slug`. Domain/subdomain routing is deferred.
4. **Preview parity:** the editor and public page use the same renderer component, so the preview is byte-for-byte the production markup.
5. **Concurrency:** drafts carry `baseRevision`; stale writes return `409`. Publish/rollback use client-supplied `idempotencyKey`.
6. **Security:** only allow-listed components render; no user HTML; URL sanitization allows `http(s)`, `mailto:`, `tel:` links and `http(s)` images only.
7. **Analytics:** rotating daily visitor hash, no raw IP storage. Views, contact clicks, outbound clicks, path/locale/referrer summaries only.
8. **Localisation:** multilingual content is stored as localized text maps; UI copy in the new modules is English literals (no new shared i18n keys).
9. **AI:** optional, off by default through the existing `AI_ENRICH_ENABLED` switch; proposals are never auto-applied to drafts.
10. **SEO:** additive `SeoService` methods for structured data and social image; no changes to existing job SEO.

## Current scope boundary

Shipped: 10 section types, 13 starter templates, JSON schema validation, draft/publish/rollback, public SSR, privacy-light analytics, web editor, mobile list/quick edit, optional AI copy endpoint.

Deferred: media upload, 100+ catalog, admin template governance, plan limits/monetization, full AI proposal workflow, subdomain routing, Prisma persistence, and advanced analytics.
