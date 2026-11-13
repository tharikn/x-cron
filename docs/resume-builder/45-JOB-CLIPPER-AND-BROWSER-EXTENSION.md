# 45 — Job Clipper and Browser Extension

**Status:** Proposed standalone feature specification  
**Product:** Independent Resume & Career Intelligence platform  
**Parent integration:** X Cron Jobs is one authorized host, not the owner of this feature's domain data  
**Delivery principle:** Independently testable feature module; independently deployable client/API platform remains defined in document 39.

## 1. Problem and product outcome

Job seekers discover roles across multiple sites and need a consistent, user-controlled way to capture a job description for analysis.

**Goal:** Provide an optional browser extension that captures the current job page only after an explicit user action and sends a reviewed minimal payload to the Resume platform.

**Primary actors:** Candidate, browser extension, Resume API, external job website.

## 2. User journey

User opens a job page and explicitly clicks Save Job; extension extracts permitted visible fields; user reviews/corrects title, company, URL and description; user confirms send; API normalizes the payload and offers JD analysis; manual paste remains available.

## 3. Functional requirements

- Separate browser extension package with least-privilege host permissions.
- Capture only the active page after explicit click; never monitor tabs or browsing history in background.
- Extract page URL, title, company and visible job-description text only where permitted.
- Show review/edit screen before any network submission.
- Use short-lived user-scoped authorization or secure OAuth flow; no long-lived secrets embedded in extension.
- Store minimum metadata needed for matching; X Cron remains source of truth for its jobs and application stages.
- Manual JD paste and URL entry remain first-class fallback.

## 4. Explicit non-goals

- Do not create a duplicate career profile, resume editor, parser, scoring engine, application tracker or AI provider abstraction.
- Do not make this feature a prerequisite for core resume creation.
- Do not silently publish, share, import, submit, or mutate user data.
- Do not store generated/downloaded document binaries permanently on the server.
- Do not make unsupported claims about ATS ranking, hiring probability or guaranteed outcomes.

## 5. Domain model

**Proposed entities:** ClippedJob, JobCaptureSession, CaptureSource, ExtensionAuthorization, JobNormalizationResult, CaptureAuditEvent.

The entities above are additive to the existing canonical model. Use stable IDs, tenant/user ownership, created/updated timestamps, soft-delete only where a documented retention requirement needs it, and audit events for sensitive actions. Store references to canonical profile facts, evidence records, immutable resume versions and host-portal records rather than duplicating their full payloads.

**Data ownership rules**
- Candidate-controlled records belong to the Resume platform and are scoped to the authenticated user/tenant.
- X Cron job listings, employer records and application stages remain owned by X Cron.
- External host references are opaque identifiers and do not grant authorization.
- File binaries remain local-first; only approved structured metadata is persisted.

## 6. API contract

All routes are versioned under `/api/v1`, authenticated and protected by object-level authorization.

- `POST /clipped-jobs`
- `GET /clipped-jobs`
- `GET /clipped-jobs/:id`
- `PATCH /clipped-jobs/:id`
- `DELETE /clipped-jobs/:id`
- `POST /clipped-jobs/:id/analyze`
- `POST /extension/sessions.`

**Contract rules**
- Validate DTOs at the API boundary; reject unknown writable fields where appropriate.
- Use pagination, idempotency keys for retryable create/ingest operations and consistent error envelopes.
- Never return an unrestricted career profile or cross-tenant object.
- Publish OpenAPI schemas and generate/update the supported SDK.
- Emit signed, minimal webhooks only when an authorized integration requires them; never include resume text, credentials or contact notes in webhook payloads.

## 7. Architecture and component design

Maintain extension source as a separate client package with a narrow message protocol and explicit activeTab permission. Extract content in an isolated content script, sanitize it, then present a review popup. API validates payload size and URL scheme, normalizes job content and stores a minimal snapshot. Do not couple the extension to any one job-board DOM; use tested adapters plus manual correction.

**Frontend:** Angular feature area with lazy-loaded routes, accessible responsive components, loading/empty/error states and clear consent/review interactions. Shared design tokens are reused; this feature owns its workflows and tests.

**Backend:** NestJS modular monolith module initially. Expose domain interfaces and application services; avoid direct cross-module table access. Extract a separate service only when measured scaling, isolation, security or release-cadence requirements justify it.

**Async processing:** Use a worker only for work that is genuinely long-running or retryable. Use an outbox for reliable domain events. Every job must be idempotent, observable and cancellable where practical.

## 8. Security, privacy and responsible-use controls

No background page scraping, no browsing-history permission, no hidden analytics of visited sites, no credential collection. Respect site terms and browser-store policies. Protect against malicious page content, prompt injection, SSRF and oversized payloads. Revoke extension sessions and allow user deletion.

Additional mandatory controls:
- Authentication is required; enforce tenant isolation and object-level authorization on every read/write.
- Rate-limit public and expensive operations; validate and normalize all untrusted input.
- Do not put access tokens, personal data or sensitive content in URLs.
- Keep secrets in managed configuration; rotate and scope provider credentials.
- Define retention, export, deletion, backup and incident-response behavior before production release.
- Record security-relevant audit events without recording raw document content or secrets.

## 9. Acceptance criteria

1. The extension cannot read unrelated pages, cannot silently upload page content, and every captured job can be reviewed, corrected and deleted by the user.
2. Unauthorized users cannot read, modify, enumerate or delete another user's records.
3. All create/update/delete and consent-sensitive paths have automated unit and integration tests.
4. API contract and SDK documentation match the implementation.
5. Feature works on supported web/mobile layouts and is keyboard/screen-reader accessible.
6. Failure, retry, cancellation and deletion behavior are tested.
7. AI/provider outage does not block manual workflows wherever a manual fallback is defined.
8. Feature can be disabled by configuration without breaking existing resume workflows.

## 10. Delivery phases

P0: manual paste and URL capture in web app. P1: Chrome extension with explicit click/review. P2: additional browsers and tested site adapters based on demand.

**Release gates:** architecture review, threat model, data lifecycle review, API/SDK review, accessibility QA, automated security tests, observability and rollback plan.

## 11. Dependencies and reuse

JD intelligence (29), secure auth/API (39), SDK (37), privacy review and browser-store approval.

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
