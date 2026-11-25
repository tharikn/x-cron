# Testing Strategy

## Unit
Test JSON validation, migrations, locale fallback, URL validation, entitlements, component props, SEO generation and publishing state transitions.

## Integration
Test create/edit/publish, publish failure, rollback, template switching, media processing, domain verification, workspace authorization and analytics isolation.

## E2E
Critical flow: login -> create template site -> edit -> add locale -> upload image -> preview -> publish -> open public URL -> edit/republish -> rollback.

## Visual regression
Render every template with fixture content at mobile, tablet and desktop in light/dark modes.

## Performance
Measure public LCP/INP/CLS, payload size, JS size, image transfer, cache hit rate, API latency and publish latency.

## Security
Test XSS, unsafe URLs, malicious SVG, IDOR, tenant isolation, preview-token reuse, rate limits and host-header attacks.

## Contract tests
Site schema and renderer contracts must remain synchronized. Every schema change requires updated fixtures and renderer tests.

## Implemented coverage (MVP)

Currently shipped with the Dynamic Portfolios MVP implementation:

- Unit: site JSON schema + publish validation (`api/src/portfolio/site-schema.spec.ts`); AI assist fallback (`api/src/portfolio/portfolio-ai.service.spec.ts`).
- No dedicated portfolio unit suites exist in `web/` or `mobile/` yet — only the shared utils/guards suites cover cross-cutting behaviour.

Planned next: renderer contract tests, draft/publish/rollback lifecycle suites, authorization (IDOR/workspace) tests, security suites (XSS, unsafe URLs, malicious SVG), visual regression and E2E journeys (create → edit → publish → open `/p/:slug` → rollback).
