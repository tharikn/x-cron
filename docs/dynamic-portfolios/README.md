# X Cron — Dynamic Portfolio Platform

## Purpose

Dynamic Portfolios is a separate reusable website-builder module inside X Cron Jobs. Users create, customize, preview and publish professional portfolio websites without writing HTML/CSS. Sites are stored as versioned structured JSON, not as generated HTML.

## Product promise

Select a high-quality template → enter portfolio content → customize sections/theme → preview → publish → share a fast, responsive, SEO-ready portfolio.

The platform must support:
- 100+ production-ready templates at launch.
- Developer, designer, photographer, writer, student, researcher, creator, freelancer, consultant, agency and general professional portfolios.
- Responsive web publishing.
- Native multilingual content, not one-language content translated at request time.
- JSON-first site storage.
- Reusable sections/components.
- Draft, preview, publish and rollback.
- Platform subdomains and custom domains (custom domains require verified DNS ownership; platform subdomain routing is deferred).
- SEO metadata, sitemap and structured data.
- Image/media optimization.
- Accessibility and reduced-motion support.
- Privacy-aware analytics.
- Low-cost CDN-first public delivery.
- Independent module boundaries so the feature can later become an independently deployed microfrontend/service.

## Core architecture decisions

1. JSON is the source of truth. Never persist user-authored HTML as canonical site content, except the single allow-listed `custom-code` section whose opaque source only ever runs inside an opaque-origin sandbox (see 26).
2. Schema-version every site document.
3. Templates are immutable/versioned design packages.
4. Renderer is allow-listed. JSON may reference only registered components and validated props.
5. Draft and published versions are immutable snapshots.
6. Publishing creates a read-optimized public representation.
7. Public portfolio pages do not require authentication.
8. Editor APIs require authentication and workspace authorization.
9. Multilingual content is modeled as locale-aware structured values.
10. Public performance is a product requirement.
11. Accessibility is part of each component contract.
12. Animation is optional and must respect reduced-motion preferences.
13. Visual styles are reusable design families, not duplicated business logic.
14. AI is optional; core creation/edit/publish works without AI.

## Agent rule

Treat every file in this folder as an implementation specification. Read this README, then architecture/data contracts, then feature documents, then execute the task breakdown. Do not invent a different JSON model or renderer when a contract already exists.

## Documents

| File | Topic |
|---|---|
| 01-PRODUCT-SCOPE-AND-USER-FLOWS.md | Product scope and journeys |
| 02-SYSTEM-ARCHITECTURE.md | End-to-end architecture |
| 03-DOMAIN-MODEL-AND-JSON-SCHEMA.md | Canonical JSON/data contracts |
| 04-TEMPLATE-ENGINE.md | Template/component architecture |
| 05-TEMPLATE-CATALOG-100-PLUS.md | 100+ template strategy |
| 06-VISUAL-EDITOR-AND-PAGE-BUILDER.md | Visual editor |
| 07-THEME-DESIGN-SYSTEM.md | Tokens and UI design system |
| 08-PUBLISHING-VERSIONING-ROLLBACK.md | Publishing lifecycle |
| 09-PUBLIC-RUNTIME-RENDERER.md | Public site rendering |
| 10-MULTILINGUAL-ARCHITECTURE.md | Native multilingual content |
| 11-SEO-AEO-AND-MACHINE-READABILITY.md | SEO and machine-readable content |
| 12-MEDIA-ASSET-PIPELINE.md | Media processing |
| 13-DOMAIN-SUBDOMAIN-ROUTING.md | Public URL/domain architecture |
| 14-AUTH-WORKSPACE-AND-ACCESS.md | Identity and authorization |
| 15-API-CONTRACTS.md | API design |
| 16-SECURITY-PRIVACY-AND-SAFETY.md | Security |
| 17-PERFORMANCE-CACHING-AND-SCALABILITY.md | Performance/scaling |
| 18-ANALYTICS-AND-PORTFOLIO-INSIGHTS.md | Analytics |
| 19-MONETIZATION-AND-PLAN-LIMITS.md | Plans and entitlements |
| 20-ADMIN-TEMPLATE-GOVERNANCE.md | Template administration |
| 21-ACCESSIBILITY-AND-UX-QA.md | Accessibility/UX |
| 22-TESTING-STRATEGY.md | Testing |
| 23-DEPLOYMENT-OBSERVABILITY-AND-COST.md | Deployment and cost |
| 24-IMPLEMENTATION-TASK-BREAKDOWN.md | Agent execution tasks |
| 25-AI-ASSISTED-CREATION.md | Optional AI capabilities |
| 26-CUSTOM-CODE-SANDBOX.md | Sandboxed HTML/CSS/JS blocks |

## Implementation status

This folder is the implementation specification for the **Dynamic Portfolios** module. The current build state is tracked in two places:

- Task execution status: [24-IMPLEMENTATION-TASK-BREAKDOWN.md](./24-IMPLEMENTATION-TASK-BREAKDOWN.md) (DP-001 … DP-032) — each task lists its acceptance criteria and current implementation status.
- MVP delivery status: [../../IMPLEMENTATION_PLAN.md](../../IMPLEMENTATION_PLAN.md) — one row per delivered task family (✅ DONE / 🟡 PARTIAL / ⏳ Planned).

Status legend:

| Status | Meaning |
|---|---|
| ✅ DONE | Implemented and verified (build + tests pass) |
| 🟡 PARTIAL | Core path shipped; explicitly deferred sub-features listed in the task breakdown |
| ⏳ PLANNED | Specified, not yet implemented |

## Recommended order

Foundation: 02, 03, 04, 07 → editor/templates: 05, 06 → runtime/publishing: 08, 09 → multilingual/SEO/media/domain: 10–13 → auth/API/security: 14–16 → scale/analytics/billing/admin: 17–20 → QA/deployment: 21–23 → execute 24 → optional AI: 25.
