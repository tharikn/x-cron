# 26 — Career Intelligence Engine

## 1. Purpose and product contract
Create a reusable, user-owned professional knowledge base that is the canonical source for all resumes, job matching, recruiter views and interview preparation. A candidate enters facts once, maintains them over time, and deliberately selects which facts appear in each resume. The engine is a domain module in the Resume & Career Intelligence service, not a separately deployed microservice in the initial architecture.

Principles: structured facts over generated prose; explicit source and provenance; user-controlled visibility; immutable history; no inferred protected attributes; no fabricated achievements; tenant isolation; exportability and deletion.

## 2. Bounded contexts
- Identity adapter: maps host-platform subject and tenant; never owns passwords or login.
- Career profile: identity-independent professional facts and preferences.
- Evidence library: source statements, supporting artifacts metadata and confirmation state. Do not store document binaries.
- Skill taxonomy: canonical skills, aliases, categories and relationships.
- Resume projection: selects approved facts into a resume-specific snapshot.
- Career insights: derives non-authoritative timelines and gap/transition prompts from confirmed facts.

## 3. Canonical data model
Use UUID identifiers and tenant-scoped ownership on every aggregate.

| Entity | Key fields | Rules |
|---|---|---|
| CareerProfile | id, subjectId, tenantId, locale, version | One active profile per subject/tenant; soft-delete only where retention policy requires |
| CareerFact | id, profileId, type, payload, status, sourceId, validFrom, validTo | Typed payload validated by fact type; never accept arbitrary executable content |
| Experience | id, profileId, employer, title, employmentType, startDate, endDate, location | Dates may be partial/unknown; no forced end date |
| Achievement | id, experienceId, statement, outcome, metric, scope | Metric is optional and must have user-confirmed source |
| Project | id, profileId, name, role, description, technologies, links | Link validation and visibility controls |
| SkillEvidence | id, skillId, factId, proficiency, evidenceType, lastUsedAt | Proficiency is self-reported or evidence-derived and labelled |
| Education / Certification | id, profileId, institution, credential, dates, status | Verification status is explicit; never imply external verification |
| FactSource | id, sourceType, sourceLabel, capturedAt, contentHash | Store minimal source metadata; no permanent uploaded document |
| FactRevision | id, factId, revision, before/after, actor, createdAt | Audit history; redact sensitive data according to deletion policy |
| ProfileVisibility | profileId, fieldPath, visibility | Private by default; explicit sharing projection only |

Use JSON payloads only for bounded extensible attributes; keep frequently queried fields relational and indexed. Enforce tenant and subject predicates in repository methods, not only controllers.

## 4. Fact lifecycle and provenance
Allowed states: draft, extracted_unconfirmed, user_confirmed, user_corrected, stale, rejected. State transitions are explicit. Extracted facts never become canonical until the user confirms them. Every AI suggestion stores the IDs of supporting facts and prompt/schema/model versions; it cannot create a confirmed fact directly.

Source precedence is not a universal truth ranking. Present conflicting sources to the user and ask them to resolve the conflict. Preserve original user text alongside approved normalized text. Record who changed a fact and when.

## 5. Achievement bank
Store achievements as structured evidence, not just polished bullets:
- Context: project, employer, product or business area.
- Action: what the candidate personally did.
- Technology/skill: canonical taxonomy references.
- Scope: scale/team/users/systems only when supplied.
- Outcome: qualitative or quantified result, optional.
- Evidence: source fact IDs and user confirmation.
- Visibility: private, resume-eligible, shareable.

Provide guided prompts when details are missing: challenge, action, constraints, outcome, scale. Never fabricate a number or imply causality that the user has not confirmed.

## 6. Career transitions and gaps
Derive timeline intervals from dates but do not label gaps as negative. Offer optional neutral prompts such as study, caregiving, health-related leave, relocation, independent work or personal reasons; never require disclosure. Do not infer the reason. Transferable-skill suggestions must show the source experiences and distinguish existing evidence from skills to learn.

## 7. APIs and events
Initial REST surface:
- GET/PUT /v1/career-profile
- POST /v1/career-facts and PATCH/DELETE /v1/career-facts/:id
- GET /v1/career-facts/:id/history
- POST /v1/achievement-drafts (suggestions only)
- POST /v1/career-profile/confirm-import
- GET /v1/skill-taxonomy/search
- POST /v1/career-profile/export-data

Use optimistic concurrency with profileVersion / If-Match. Emit versioned domain events such as career.fact.confirmed, career.fact.updated and career.profile.deleted through an outbox; consumers must be idempotent. Do not publish resume text or PII in event payloads; publish identifiers and minimal metadata.

## 8. Privacy, security and retention
Private by default. Minimize contact data in AI requests. Encrypt sensitive fields at rest where justified and manage keys outside the database. Never log resume facts, contact details, prompts or document contents. Support data export, correction and deletion. Define tenant isolation tests, audit access to shared projections, and expire derived reports when source facts are deleted or materially changed.

## 9. Acceptance criteria
- A user can maintain one structured profile and reuse facts across multiple resumes.
- Every extracted or AI-suggested fact is visibly unconfirmed until user approval.
- Resume editing does not mutate canonical facts unless the user explicitly syncs.
- Conflicting facts are surfaced, not silently overwritten.
- Every achievement can be traced to user-entered or user-confirmed evidence.
- Career gaps and nontraditional paths are not penalized or assigned inferred reasons.
- Cross-tenant access, deletion, export and optimistic concurrency are tested.
- The system remains usable with AI disabled.

## 10. Delivery
P0: profile schema, CRUD, revisions, source/provenance, manual achievement bank. P1: taxonomy, import mapping, reusable skill evidence and transition prompts. P2: optional verified credentials integrations and richer career insights.
