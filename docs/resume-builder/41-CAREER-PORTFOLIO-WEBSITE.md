# 41 — Career Portfolio Website

**Status:** Proposed standalone feature specification  
**Product:** Independent Resume & Career Intelligence platform  
**Parent integration:** X Cron Jobs is one authorized host, not the owner of this feature's domain data  
**Delivery principle:** Independently testable feature module; independently deployable client/API platform remains defined in document 39.

## 1. Problem and product outcome

A conventional PDF cannot fully present selected projects, demos, publications, work samples and a candidate's professional story in a navigable format.

**Goal:** Let a candidate publish one or more role-specific, responsive portfolio snapshots derived only from explicitly selected and approved career facts.

**Primary actors:** Candidate, anonymous portfolio visitor, platform administrator handling abuse reports.

## 2. User journey

Candidate selects a career profile and optional resume version; chooses sections and individual fields; previews the anonymous public view; configures visibility and expiry; publishes a versioned snapshot; later updates, unpublishes or revokes it.

## 3. Functional requirements

- Responsive portfolio pages with headline, biography, experience, projects, skills, achievements, credentials, publications, links and contact preference.
- Multiple portfolio variants for different target role families, each bound to an immutable source snapshot.
- Field-level visibility choices: public, hidden, masked or share-only; public-by-allowlist is mandatory.
- Private preview, publish/unpublish, expiry, optional password protection and no-index preference.
- Platform-hosted slug for initial release; custom domains are explicitly deferred behind a separate decision.
- Portfolio version history; publishing never silently exposes career facts added after the snapshot was created.
- Minimal theme/layout choices using the shared design system; accessibility and mobile-first rendering.

## 4. Explicit non-goals

- Do not create a duplicate career profile, resume editor, parser, scoring engine, application tracker or AI provider abstraction.
- Do not make this feature a prerequisite for core resume creation.
- Do not silently publish, share, import, submit, or mutate user data.
- Do not store generated/downloaded document binaries permanently on the server.
- Do not make unsupported claims about ATS ranking, hiring probability or guaranteed outcomes.

## 5. Domain model

**Proposed entities:** Portfolio, PortfolioVersion, PortfolioSection, PortfolioFieldSelection, PortfolioSharePolicy, PortfolioAccessEvent, PortfolioAbuseReport.

The entities above are additive to the existing canonical model. Use stable IDs, tenant/user ownership, created/updated timestamps, soft-delete only where a documented retention requirement needs it, and audit events for sensitive actions. Store references to canonical profile facts, evidence records, immutable resume versions and host-portal records rather than duplicating their full payloads.

**Data ownership rules**
- Candidate-controlled records belong to the Resume platform and are scoped to the authenticated user/tenant.
- X Cron job listings, employer records and application stages remain owned by X Cron.
- External host references are opaque identifiers and do not grant authorization.
- File binaries remain local-first; only approved structured metadata is persisted.

## 6. API contract

All routes are versioned under `/api/v1`, authenticated and protected by object-level authorization.

- `POST /portfolios`
- `GET /portfolios`
- `GET /portfolios/:id`
- `POST /portfolios/:id/versions`
- `POST /portfolios/:id/preview`
- `POST /portfolios/:id/publish`
- `POST /portfolios/:id/revoke`
- `PATCH /portfolios/:id/share-policy`
- `GET /public/portfolios/:slug.`

**Contract rules**
- Validate DTOs at the API boundary; reject unknown writable fields where appropriate.
- Use pagination, idempotency keys for retryable create/ingest operations and consistent error envelopes.
- Never return an unrestricted career profile or cross-tenant object.
- Publish OpenAPI schemas and generate/update the supported SDK.
- Emit signed, minimal webhooks only when an authorized integration requires them; never include resume text, credentials or contact notes in webhook payloads.

## 7. Architecture and component design

Angular portfolio editor and preview are lazy-loaded feature routes. NestJS PortfolioModule creates immutable snapshots from approved profile/version references. A separate public read controller serves a minimized projection and must not call the authenticated profile serializer. Cache public snapshots by version and invalidate immediately on revoke. Use a transactional publish event and asynchronous static rendering only if measured traffic warrants it.

**Frontend:** Angular feature area with lazy-loaded routes, accessible responsive components, loading/empty/error states and clear consent/review interactions. Shared design tokens are reused; this feature owns its workflows and tests.

**Backend:** NestJS modular monolith module initially. Expose domain interfaces and application services; avoid direct cross-module table access. Extract a separate service only when measured scaling, isolation, security or release-cadence requirements justify it.

**Async processing:** Use a worker only for work that is genuinely long-running or retryable. Use an outbox for reliable domain events. Every job must be idempotent, observable and cancellable where practical.

## 8. Security, privacy and responsible-use controls

Default private. Public response DTOs are constructed from a positive field allowlist. Strip hidden fields from HTML, JSON-LD, Open Graph tags, image metadata and logs. Use unguessable share tokens where links are unlisted; rate-limit slug enumeration; support expiry, revocation, takedown and data deletion. Prevent uploaded content from becoming executable HTML.

Additional mandatory controls:
- Authentication is required; enforce tenant isolation and object-level authorization on every read/write.
- Rate-limit public and expensive operations; validate and normalize all untrusted input.
- Do not put access tokens, personal data or sensitive content in URLs.
- Keep secrets in managed configuration; rotate and scope provider credentials.
- Define retention, export, deletion, backup and incident-response behavior before production release.
- Record security-relevant audit events without recording raw document content or secrets.

## 9. Acceptance criteria

1. A candidate can preview, publish, update and immediately revoke a portfolio while proving that unselected facts never leak through page source, metadata, structured data or APIs.
2. Unauthorized users cannot read, modify, enumerate or delete another user's records.
3. All create/update/delete and consent-sensitive paths have automated unit and integration tests.
4. API contract and SDK documentation match the implementation.
5. Feature works on supported web/mobile layouts and is keyboard/screen-reader accessible.
6. Failure, retry, cancellation and deletion behavior are tested.
7. AI/provider outage does not block manual workflows wherever a manual fallback is defined.
8. Feature can be disabled by configuration without breaking existing resume workflows.

## 10. Delivery phases

P0 foundation: private editor and anonymous preview. P1: publish/revoke and version snapshots. P2: expiry, password access and custom-domain evaluation.

**Release gates:** architecture review, threat model, data lifecycle review, API/SDK review, accessibility QA, automated security tests, observability and rollback plan.

## 11. Dependencies and reuse

Existing canonical career facts and provenance; version references from 28; public sharing security controls from 36; independent deployment boundary from 39.

Do not introduce a new copy of any reused capability. Integrate through stable application-service interfaces and versioned APIs.

## 12. Observability and product metrics

Track only privacy-safe operational and product events:
- Feature activation and successful completion rate.
- Time to complete the primary journey.
- Validation failures, user corrections and abandonment.
- API latency, error rate, queue age/retries where applicable.
- User-reported usefulness and support incidents.

Every metric must define its numerator, denominator, time window and source. Never log document contents, raw prompts, access tokens or sensitive profile fields.

## 13. Definition of done

- Functional scope and non-goals are implemented as written.
- Data model migration, API contract, authorization and audit behavior are reviewed.
- Unit, integration, end-to-end, accessibility and security tests pass.
- User consent, preview, correction, export and deletion paths are verified where applicable.
- Feature documentation and SDK/OpenAPI artifacts are updated.
- Deployment/rollback and feature-flag behavior are tested.
- No existing platform capability or host-portal ownership boundary is duplicated.
