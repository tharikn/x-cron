# 44 — Career Path and Compensation Intelligence

**Status:** Proposed standalone feature specification  
**Product:** Independent Resume & Career Intelligence platform  
**Parent integration:** X Cron Jobs is one authorized host, not the owner of this feature's domain data  
**Delivery principle:** Independently testable feature module; independently deployable client/API platform remains defined in document 39.

## 1. Problem and product outcome

Skill-gap reports identify missing skills but do not explain realistic adjacent roles, milestones or sourced compensation context.

**Goal:** Offer explainable career-path options based on demonstrated skills, experience, user goals and appropriately sourced market data.

**Primary actors:** Candidate, career-path analysis engine, licensed compensation-data provider where available.

## 2. User journey

Candidate selects a target role or exploration goal; engine compares confirmed profile facts with role requirements; candidate sees adjacent roles, transferable skills, evidence gaps and learning milestones; optional compensation panel shows sourced ranges with geography and date; candidate saves and edits a development plan.

## 3. Functional requirements

- Suggest adjacent and next-step role families using confirmed skills, experience and user-stated goals.
- Explain why each role is suggested and show transferable skills versus missing recorded evidence.
- Separate actual skill gaps from missing profile evidence; do not assume absence from profile means absence of skill.
- Editable learning goals, milestones, target dates and progress status.
- Compensation ranges only from licensed/reliable sources; show currency, geography, sample size where available, source and retrieval date.
- Clearly separate observed market data from model-generated qualitative guidance; no numeric estimate when no reliable source exists.
- No protected-trait inference or deterministic employability labels.

## 4. Explicit non-goals

- Do not create a duplicate career profile, resume editor, parser, scoring engine, application tracker or AI provider abstraction.
- Do not make this feature a prerequisite for core resume creation.
- Do not silently publish, share, import, submit, or mutate user data.
- Do not store generated/downloaded document binaries permanently on the server.
- Do not make unsupported claims about ATS ranking, hiring probability or guaranteed outcomes.

## 5. Domain model

**Proposed entities:** CareerPathAnalysis, CareerPathOption, TransferableSkill, EvidenceGap, DevelopmentPlan, DevelopmentMilestone, CompensationObservation, CompensationSource.

The entities above are additive to the existing canonical model. Use stable IDs, tenant/user ownership, created/updated timestamps, soft-delete only where a documented retention requirement needs it, and audit events for sensitive actions. Store references to canonical profile facts, evidence records, immutable resume versions and host-portal records rather than duplicating their full payloads.

**Data ownership rules**
- Candidate-controlled records belong to the Resume platform and are scoped to the authenticated user/tenant.
- X Cron job listings, employer records and application stages remain owned by X Cron.
- External host references are opaque identifiers and do not grant authorization.
- File binaries remain local-first; only approved structured metadata is persisted.

## 6. API contract

All routes are versioned under `/api/v1`, authenticated and protected by object-level authorization.

- `POST /career-paths/analyze`
- `GET /career-paths`
- `POST /career-paths`
- `PATCH /career-paths/:id`
- `PATCH /career-paths/:id/milestones/:milestoneId`
- `GET /compensation-insights?role=&location=&currency=.`

**Contract rules**
- Validate DTOs at the API boundary; reject unknown writable fields where appropriate.
- Use pagination, idempotency keys for retryable create/ingest operations and consistent error envelopes.
- Never return an unrestricted career profile or cross-tenant object.
- Publish OpenAPI schemas and generate/update the supported SDK.
- Emit signed, minimal webhooks only when an authorized integration requires them; never include resume text, credentials or contact notes in webhook payloads.

## 7. Architecture and component design

Role taxonomy and deterministic skill mapping provide the explainable base. AI may summarize pathways but cannot invent source data. Compensation ingestion is an adapter with licensing, freshness and provenance metadata. Store dated observations separately from candidate profile data. Show confidence/coverage and missing-data explanations in Angular.

**Frontend:** Angular feature area with lazy-loaded routes, accessible responsive components, loading/empty/error states and clear consent/review interactions. Shared design tokens are reused; this feature owns its workflows and tests.

**Backend:** NestJS modular monolith module initially. Expose domain interfaces and application services; avoid direct cross-module table access. Extract a separate service only when measured scaling, isolation, security or release-cadence requirements justify it.

**Async processing:** Use a worker only for work that is genuinely long-running or retryable. Use an outbox for reliable domain events. Every job must be idempotent, observable and cancellable where practical.

## 8. Security, privacy and responsible-use controls

Do not infer or use protected characteristics. Do not rank candidate worth or predict hiring outcomes. Limit location precision, disclose data sources and retention, and avoid sending sensitive profile attributes to compensation providers.

Additional mandatory controls:
- Authentication is required; enforce tenant isolation and object-level authorization on every read/write.
- Rate-limit public and expensive operations; validate and normalize all untrusted input.
- Do not put access tokens, personal data or sensitive content in URLs.
- Keep secrets in managed configuration; rotate and scope provider credentials.
- Define retention, export, deletion, backup and incident-response behavior before production release.
- Record security-relevant audit events without recording raw document content or secrets.

## 9. Acceptance criteria

1. Every suggested path cites supporting profile facts and every compensation value carries source, geography, currency and observation date; no source means no numeric salary claim.
2. Unauthorized users cannot read, modify, enumerate or delete another user's records.
3. All create/update/delete and consent-sensitive paths have automated unit and integration tests.
4. API contract and SDK documentation match the implementation.
5. Feature works on supported web/mobile layouts and is keyboard/screen-reader accessible.
6. Failure, retry, cancellation and deletion behavior are tested.
7. AI/provider outage does not block manual workflows wherever a manual fallback is defined.
8. Feature can be disabled by configuration without breaking existing resume workflows.

## 10. Delivery phases

P0: role taxonomy and evidence-gap explanation. P1: saved development plans and milestones. P2: compensation integration only after source licensing, coverage and freshness are approved.

**Release gates:** architecture review, threat model, data lifecycle review, API/SDK review, accessibility QA, automated security tests, observability and rollback plan.

## 11. Dependencies and reuse

Career profile (26), JD intelligence (29), skill-gap module (34), AI governance (38), approved market data source.

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
