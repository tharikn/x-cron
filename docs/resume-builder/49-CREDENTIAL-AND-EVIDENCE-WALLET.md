# 49 — Credential and Evidence Wallet

**Status:** Proposed standalone feature specification  
**Product:** Independent Resume & Career Intelligence platform  
**Parent integration:** X Cron Jobs is one authorized host, not the owner of this feature's domain data  
**Delivery principle:** Independently testable feature module; independently deployable client/API platform remains defined in document 39.

## 1. Problem and product outcome

Candidates need structured credential references and evidence provenance, but storing unrestricted identity documents creates unnecessary privacy and security risk.

**Goal:** Organize credential metadata and evidence references, distinguish verification levels and let users selectively disclose credentials.

**Primary actors:** Candidate, optional trusted credential issuer/provider, recruiter or portfolio viewer receiving explicit disclosure.

## 2. User journey

Candidate adds credential metadata and optional verification URL; system records source and status; candidate requests provider verification only with consent; candidate chooses a credential for a resume/portfolio/share; disclosure is revoked or expires.

## 3. Functional requirements

- Metadata: issuer, credential name, issue/expiry date, credential ID/reference, status and public verification URL when supplied.
- Default to metadata/reference only; do not store credential document binaries.
- Distinct states: self-reported, document-reviewed, issuer-verified, expired, revoked and unable-to-verify.
- Trusted verification provider integration only with explicit consent and documented semantics.
- Selective disclosure into resume, portfolio or recruiter share; no public disclosure by default.
- Verification status carries source, timestamp and expiry/recheck policy.

## 4. Explicit non-goals

- Do not create a duplicate career profile, resume editor, parser, scoring engine, application tracker or AI provider abstraction.
- Do not make this feature a prerequisite for core resume creation.
- Do not silently publish, share, import, submit, or mutate user data.
- Do not store generated/downloaded document binaries permanently on the server.
- Do not make unsupported claims about ATS ranking, hiring probability or guaranteed outcomes.

## 5. Domain model

**Proposed entities:** CredentialRecord, CredentialIssuer, CredentialVerification, EvidenceReference, CredentialDisclosureGrant, VerificationProviderConnection.

The entities above are additive to the existing canonical model. Use stable IDs, tenant/user ownership, created/updated timestamps, soft-delete only where a documented retention requirement needs it, and audit events for sensitive actions. Store references to canonical profile facts, evidence records, immutable resume versions and host-portal records rather than duplicating their full payloads.

**Data ownership rules**
- Candidate-controlled records belong to the Resume platform and are scoped to the authenticated user/tenant.
- X Cron job listings, employer records and application stages remain owned by X Cron.
- External host references are opaque identifiers and do not grant authorization.
- File binaries remain local-first; only approved structured metadata is persisted.

## 6. API contract

All routes are versioned under `/api/v1`, authenticated and protected by object-level authorization.

- `GET/POST /credentials`
- `GET/PATCH/DELETE /credentials/:id`
- `POST /credentials/:id/verification-requests`
- `GET /credentials/:id/verification`
- `POST /credentials/:id/disclosure-grants`
- `POST /credential-disclosures/:id/revoke.`

**Contract rules**
- Validate DTOs at the API boundary; reject unknown writable fields where appropriate.
- Use pagination, idempotency keys for retryable create/ingest operations and consistent error envelopes.
- Never return an unrestricted career profile or cross-tenant object.
- Publish OpenAPI schemas and generate/update the supported SDK.
- Emit signed, minimal webhooks only when an authorized integration requires them; never include resume text, credentials or contact notes in webhook payloads.

## 7. Architecture and component design

CredentialModule stores structured metadata and references. Verification adapters normalize provider responses without upgrading status beyond what the provider actually attests. Evidence links connect to provenance records; disclosure grants produce minimal scoped projections for a selected recipient and purpose.

**Frontend:** Angular feature area with lazy-loaded routes, accessible responsive components, loading/empty/error states and clear consent/review interactions. Shared design tokens are reused; this feature owns its workflows and tests.

**Backend:** NestJS modular monolith module initially. Expose domain interfaces and application services; avoid direct cross-module table access. Extract a separate service only when measured scaling, isolation, security or release-cadence requirements justify it.

**Async processing:** Use a worker only for work that is genuinely long-running or retryable. Use an outbox for reliable domain events. Every job must be idempotent, observable and cancellable where practical.

## 8. Security, privacy and responsible-use controls

Do not collect government identity documents unless a future reviewed requirement makes it essential. Encrypt credential identifiers, mask them in UI, never place them in public URLs or logs, and enforce purpose-bound disclosure with expiry/revocation. Clearly distinguish user assertion from issuer verification.

Additional mandatory controls:
- Authentication is required; enforce tenant isolation and object-level authorization on every read/write.
- Rate-limit public and expensive operations; validate and normalize all untrusted input.
- Do not put access tokens, personal data or sensitive content in URLs.
- Keep secrets in managed configuration; rotate and scope provider credentials.
- Define retention, export, deletion, backup and incident-response behavior before production release.
- Record security-relevant audit events without recording raw document content or secrets.

## 9. Acceptance criteria

1. Verification status is traceable to a source and timestamp; candidate controls disclosure and raw credentials are not exposed publicly by default.
2. Unauthorized users cannot read, modify, enumerate or delete another user's records.
3. All create/update/delete and consent-sensitive paths have automated unit and integration tests.
4. API contract and SDK documentation match the implementation.
5. Feature works on supported web/mobile layouts and is keyboard/screen-reader accessible.
6. Failure, retry, cancellation and deletion behavior are tested.
7. AI/provider outage does not block manual workflows wherever a manual fallback is defined.
8. Feature can be disabled by configuration without breaking existing resume workflows.

## 10. Delivery phases

P0: metadata and self-reported status. P1: provenance references and selective disclosure. P2: issuer verification integrations after provider/legal review.

**Release gates:** architecture review, threat model, data lifecycle review, API/SDK review, accessibility QA, automated security tests, observability and rollback plan.

## 11. Dependencies and reuse

Provenance (27), profile (26), sharing (36), portfolio (41), provider contracts and privacy review.

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
