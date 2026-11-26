# Implementation Task Breakdown

Execute in order. Each task must be independently testable.

## Foundation
### DP-001 Documentation bootstrap
Create module structure and implementation references.
Done: every feature maps to a specification.

### DP-002 Project skeleton
Create editor, public runtime, API, worker and shared libraries.
Done: all applications build.

## Contracts
### DP-003 Site JSON schema
Implement schema v1, runtime validator, fixtures and migration interface.
Done: invalid components/props are rejected.

### DP-004 Component registry
Implement allow-listed components, variants, prop validation and accessibility contracts.
Done: unknown component types cannot render.

### DP-005 Database
Implement sites, drafts, versions, templates, media, domains, publish jobs, workspaces and JSONB documents.
Done: migrations and repository tests pass.

## Templates/design
### DP-006 Design tokens
Implement token schema, CSS variables and light/dark/system.
Done: components render under multiple themes.

### DP-007 Template package
Implement manifest, versioning, import and validation.
Done: admin can register immutable template versions.

### DP-008 First templates
Build 10 high-quality templates across different design families.
Done: all pass QA.

### DP-009 100+ catalog
Expand to at least 100 templates using the family matrix.
Done: all templates pass required QA.

## Editor
### DP-010 Site creation wizard
Template, site name, slug and locale.
Done: valid draft JSON exists.

### DP-011 Section editor
Add/remove/duplicate/reorder/hide.
Done: edits persist as structured JSON.

### DP-012 Property editor
Schema-driven component forms.
Done: normal editing requires no HTML/CSS.

### DP-013 Theme editor
Typography, colors, spacing, radius and mode.
Done: changes update preview.

### DP-014 Media library
Upload, optimize, select, replace and delete.
Done: responsive variants exist.

### DP-015 Autosave/undo
Revision-aware saves, patch history and recovery.
Done: refresh does not lose committed changes.

## Publishing
### DP-016 Preview
Render draft safely in isolated preview.
Done: draft is never public.

### DP-017 Validation
Schema, links, locale, SEO, asset and accessibility validation.
Done: publish blockers are deterministic.

### DP-018 Publish pipeline
Immutable version, idempotency, artifact generation and cache warming.
Done: public version is independent of draft.

### DP-019 Rollback
Publish an old snapshot as a new version.
Done: history remains immutable.

## Public platform
### DP-020 Public runtime
Routing, rendering, locale, SEO and safe fallbacks.
Done: public site works without editor bundle/auth.

### DP-021 CDN/cache
Immutable version caching.
Done: public traffic does not hit DB on every request.

### DP-022 Domain/subdomain
Platform subdomain first, domain verification next.
Done: host resolves only to verified bindings; custom domain binding + TXT/CNAME verification shipped for published sites.

## Product capabilities
### DP-023 Multilingual
Locale editor, fallback, localized SEO and URLs.
Done: multiple locales coexist independently.

### DP-024 SEO/AEO
Metadata, sitemap, robots, JSON-LD, canonical and hreflang.
Done: published pages expose valid structured metadata.

### DP-025 Analytics
Async events, aggregation and owner dashboard.
Done: analytics outage cannot break rendering.

### DP-026 Entitlements
Plan, feature and usage engine.
Done: server-side limits work.

### DP-027 Admin governance
Template approval, versioning, deprecation and reports.
Done: only approved versions enter catalog.

## Hardening
### DP-028 Security
XSS, URL, SVG, IDOR, rate limit, host and tenant isolation.
Done: security suite passes.

### DP-029 Accessibility
Automated and manual accessibility QA.
Done: representative templates pass.

### DP-030 Performance
Core Web Vitals, bundle, image and cache budgets.
Done: CI enforces budgets.

### DP-031 Observability
Logs, metrics, traces and alerts.
Done: failures trace by request/site/publish ID.

### DP-032 Production release
Backups, rollback, smoke tests, monitoring and incident runbook.
Done: release is repeatable and reversible.

## Agent rules
Do not skip contracts. Do not store HTML as canonical data. Do not add arbitrary code execution to templates. Do not couple public runtime to editor/admin. Do not add a database without measurable need. Do not make AI mandatory.

## Implementation status

Task-by-task implementation status against this repository (MVP scope). Source of truth for acceptance criteria is the task sections above; this table tracks what has actually shipped.

