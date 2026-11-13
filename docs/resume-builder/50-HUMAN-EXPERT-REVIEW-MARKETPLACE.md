# 50 — Human Expert Review Marketplace

**Status:** Proposed standalone feature specification  
**Product:** Independent Resume & Career Intelligence platform  
**Parent integration:** X Cron Jobs is one authorized host, not the owner of this feature's domain data  
**Delivery principle:** Independently testable feature module; independently deployable client/API platform remains defined in document 39.

## 1. Problem and product outcome

Some candidates want qualified human feedback in addition to automated checks, but reviewer access must not compromise control of the candidate's career data.

**Goal:** Offer an optional, paid, consent-based review workflow where reviewers comment on an exact resume version without mutating canonical career facts.

**Primary actors:** Candidate, vetted reviewer, marketplace operations/support, payment provider.

## 2. User journey

Candidate selects a specific resume version and review package; sees the exact data to be shared and price; consents and submits; vetted reviewer receives time-limited read-only access; reviewer returns structured feedback; candidate accepts/rejects suggestions and creates a new version if desired.

## 3. Functional requirements

- Optional paid add-on; core resume creation remains fully usable without it.
- Candidate selects exact resume version and explicitly shares the minimum required context.
- Reviewer identity, expertise claims, vetting status, service level and conflict policy are visible.
- Time-limited, read-only reviewer access with audit trail and immediate revocation.
- Structured rubric and section-linked comments; reviewer cannot edit canonical facts or publish changes.
- Candidate controls acceptance and creates a new immutable version.
- Define payment, refund, dispute, reviewer removal, retention and deletion before launch.

## 4. Explicit non-goals

- Do not create a duplicate career profile, resume editor, parser, scoring engine, application tracker or AI provider abstraction.
- Do not make this feature a prerequisite for core resume creation.
- Do not silently publish, share, import, submit, or mutate user data.
- Do not store generated/downloaded document binaries permanently on the server.
- Do not make unsupported claims about ATS ranking, hiring probability or guaranteed outcomes.

## 5. Domain model

**Proposed entities:** ExpertReviewer, ReviewerCredential, ReviewPackage, ExpertReviewRequest, ReviewAccessGrant, ReviewFeedback, ReviewDispute, PaymentReference.

The entities above are additive to the existing canonical model. Use stable IDs, tenant/user ownership, created/updated timestamps, soft-delete only where a documented retention requirement needs it, and audit events for sensitive actions. Store references to canonical profile facts, evidence records, immutable resume versions and host-portal records rather than duplicating their full payloads.

**Data ownership rules**
- Candidate-controlled records belong to the Resume platform and are scoped to the authenticated user/tenant.
- X Cron job listings, employer records and application stages remain owned by X Cron.
- External host references are opaque identifiers and do not grant authorization.
- File binaries remain local-first; only approved structured metadata is persisted.

## 6. API contract

All routes are versioned under `/api/v1`, authenticated and protected by object-level authorization.

- `GET /reviewers`
- `GET /review-packages`
- `POST /expert-reviews`
- `GET /expert-reviews/:id`
- `POST /expert-reviews/:id/grant`
- `POST /expert-reviews/:id/revoke`
- `POST /expert-reviews/:id/feedback`
- `POST /expert-reviews/:id/disputes.`

**Contract rules**
- Validate DTOs at the API boundary; reject unknown writable fields where appropriate.
- Use pagination, idempotency keys for retryable create/ingest operations and consistent error envelopes.
- Never return an unrestricted career profile or cross-tenant object.
- Publish OpenAPI schemas and generate/update the supported SDK.
- Emit signed, minimal webhooks only when an authorized integration requires them; never include resume text, credentials or contact notes in webhook payloads.

## 7. Architecture and component design

Keep marketplace workflow isolated from the core resume domain. Review access resolves an immutable version snapshot through a dedicated read-only projection, not general profile APIs. Payment provider stores only transaction references. Reviewer feedback is a separate artifact; accepted feedback creates a candidate-controlled edit/version.

**Frontend:** Angular feature area with lazy-loaded routes, accessible responsive components, loading/empty/error states and clear consent/review interactions. Shared design tokens are reused; this feature owns its workflows and tests.

**Backend:** NestJS modular monolith module initially. Expose domain interfaces and application services; avoid direct cross-module table access. Extract a separate service only when measured scaling, isolation, security or release-cadence requirements justify it.

**Async processing:** Use a worker only for work that is genuinely long-running or retryable. Use an outbox for reliable domain events. Every job must be idempotent, observable and cancellable where practical.

## 8. Security, privacy and responsible-use controls

Vetting, confidentiality, reviewer access audit, least-privilege and time-limited grants are release blockers. Do not expose unrelated profile fields, contact details or private notes. Define incident response, dispute and deletion procedures. Never guarantee interview/job outcomes.

Additional mandatory controls:
- Authentication is required; enforce tenant isolation and object-level authorization on every read/write.
- Rate-limit public and expensive operations; validate and normalize all untrusted input.
- Do not put access tokens, personal data or sensitive content in URLs.
- Keep secrets in managed configuration; rotate and scope provider credentials.
- Define retention, export, deletion, backup and incident-response behavior before production release.
- Record security-relevant audit events without recording raw document content or secrets.

## 9. Acceptance criteria

1. Reviewer access expires or is revoked, every access is audited, and no reviewer can change canonical profile/resume data without candidate action.
2. Unauthorized users cannot read, modify, enumerate or delete another user's records.
3. All create/update/delete and consent-sensitive paths have automated unit and integration tests.
4. API contract and SDK documentation match the implementation.
5. Feature works on supported web/mobile layouts and is keyboard/screen-reader accessible.
6. Failure, retry, cancellation and deletion behavior are tested.
7. AI/provider outage does not block manual workflows wherever a manual fallback is defined.
8. Feature can be disabled by configuration without breaking existing resume workflows.

## 10. Delivery phases

P0: validate demand and operating model; do not build marketplace prematurely. P1: invite-only expert review with manual operations. P2: scalable marketplace only after vetting, payments, support and legal processes are ready.

**Release gates:** architecture review, threat model, data lifecycle review, API/SDK review, accessibility QA, automated security tests, observability and rollback plan.

## 11. Dependencies and reuse

Immutable versions (28), quality review (31), sharing grants (36), payment provider decision and operational/legal review.

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
