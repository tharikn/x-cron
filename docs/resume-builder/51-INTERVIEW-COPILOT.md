# 51 — Interview Copilot

**Status:** Proposed standalone feature specification  
**Product:** Independent Resume & Career Intelligence platform  
**Parent integration:** X Cron Jobs is one authorized host, not the owner of this feature's domain data  
**Delivery principle:** Independently testable feature module; independently deployable client/API platform remains defined in document 39.

## 1. Problem and product outcome

Text-based preparation may not provide enough realistic practice, structured feedback and repeated rehearsal for role-specific interviews.

**Goal:** Extend interview preparation with optional, consent-based practice sessions grounded in a selected resume version and job description.

**Primary actors:** Candidate, interview practice engine, speech/transcription provider if enabled.

## 2. User journey

Candidate selects role/JD and resume version; chooses text or optional voice practice; system asks grounded questions; candidate responds; system provides post-session feedback with evidence alignment and improvement suggestions; candidate deletes session data or saves a summary.

## 3. Functional requirements

- Start with asynchronous text practice; optional voice sessions are a later opt-in capability.
- Questions grounded in selected resume facts and normalized JD; explain why each question was selected.
- Feedback on relevance, structure, specificity, evidence and clarity; no personality or employability score.
- Disclose recording/transcription provider, processing location and retention before voice starts.
- Default to no retained raw audio; transcript retention is separately configurable and opt-in.
- Practice mode only; never impersonate candidate or provide covert assistance during live hiring assessments.
- Accessibility options: text alternative, captions and adjustable pacing.

## 4. Explicit non-goals

- Do not create a duplicate career profile, resume editor, parser, scoring engine, application tracker or AI provider abstraction.
- Do not make this feature a prerequisite for core resume creation.
- Do not silently publish, share, import, submit, or mutate user data.
- Do not store generated/downloaded document binaries permanently on the server.
- Do not make unsupported claims about ATS ranking, hiring probability or guaranteed outcomes.

## 5. Domain model

**Proposed entities:** InterviewPracticeSession, PracticeQuestion, CandidateAnswer, FeedbackDimension, SessionConsent, TranscriptRetentionPolicy.

The entities above are additive to the existing canonical model. Use stable IDs, tenant/user ownership, created/updated timestamps, soft-delete only where a documented retention requirement needs it, and audit events for sensitive actions. Store references to canonical profile facts, evidence records, immutable resume versions and host-portal records rather than duplicating their full payloads.

**Data ownership rules**
- Candidate-controlled records belong to the Resume platform and are scoped to the authenticated user/tenant.
- X Cron job listings, employer records and application stages remain owned by X Cron.
- External host references are opaque identifiers and do not grant authorization.
- File binaries remain local-first; only approved structured metadata is persisted.

## 6. API contract

All routes are versioned under `/api/v1`, authenticated and protected by object-level authorization.

- `POST /interview-copilot/sessions`
- `GET /interview-copilot/sessions/:id`
- `POST /interview-copilot/sessions/:id/answers`
- `POST /interview-copilot/sessions/:id/feedback`
- `POST /interview-copilot/sessions/:id/consent`
- `DELETE /interview-copilot/sessions/:id.`

**Contract rules**
- Validate DTOs at the API boundary; reject unknown writable fields where appropriate.
- Use pagination, idempotency keys for retryable create/ingest operations and consistent error envelopes.
- Never return an unrestricted career profile or cross-tenant object.
- Publish OpenAPI schemas and generate/update the supported SDK.
- Emit signed, minimal webhooks only when an authorized integration requires them; never include resume text, credentials or contact notes in webhook payloads.

## 7. Architecture and component design

Reuse interview question generation and grounding from module 35. Session orchestration is a bounded workflow with per-session context selection and provider abstraction. Voice adapter is isolated behind a feature flag. Store structured feedback and only user-approved summaries; raw audio is not retained by default.

**Frontend:** Angular feature area with lazy-loaded routes, accessible responsive components, loading/empty/error states and clear consent/review interactions. Shared design tokens are reused; this feature owns its workflows and tests.

**Backend:** NestJS modular monolith module initially. Expose domain interfaces and application services; avoid direct cross-module table access. Extract a separate service only when measured scaling, isolation, security or release-cadence requirements justify it.

**Async processing:** Use a worker only for work that is genuinely long-running or retryable. Use an outbox for reliable domain events. Every job must be idempotent, observable and cancellable where practical.

## 8. Security, privacy and responsible-use controls

No covert recording, emotion inference, accent scoring, appearance evaluation or protected-trait analysis. Disclose provider and retention before voice use. Minimize prompt context, encrypt transcripts if retained, support deletion and never assist covertly during a live hiring test.

Additional mandatory controls:
- Authentication is required; enforce tenant isolation and object-level authorization on every read/write.
- Rate-limit public and expensive operations; validate and normalize all untrusted input.
- Do not put access tokens, personal data or sensitive content in URLs.
- Keep secrets in managed configuration; rotate and scope provider credentials.
- Define retention, export, deletion, backup and incident-response behavior before production release.
- Record security-relevant audit events without recording raw document content or secrets.

## 9. Acceptance criteria

1. Every session is opt-in and deletable; questions and feedback are grounded in selected facts; no hidden recording or covert live-interview assistance exists.
2. Unauthorized users cannot read, modify, enumerate or delete another user's records.
3. All create/update/delete and consent-sensitive paths have automated unit and integration tests.
4. API contract and SDK documentation match the implementation.
5. Feature works on supported web/mobile layouts and is keyboard/screen-reader accessible.
6. Failure, retry, cancellation and deletion behavior are tested.
7. AI/provider outage does not block manual workflows wherever a manual fallback is defined.
8. Feature can be disabled by configuration without breaking existing resume workflows.

## 10. Delivery phases

P0: strengthen text practice and evidence-grounded feedback. P1: opt-in voice practice with no raw audio retention. P2: evaluate additional modalities only after separate safety/privacy review.

**Release gates:** architecture review, threat model, data lifecycle review, API/SDK review, accessibility QA, automated security tests, observability and rollback plan.

## 11. Dependencies and reuse

Interview preparation (35), evidence provenance (27), AI governance (38), speech provider and retention policy approval.

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
