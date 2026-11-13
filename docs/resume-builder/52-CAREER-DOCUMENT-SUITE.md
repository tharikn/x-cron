# 52 — Career Document Suite

**Status:** Proposed standalone feature specification  
**Product:** Independent Resume & Career Intelligence platform  
**Parent integration:** X Cron Jobs is one authorized host, not the owner of this feature's domain data  
**Delivery principle:** Independently testable feature module; independently deployable client/API platform remains defined in document 39.

## 1. Problem and product outcome

Candidates repeatedly create related career documents using the same facts, leading to inconsistent dates, titles and achievements.

**Goal:** Generate and manage a set of versioned career documents from the canonical, evidence-backed career profile.

**Primary actors:** Candidate, document template engine, AI drafting adapter.

## 2. User journey

Candidate selects document type and purpose; selects profile facts and optional job/context; system creates a structured draft; factual claims are linked to evidence; candidate edits/approves; export is saved locally; document version can be reused or revised later.

## 3. Functional requirements

- Document types: professional bio, project profile, reference-request email, thank-you note, resignation letter, promotion case and internal role profile.
- Document-specific templates, tone/length controls and reusable sections.
- Evidence links for factual statements and explicit labels for user-authored/unverified content.
- Immutable versions, diff and local export.
- Manual editing/export works without AI.
- No authoritative legal, immigration, tax or employment-rights advice; provide neutral drafting support only.
- Store structured content metadata only; no permanent exported file binaries.

## 4. Explicit non-goals

- Do not create a duplicate career profile, resume editor, parser, scoring engine, application tracker or AI provider abstraction.
- Do not make this feature a prerequisite for core resume creation.
- Do not silently publish, share, import, submit, or mutate user data.
- Do not store generated/downloaded document binaries permanently on the server.
- Do not make unsupported claims about ATS ranking, hiring probability or guaranteed outcomes.

## 5. Domain model

**Proposed entities:** CareerDocument, CareerDocumentTemplate, CareerDocumentVersion, CareerDocumentClaim, CareerDocumentExportEvent.

The entities above are additive to the existing canonical model. Use stable IDs, tenant/user ownership, created/updated timestamps, soft-delete only where a documented retention requirement needs it, and audit events for sensitive actions. Store references to canonical profile facts, evidence records, immutable resume versions and host-portal records rather than duplicating their full payloads.

**Data ownership rules**
- Candidate-controlled records belong to the Resume platform and are scoped to the authenticated user/tenant.
- X Cron job listings, employer records and application stages remain owned by X Cron.
- External host references are opaque identifiers and do not grant authorization.
- File binaries remain local-first; only approved structured metadata is persisted.

## 6. API contract

All routes are versioned under `/api/v1`, authenticated and protected by object-level authorization.

- `GET /career-documents`
- `POST /career-documents`
- `GET /career-documents/:id`
- `POST /career-documents/:id/versions`
- `POST /career-documents/:id/claims/validate`
- `POST /career-documents/:id/export/:format`
- `DELETE /career-documents/:id.`

**Contract rules**
- Validate DTOs at the API boundary; reject unknown writable fields where appropriate.
- Use pagination, idempotency keys for retryable create/ingest operations and consistent error envelopes.
- Never return an unrestricted career profile or cross-tenant object.
- Publish OpenAPI schemas and generate/update the supported SDK.
- Emit signed, minimal webhooks only when an authorized integration requires them; never include resume text, credentials or contact notes in webhook payloads.

## 7. Architecture and component design

Build a shared structured-document domain module with type-specific schemas and template packages. Reuse claim validation and export rendering, not a second resume editor. Keep content versioned and exports client-side or streamed without permanent retention. Angular uses a document-type selector and shared editor components.

**Frontend:** Angular feature area with lazy-loaded routes, accessible responsive components, loading/empty/error states and clear consent/review interactions. Shared design tokens are reused; this feature owns its workflows and tests.

**Backend:** NestJS modular monolith module initially. Expose domain interfaces and application services; avoid direct cross-module table access. Extract a separate service only when measured scaling, isolation, security or release-cadence requirements justify it.

**Async processing:** Use a worker only for work that is genuinely long-running or retryable. Use an outbox for reliable domain events. Every job must be idempotent, observable and cancellable where practical.

## 8. Security, privacy and responsible-use controls

Minimize profile context per document type, redact sensitive fields, never expose generated drafts to third parties without consent, and avoid retaining export files. Audit external AI processing without logging document contents.

Additional mandatory controls:
- Authentication is required; enforce tenant isolation and object-level authorization on every read/write.
- Rate-limit public and expensive operations; validate and normalize all untrusted input.
- Do not put access tokens, personal data or sensitive content in URLs.
- Keep secrets in managed configuration; rotate and scope provider credentials.
- Define retention, export, deletion, backup and incident-response behavior before production release.
- Record security-relevant audit events without recording raw document content or secrets.

## 9. Acceptance criteria

1. All factual statements are reviewable and traceable; document exports follow the local-first file policy and can be reproduced from a version.
2. Unauthorized users cannot read, modify, enumerate or delete another user's records.
3. All create/update/delete and consent-sensitive paths have automated unit and integration tests.
4. API contract and SDK documentation match the implementation.
5. Feature works on supported web/mobile layouts and is keyboard/screen-reader accessible.
6. Failure, retry, cancellation and deletion behavior are tested.
7. AI/provider outage does not block manual workflows wherever a manual fallback is defined.
8. Feature can be disabled by configuration without breaking existing resume workflows.

## 10. Delivery phases

P0: professional bio and project profile. P1: thank-you/reference-request and internal role documents. P2: broader templates based on validated demand.

**Release gates:** architecture review, threat model, data lifecycle review, API/SDK review, accessibility QA, automated security tests, observability and rollback plan.

## 11. Dependencies and reuse

Profile (26), provenance (27), versions (28), export engine (08), AI governance (38), cover-letter editor patterns (42).

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
