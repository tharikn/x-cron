# Dynamic Portfolios Module (`api/src/portfolio`)

Self-contained NestJS module for creating, validating, and publishing JSON-first portfolios.

## Architecture & isolation

- **Zero contamination**: all domain models, validation, templates, and routes stay under `/v1/portfolio/*`. No job-portal endpoint was changed.
- **Storage port**: `PortfolioStore` backed by `PortfolioMemoryStore` (MVP baseline). A Prisma/JSONB implementation can be swapped in without changing controller or service contracts.
- **AI reuse**: `PortfolioModule` imports `AiModule`; `PortfolioAiService` reuses `AiService` with a deterministic fallback when `AI_ENRICH_ENABLED=0`. `POST /v1/portfolio/ai/generate` returns proposals only — nothing is written to a draft automatically. Editor-side accept/reject UI is deferred.
- **Safety**: only allow-listed section types render; `http(s)`, `mailto:`, `tel:` links and `http(s)` images only. The single exception is `custom-code`, whose HTML/CSS/JS are stored as opaque text and only run inside an opaque-origin iframe sandbox — never on the app origin (see `docs/dynamic-portfolios/26-CUSTOM-CODE-SANDBOX.md`). The input protector exempts those three fields on the draft routes only.

## Key files

- `portfolio.module.ts` — module wiring (store port, service, AI assist)
- `portfolio.controller.ts` — REST endpoints for catalog, sites, drafts, versions, publishing, analytics, AI assist, and anonymous public read/events
- `portfolio.service.ts` — ownership checks, revision-aware autosave, immutable versions, rollback, SEO payload
- `site-schema.ts` / `portfolio.validation.ts` — schema v1 validation and publish checks
- `component-registry.ts` — allow-listed section types and editor field schemas
- `templates/template-catalog.ts` — 13 built-in starter templates (MVP subset)
- `portfolio.store.ts` / `portfolio.memory-store.ts` — repository port and in-memory implementation
- `portfolio-ai.service.ts` — optional copy assist
- `dto/portfolio.dto.ts` — request contracts

## Deferred

Media upload, 100+ template catalog, admin template governance, plan limits, subdomain routing, Prisma persistence, and full AI proposal workflow.
