# Implementation Plan — Dynamic Portfolios MVP

## Status summary

The base MVP is implemented across API, web, and mobile. All work is in the working tree and uncommitted. Verified locally: web `npm run build` and mobile `npm run build` succeed, API `nest build` type-checks, and all 20 API test suites (152 tests) pass. Note: `npm run build` in `api/` runs `prisma generate` first, which hit a transient Windows EPERM file-lock during verification; running `npx nest build` directly succeeded.

| Task ID | Component | Delivered | Status | Notes |
| :--- | :--- | :--- | :--- | :--- |
| **DP-001** | Docs | `Agents.md`, `PROJECT_CONTEXT.md`, this plan, module `CLAUDE.md` files | ✅ DONE | Reconciled with shipped scope |
| **DP-002** | API / Core | `PortfolioModule`, controller, service, DTOs | ✅ DONE | Registered in `app.module.ts`; routes under `/v1/portfolio/*` |
| **DP-003** | API / Contracts | Site schema, types, runtime validation, URL sanitizer | ✅ DONE | `site-schema.spec.ts` covers core rules |
| **DP-004** | Shared | Component registry with allow-listed props/fields | ✅ DONE | Drives editor forms and API validation |
| **DP-005** | API / Storage | `PortfolioStore` port + `PortfolioMemoryStore` | ✅ DONE | Prisma swap deferred |
| **DP-006** | Shared | Design tokens / theme variables | ✅ DONE | `--pf-*` in renderer, `--xcron-*` in editor |
| **DP-007** | Templates | 13 starter templates and catalog endpoints | ✅ DONE | 100+ catalog deferred |
| **DP-008** | Web / Runtime | Public SSR renderer at `/p/:slug`, SEO + JSON-LD | ✅ DONE | Same renderer as editor preview |
| **DP-009** | Web / Builder | Draft editor: sections, property forms, theme, locales, devices, undo/redo, autosave, validation, publish/rollback, insights | ✅ DONE | `/portfolio`, `/portfolio/:siteId` |
| **DP-010** | Mobile / UI | Ionic list/create/detail, preview, Hero/About quick edit, account link | ✅ DONE | `/tabs/portfolio`, `/tabs/portfolio/:id` |
| **DP-011** | API / AI | `PortfolioAiService` reusing `AiService`, `POST /v1/portfolio/ai/generate` | ✅ DONE | Proposals only; deterministic fallback; editor UI deferred |
| **DP-012** | Web / Editor | Property editor (schema-driven forms) + theme editor | ✅ DONE | Editor tabs: content / theme / publish / insights |
| **DP-013** | Web / Editor | Theme editor (mode, colors, typography, spacing, radius) | ✅ DONE | |
| **DP-014** | API / Media | Media asset registry (URL-based) + endpoints | 🟡 PARTIAL | Binary upload/optimization deferred |
| **DP-015** | Web / Editor | Autosave/undo | ✅ DONE | Debounced autosave + revision-aware conflict handling |
| **DP-016** | Web / Editor | Preview | ✅ DONE | Shared renderer component |
| **DP-017** | Web / Editor | Validation | ✅ DONE | Deterministic blocking errors |
| **DP-018** | Web / Editor | Publish pipeline | ✅ DONE | Immutable version + idempotency |
| **DP-019** | Web / Editor | Rollback | ✅ DONE | Immutable history + new-version rollback |
| **DP-020** | Web / Runtime | Public runtime + analytics read | ✅ DONE | `/p/:slug` anonymous SSR + privacy-light events |
| **DP-021** | API / Infra | CDN/cache | ⏳ PLANNED | Immutable-version caching pending |
| **DP-022** | API / Infra | Domain/subdomain routing | ⏳ PLANNED | `/p/:slug` public path |
| **DP-023** | API / I18n | Multilingual content | ✅ DONE (MVP) | Locale-aware content + default fallback |
| **DP-024** | Web / SEO | SEO/AEO | ✅ DONE | `SeoService.setPortfolio` + JSON-LD + social image |
| **DP-025** | API / Analytics | Analytics | ✅ DONE (MVP) | Privacy-light events + insights |
| **DP-026** | API / Billing | Entitlements | ⏳ PLANNED | Plan/feature/usage engine deferred |
| **DP-027** | API / Admin | Admin governance | ⏳ PLANNED | Template approval workflow deferred |
| **DP-028** | API / Security | Security hardening | ✅ DONE (MVP) | Allow-list + sanitizers + suites |
| **DP-029** | Web / QA | Accessibility | ✅ DONE (MVP subset) | Renderer contracts |
| **DP-030** | Web / QA | Performance | ⏳ PLANNED | Budgets pending |
| **DP-031** | API / Ops | Observability | ⏳ PLANNED | Traces/metrics/alerts pending |
| **DP-032** | Release | Production release | ⏳ PLANNED | Backups/rollback/smoke tests pending |

Task IDs follow the canonical numbering in [docs/dynamic-portfolios/24-IMPLEMENTATION-TASK-BREAKDOWN.md](./docs/dynamic-portfolios/24-IMPLEMENTATION-TASK-BREAKDOWN.md). MVP-delivered task families: DP-001 – DP-020, DP-023 – DP-025, DP-028 (MVP subset). Hardening/release tasks (DP-028 – DP-032) are the production targets still pending.

## Endpoint inventory

- Catalog: `GET /v1/portfolio/templates`, `GET /v1/portfolio/templates/:templateId`, `GET /v1/portfolio/components`, `POST /v1/portfolio/ai/generate`
- Sites: `GET/POST /v1/portfolio/sites`, `GET/PATCH/DELETE /v1/portfolio/sites/:siteId`
- Drafts: `GET/PUT /v1/portfolio/sites/:siteId/draft`, `POST .../draft/validate`
- Publishing: `GET .../versions`, `GET .../versions/:versionId`, `POST .../publish`, `POST .../rollback`, `POST .../unpublish`
- Insights: `GET .../analytics`
- Public: `GET /v1/portfolio/public/:slug`, `POST /v1/portfolio/public/:slug/events`

## Deferred work (not in this MVP)

- Media upload and asset pipeline — image URLs only (`http(s)`).
- Full AI proposal accept/reject UX in the editor.
- 100+ template catalog and admin template governance.
- Domain/subdomain routing for public sites.
- Monetization and plan limits.
- Prisma/PostgreSQL persistence for portfolio data.
- Advanced analytics beyond privacy-light view/contact/outbound events.

## Known deviations from the spec docs

1. API base path is `/v1/portfolio/*`, not `/api/v1/portfolio/*`, to match existing X Cron routes.
2. Public read path is `/v1/portfolio/public/:slug`; web public route is `/p/:slug` (no subdomain support yet).
3. MVP ships 10 section types and 13 templates rather than the full catalog.
4. Storage is in-memory behind an abstract store; Prisma is future work.
5. Web/mobile UI copy uses local English literals instead of new shared i18n keys.
6. Renderer is duplicated in web and mobile packages; no shared library was introduced.

## Verification checklist

1. `api/`: `npm run build` and `npm test` (schema + AI specs).
2. `web/`: `npm run build` — pay attention to Angular control-flow templates, `ngModel` names, strict null checks, and the renderer output.
3. `mobile/`: `npm run build` — same checks plus Ionic standalone imports and component-style budgets.
4. Manual smoke: create site → edit → autosave → validate → publish → open `/p/:slug` → rollback → unpublish.
5. Confirm no existing job-portal endpoint or UI flow changed.
