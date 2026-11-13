# 43 — External Profile and Career Data Import

**Status:** Proposed standalone feature specification  
**Product:** Independent Resume & Career Intelligence platform  
**Parent integration:** X Cron Jobs is one authorized host, not the owner of this feature's domain data  
**Delivery principle:** Independently testable feature module; independently deployable client/API platform remains defined in document 39.

## 1. Problem and product outcome

Manually rebuilding a career history from existing resumes and permitted external sources is time-consuming and creates duplicate or conflicting records.

**Goal:** Import candidate-controlled career data into a review queue, preserving provenance and preventing unconfirmed imports from becoming canonical facts.

**Primary actors:** Candidate, import/parser pipeline, optional officially authorized data provider.

## 2. User journey

Candidate uploads/selects a supported source or connects an approved provider; parser extracts candidate fields; system detects duplicates and conflicts; candidate reviews a field-level diff; confirmed fields merge into the canonical profile with source provenance; temporary raw files are deleted.

## 3. Functional requirements

- PDF/DOCX resume import and safe structured JSON/CSV import; explicit file size/type limits.
- Official OAuth/API provider integrations only where provider terms and scopes permit the use case.
- No scraping of logged-in sites, no access-control bypass and no false implication of official LinkedIn integration.
- Field-level source, source reference, imported time, confidence, parser version and confirmation status.
- Duplicate detection for roles, dates, education, skills and achievements; conflicts require a merge decision.
- Reversible merge preview and audit trail; unconfirmed facts remain in staging.
- Transient raw source processing; no permanent server-side source-file retention.

## 4. Explicit non-goals

- Do not create a duplicate career profile, resume editor, parser, scoring engine, application tracker or AI provider abstraction.
- Do not make this feature a prerequisite for core resume creation.
- Do not silently publish, share, import, submit, or mutate user data.
- Do not store generated/downloaded document binaries permanently on the server.
- Do not make unsupported claims about ATS ranking, hiring probability or guaranteed outcomes.

## 5. Domain model

**Proposed entities:** CareerImportJob, ImportSource, ImportedField, ImportConflict, ImportMergeDecision, ProviderConnection, ImportAuditEvent.

The entities above are additive to the existing canonical model. Use stable IDs, tenant/user ownership, created/updated timestamps, soft-delete only where a documented retention requirement needs it, and audit events for sensitive actions. Store references to canonical profile facts, evidence records, immutable resume versions and host-portal records rather than duplicating their full payloads.

**Data ownership rules**
- Candidate-controlled records belong to the Resume platform and are scoped to the authenticated user/tenant.
- X Cron job listings, employer records and application stages remain owned by X Cron.
- External host references are opaque identifiers and do not grant authorization.
- File binaries remain local-first; only approved structured metadata is persisted.

## 6. API contract

All routes are versioned under `/api/v1`, authenticated and protected by object-level authorization.

- `POST /career-imports`
- `GET /career-imports/:id`
- `POST /career-imports/:id/preview`
- `POST /career-imports/:id/confirm`
- `POST /career-imports/:id/merge-preview`
- `POST /career-imports/:id/resolve-conflicts`
- `DELETE /career-imports/:id`
- `POST /provider-connections/:provider/authorize.`

**Contract rules**
- Validate DTOs at the API boundary; reject unknown writable fields where appropriate.
- Use pagination, idempotency keys for retryable create/ingest operations and consistent error envelopes.
- Never return an unrestricted career profile or cross-tenant object.
- Publish OpenAPI schemas and generate/update the supported SDK.
- Emit signed, minimal webhooks only when an authorized integration requires them; never include resume text, credentials or contact notes in webhook payloads.

## 7. Architecture and component design

Use an asynchronous import state machine: uploaded/received → scanning → parsing → review-ready → confirmed or discarded. Parser adapters normalize into a staging schema; a merge service writes canonical profile records only after explicit confirmation. Use worker queue for expensive parsing when load justifies it. Keep source bytes in memory or transient encrypted scratch storage and purge on completion/expiry.

**Frontend:** Angular feature area with lazy-loaded routes, accessible responsive components, loading/empty/error states and clear consent/review interactions. Shared design tokens are reused; this feature owns its workflows and tests.

**Backend:** NestJS modular monolith module initially. Expose domain interfaces and application services; avoid direct cross-module table access. Extract a separate service only when measured scaling, isolation, security or release-cadence requirements justify it.

**Async processing:** Use a worker only for work that is genuinely long-running or retryable. Use an outbox for reliable domain events. Every job must be idempotent, observable and cancellable where practical.

## 8. Security, privacy and responsible-use controls

Validate MIME by content, malware-scan supported uploads, limit archive expansion, block SSRF and unsafe URLs, encrypt transient data, enforce ownership on every import ID and delete provider tokens on disconnect. OAuth scopes must be minimal and revocable. Never log raw imported text.

Additional mandatory controls:
- Authentication is required; enforce tenant isolation and object-level authorization on every read/write.
- Rate-limit public and expensive operations; validate and normalize all untrusted input.
- Do not put access tokens, personal data or sensitive content in URLs.
- Keep secrets in managed configuration; rotate and scope provider credentials.
- Define retention, export, deletion, backup and incident-response behavior before production release.
- Record security-relevant audit events without recording raw document content or secrets.

## 9. Acceptance criteria

1. Every imported field is traceable to a source and remains unconfirmed until candidate approval or a separately defined trusted verification workflow.
2. Unauthorized users cannot read, modify, enumerate or delete another user's records.
3. All create/update/delete and consent-sensitive paths have automated unit and integration tests.
4. API contract and SDK documentation match the implementation.
5. Feature works on supported web/mobile layouts and is keyboard/screen-reader accessible.
6. Failure, retry, cancellation and deletion behavior are tested.
7. AI/provider outage does not block manual workflows wherever a manual fallback is defined.
8. Feature can be disabled by configuration without breaking existing resume workflows.

## 10. Delivery phases

P0: PDF/DOCX and JSON/CSV staging import. P1: field-level conflict review and provenance merge. P2: approved provider integrations and advanced reconciliation.

**Release gates:** architecture review, threat model, data lifecycle review, API/SDK review, accessibility QA, automated security tests, observability and rollback plan.

## 11. Dependencies and reuse

Parser laboratory (30), profile (26), provenance (27), AI governance (38), security and local-first policies.

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
