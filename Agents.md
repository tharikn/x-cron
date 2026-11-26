# AI Coding Instructions — Dynamic Portfolios

## Scope and principles

1. **Zero contamination.** The feature is isolated to the portfolio folders listed below. No existing job-portal endpoint, guard, service, or flow was changed to make it work. The only shared edits are additive: `PortfolioModule` registration in `api/src/app.module.ts`, two portfolio routes plus a drawer link in the web shell, an account link on mobile, and two new methods on the web `SeoService`.
2. **Reuse existing patterns.** Auth uses the existing `@CurrentUser()` / `AuthGuard` / cookie + Bearer stack and the portfolio-local client guards. AI copy assist reuses `AiService` through `PortfolioAiService` and falls back deterministically when AI is disabled. Editor styling reuses `--xcron-*` tokens; the published renderer uses its own `--pf-*` theme variables.
3. **JSON-first, allow-listed rendering.** Drafts and published versions are plain JSON validated against the site schema. Only section types in the API component registry render. The one exception is the allow-listed `custom-code` section, whose HTML/CSS/JS are stored as opaque text and only ever run inside an opaque-origin sandbox — never inline in the app.
4. **Contract-driven.** Endpoint shapes follow `docs/dynamic-portfolios/15-API-CONTRACTS.md`, with the documented deviations below.
5. **No user code on the app origin / safe URLs.** Links allow only `https:`, `http:`, `mailto:`, `tel:`; images allow only `http(s)`. `javascript:`, `data:`, and protocol-relative URLs are rejected. User HTML/CSS/JS is never sanitised (impossible) — it is isolated: `iframe sandbox` without `allow-same-origin`, strict in-frame CSP, `credentialless`, no top navigation, no cookies. See `docs/dynamic-portfolios/26-CUSTOM-CODE-SANDBOX.md`.

## Implemented folders

| Package | Files |
| :--- | :--- |
| API | `api/src/portfolio/**` (module, controller, service, DTOs, schema, registry, templates, stores, SEO, AI assist) |
| Web editor | `web/src/app/pages/portfolio/**`, `web/src/app/pages/portfolio-public/**`, `web/src/app/shared/portfolio-renderer/**`, `web/src/app/shared/portfolio-custom-code/**` |
| Web support | `web/src/app/core/models/portfolio.model.ts`, `web/src/app/core/services/portfolio.service.ts`, `web/src/app/core/guards/portfolio.guard.ts` |
| Mobile | `mobile/src/app/pages/portfolio/**`, `mobile/src/app/shared/portfolio-renderer/**`, `mobile/src/app/shared/portfolio-custom-code/**`, `mobile/src/app/core/models/portfolio.model.ts`, `mobile/src/app/core/services/portfolio.service.ts` |

## Technical directives

### 1. API (`api/src/portfolio/`)

- `PortfolioModule` is registered once in `app.module.ts`; all routes are under `/v1/portfolio/*` (project convention). The spec's `/api/v1/portfolio/*` prefix is not used; no alias is added.
- `PortfolioStore` is the storage port; `PortfolioMemoryStore` is the MVP implementation. A Prisma/JSONB store can be swapped in later without changing the service or clients.
- Draft writes require `baseRevision`; a stale revision returns `409`. Publish and rollback require a client-supplied `idempotencyKey`.
- Published versions are immutable snapshots. Rollback publishes a **new** version rather than mutating history.
- The public read endpoint is `GET /v1/portfolio/public/:slug` and never returns draft content.
- `POST /v1/portfolio/ai/generate` returns copy proposals only; nothing is written to a draft automatically.

### 2. Web (`web/`)

- Routes: `/portfolio` (list), `/portfolio/:siteId` (editor), `/p/:slug` (public SSR runtime).
- The public route uses the same renderer component as the editor preview, so preview and production output are identical.
- UI copy in this feature is plain English literals inside the portfolio modules; no new shared i18n keys were introduced.
- `SeoService.setStructuredData()` and `setSocialImage()` are additive; existing SEO behaviour is unchanged.

