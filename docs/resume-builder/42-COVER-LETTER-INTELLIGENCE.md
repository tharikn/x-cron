# 42 — Cover Letter Intelligence

**Status:** Proposed standalone feature specification  
**Product:** Independent Resume & Career Intelligence platform  
**Parent integration:** X Cron Jobs is one authorized host, not the owner of this feature's domain data  
**Delivery principle:** Independently testable feature module; independently deployable client/API platform remains defined in document 39.

## 1. Problem and product outcome

Generic cover letters are disconnected from the selected job and can contradict or embellish the candidate's actual career history.

**Goal:** Create evidence-grounded, role-specific cover letters that remain versioned and bound to the exact resume and application context.

**Primary actors:** Candidate, AI orchestration layer, authorized host job portal.

## 2. User journey

Candidate selects a job/JD, a resume version and desired tone/length; system proposes an outline and draft; each factual claim is linked to confirmed evidence or marked as user-authored; candidate edits and approves; export stays local and the exact version may be attached to an application.

## 3. Functional requirements

- Draft from normalized JD, selected resume version and confirmed career facts only.
- Templates for concise, standard, career-change and referral/contextual letters; templates are versioned.
- Evidence references for employer names, skills, achievements, metrics and experience claims.
- Clearly label unsupported or user-authored statements; never fabricate familiarity, referrals or employer research.
- Section-level editing, tone/length controls, diff, regeneration of selected sections and immutable versions.
- Bind submitted cover-letter version to an application alongside the exact resume version.
- Local export and manual-edit path must work without AI.

## 4. Explicit non-goals

- Do not create a duplicate career profile, resume editor, parser, scoring engine, application tracker or AI provider abstraction.
- Do not make this feature a prerequisite for core resume creation.
- Do not silently publish, share, import, submit, or mutate user data.
- Do not store generated/downloaded document binaries permanently on the server.
- Do not make unsupported claims about ATS ranking, hiring probability or guaranteed outcomes.

## 5. Domain model

**Proposed entities:** CoverLetter, CoverLetterTemplate, CoverLetterVersion, CoverLetterClaim, CoverLetterResumeBinding, CoverLetterApplicationBinding.

The entities above are additive to the existing canonical model. Use stable IDs, tenant/user ownership, created/updated timestamps, soft-delete only where a documented retention requirement needs it, and audit events for sensitive actions. Store references to canonical profile facts, evidence records, immutable resume versions and host-portal records rather than duplicating their full payloads.

**Data ownership rules**
- Candidate-controlled records belong to the Resume platform and are scoped to the authenticated user/tenant.
- X Cron job listings, employer records and application stages remain owned by X Cron.
- External host references are opaque identifiers and do not grant authorization.
- File binaries remain local-first; only approved structured metadata is persisted.

## 6. API contract

All routes are versioned under `/api/v1`, authenticated and protected by object-level authorization.

- `POST /cover-letters/drafts`
- `GET /cover-letters`
- `GET /cover-letters/:id`
- `POST /cover-letters/:id/versions`
- `POST /cover-letters/:id/claims/validate`
- `POST /cover-letters/:id/export/:format`
- `POST /applications/:id/cover-letter-bindings.`

**Contract rules**
- Validate DTOs at the API boundary; reject unknown writable fields where appropriate.
- Use pagination, idempotency keys for retryable create/ingest operations and consistent error envelopes.
- Never return an unrestricted career profile or cross-tenant object.
- Publish OpenAPI schemas and generate/update the supported SDK.
- Emit signed, minimal webhooks only when an authorized integration requires them; never include resume text, credentials or contact notes in webhook payloads.

## 7. Architecture and component design

NestJS CoverLetterModule orchestrates existing profile, provenance, JD and version services through domain interfaces. AI output is an untrusted draft candidate; a deterministic claim-validation step annotates claims before persistence. Store structured content and metadata, not permanent document binaries. Angular editor shows evidence chips and unsupported-claim warnings inline.

**Frontend:** Angular feature area with lazy-loaded routes, accessible responsive components, loading/empty/error states and clear consent/review interactions. Shared design tokens are reused; this feature owns its workflows and tests.

**Backend:** NestJS modular monolith module initially. Expose domain interfaces and application services; avoid direct cross-module table access. Extract a separate service only when measured scaling, isolation, security or release-cadence requirements justify it.

**Async processing:** Use a worker only for work that is genuinely long-running or retryable. Use an outbox for reliable domain events. Every job must be idempotent, observable and cancellable where practical.

## 8. Security, privacy and responsible-use controls

Never send the entire career profile when selected facts suffice. Redact sensitive fields from prompts, isolate tenant data, audit AI operations without logging full prompts or letter text, and require user approval before an application binding is created. No claim of improved hiring probability.

Additional mandatory controls:
- Authentication is required; enforce tenant isolation and object-level authorization on every read/write.
- Rate-limit public and expensive operations; validate and normalize all untrusted input.
- Do not put access tokens, personal data or sensitive content in URLs.
- Keep secrets in managed configuration; rotate and scope provider credentials.
- Define retention, export, deletion, backup and incident-response behavior before production release.
- Record security-relevant audit events without recording raw document content or secrets.

## 9. Acceptance criteria

1. No generated draft introduces an unsupported factual claim; candidate can trace each claim, edit it and reproduce the exact submitted version.
2. Unauthorized users cannot read, modify, enumerate or delete another user's records.
3. All create/update/delete and consent-sensitive paths have automated unit and integration tests.
4. API contract and SDK documentation match the implementation.
5. Feature works on supported web/mobile layouts and is keyboard/screen-reader accessible.
6. Failure, retry, cancellation and deletion behavior are tested.
7. AI/provider outage does not block manual workflows wherever a manual fallback is defined.
8. Feature can be disabled by configuration without breaking existing resume workflows.

## 10. Delivery phases

P0: structured editor, templates and local export. P1: evidence-linked AI drafting and claim review. P2: application version binding and outcome analytics only where authorized.

**Release gates:** architecture review, threat model, data lifecycle review, API/SDK review, accessibility QA, automated security tests, observability and rollback plan.

## 11. Dependencies and reuse

26–29, 33, 38; local-first document policy; versioned API architecture.

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