| Task | Title | Status | Implementation |
|---|---|---|---|
| DP-001 | Documentation bootstrap | ✅ DONE | `Agents.md`, `PROJECT_CONTEXT.md`, this breakdown, module `CLAUDE.md` |
| DP-002 | Project skeleton | ✅ DONE | `api/src/portfolio/*` module + controller/service/DTOs, registered in `api/src/app.module.ts` |
| DP-003 | Site JSON schema | ✅ DONE | `api/src/portfolio/site-schema.ts`, `portfolio.validation.ts`, `site-schema.spec.ts` |
| DP-004 | Component registry | ✅ DONE | `api/src/portfolio/component-registry.ts` (allow-listed section types + property fields) |
| DP-005 | Database | ✅ DONE (MVP) | `PortfolioStore` port + `PortfolioMemoryStore`; Prisma deferred |
| DP-006 | Design tokens | ✅ DONE | `api/src/portfolio/design-tokens.ts`; `--pf-*` public renderer, `--xcron-*` editor |
| DP-007 | Template package | ✅ DONE (MVP) | `api/src/portfolio/templates/template-catalog.ts` (13 starter templates) |
| DP-008 | First templates | ✅ DONE (MVP) | 13 starter templates across design families |
| DP-009 | 100+ catalog | ⏳ PLANNED | Family-matrix expansion deferred |
| DP-010 | Site creation wizard | ✅ DONE | Web `/portfolio` list + create-from-template flow |
| DP-011 | Section editor | ✅ DONE | Web `/portfolio/:siteId` section tree + structured JSON persistence |
| DP-012 | Property editor | ✅ DONE | Schema-driven property forms from `GET /v1/portfolio/components` |
| DP-013 | Theme editor | ✅ DONE | Web theme tab (mode, colors, typography, spacing, radius) |
| DP-014 | Media library | 🟡 PARTIAL | URL-based asset registry + endpoints shipped; binary upload/optimization deferred |
| DP-015 | Autosave/undo | ✅ DONE | Revision-aware debounced autosave, conflict reload, undo/redo stacks |
| DP-016 | Preview | ✅ DONE | Shared `PortfolioRendererComponent` in editor preview |
| DP-017 | Validation | ✅ DONE | Deterministic blocking errors + warnings/suggestions |
| DP-018 | Publish pipeline | ✅ DONE (MVP) | Immutable version + idempotency key; cache warm-up deferred (see DP-021) |
| DP-019 | Rollback | ✅ DONE | Publish old snapshot as new version; history immutable |
| DP-020 | Public runtime | ✅ DONE | Anonymous `GET /v1/portfolio/public/:slug`; web SSR `/p/:slug` |
| DP-021 | CDN/cache | ⏳ PLANNED | Immutable-version caching not yet wired |
| DP-022 | Domain/subdomain | ⏳ PLANNED | Platform subdomain / custom domain deferred (public path is `/p/:slug`) |
| DP-023 | Multilingual | ✅ DONE (MVP) | Locale-aware content + fallback to site default |
| DP-024 | SEO/AEO | ✅ DONE | SEO metadata, sitemap, JSON-LD via web `SeoService` + API SEO builder |
| DP-025 | Analytics | ✅ DONE (MVP) | Privacy-light events + owner insights; outage-safe beacons |
| DP-026 | Entitlements | ⏳ PLANNED | Plan/feature/usage engine deferred |
| DP-027 | Admin governance | ⏳ PLANNED | Template approval workflow deferred |
| DP-028 | Security | ✅ DONE (MVP) | Allow-listed renderer, URL sanitizers, validation suites |
| DP-029 | Accessibility | ✅ DONE (MVP subset) | Renderer landmarks/heading/alt/focus/skip-link/reduced-motion contracts |
| DP-030 | Performance | ⏳ PLANNED | Core Web Vitals / bundle / cache budgets pending |
| DP-031 | Observability | ⏳ PLANNED | Logs/metrics/traces/alerts pending |
| DP-032 | Production release | ⏳ PLANNED | Backups/rollback/smoke tests pending |

Hardening and release tasks (DP-028 … DP-032) describe production expectations; only the MVP subset marked above is currently implemented, and the remaining items are tracked as deferred work in [../../IMPLEMENTATION_PLAN.md](../../IMPLEMENTATION_PLAN.md).