### 3. Mobile (`mobile/`)

- Routes: `/tabs/portfolio` and `/tabs/portfolio/:id` under the existing TabsPage.
- The renderer is intentionally duplicated in the mobile package (no new shared lib or monorepo restructuring). Keep both renderer copies in sync when changing markup. This includes the `portfolio-custom-code` frame and `custom-code-frame.ts`.
- Mobile supports list, create, preview, and lightweight Hero/About quick edits. The full section/property editor is web-only in this MVP, so mobile renders `custom-code` but cannot edit it.

### 4. Custom code (`custom-code` section)

- The section stores `html`, `css`, `js` as opaque strings. The API strips control characters only; it never rewrites source.
- It renders exclusively through `app-portfolio-custom-code`, which composes a separate document and loads it in `<iframe sandbox="allow-scripts [allow-forms] [allow-popups]" credentialless>` with **no** `allow-same-origin`. Never add `allow-same-origin`, `allow-top-navigation`, `allow-modals` or `allow-downloads`.
- Never bind user HTML with `innerHTML`, `bypassSecurityTrustHtml`, `[srcdoc]` or a template interpolation. The frame document is built as text and assigned imperatively with `frame.srcdoc = source`; Angular's HTML sanitizer removes `<style>`/`<script>` from a `[srcdoc]` binding. Keep `sandbox` static (Angular 22 `NG0910`).
- `localStorage`/`sessionStorage` are bridged. The bridge installs an in-memory `Storage` shim before author code, seeded from and persisted to `xcron.pf-code.v1.<siteId>:<sectionId>.<store>` on the app origin (64 KB/store, 128-byte keys, 32 KB values). Cookies stay blocked and the frame never sees other app keys.
- The frame is `pointer-events: none` in the editor so selection/drag still work; it is interactive in Preview and on the public page.
- Publishing is blocked until `acknowledged` is true (`PORTFOLIO_CUSTOM_CODE_UNACKNOWLEDGED`).
- Size limits live in the registry (`code` field `maxLength`) and are enforced by `sanitizeField`; oversized code is rejected, not truncated.
- The in-frame CSP is advisory (a `<meta>` tag). The sandbox attribute is the security boundary. Do not weaken it to fix a rendering complaint.
- The generic input protector must not block imports: `allowPortfolioCode` exempts only `html`/`css`/`js` of a `custom-code` object, and only on the two draft routes. Do not widen that regex to the whole API, and do not exempt other fields — control characters and prototype-pollution keys stay enforced.
- Portfolio drafts exceed the 100 KB Express default; `main.ts` registers a 2 MB JSON parser via `useBodyParser` while keeping `rawBody` for the Razorpay HMAC. Keep both behaviours when touching body parsing.

## Deferred (do not assume these exist)

- Media upload / asset pipeline — current MVP accepts `http(s)` image URLs only.
- 100+ template catalog — 13 starter templates ship in the MVP catalog.
- Domain/subdomain routing — public sites live at `/p/:slug`.
- Admin template governance, monetization/plan limits, and advanced analytics (only privacy-light view/contact/outbound events are recorded).
- Full AI proposal acceptance workflow — only the copy-generation endpoint exists; there is no editor-side accept/reject UI yet.
- Prisma persistence for portfolios.
- Separate-origin hosting for custom code (`<slug>.sites.<domain>`), a build/bundle worker, zip import, and binary asset upload. Phase 1 is the sandboxed block only; see `docs/dynamic-portfolios/26-CUSTOM-CODE-SANDBOX.md`.

## Verification expectations

- Build and test with `npm run build` / `npm test` in the package you changed. The current state is verified: web and mobile builds succeed, API type-checks via `npx nest build`, and all API tests pass. If `npm run build` in `api/` fails at `prisma generate` with a Windows EPERM file-lock, that is environmental — `npx nest build` verifies the TypeScript independently.
- Keep all changes uncommitted unless the user asks for a commit.
