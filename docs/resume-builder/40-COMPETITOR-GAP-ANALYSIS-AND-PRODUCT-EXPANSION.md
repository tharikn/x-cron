# 40 — Competitor Gap Analysis and Product Expansion Plan

**Status:** Proposed product scope for review and phased implementation  
**Owner:** Resume & Career Intelligence platform  
**Repository boundary:** `tharikn/x-cron-resume` (target independent platform)  
**Parent product:** X Cron Jobs  
**Last reviewed:** 2026-11-13

## 1. Executive decision

The product should not compete as another AI resume text generator. Its strategic position is an **evidence-grounded Career Intelligence platform** that maintains a reusable, user-controlled career record and turns it into role-specific resumes, job-search workflows, career development and interview preparation.

The existing capabilities 26–38 already cover much of the foundation: career facts, evidence provenance, immutable resume versions, JD intelligence, parser validation, quality regression, job-portal integration, application-to-resume history, skill gaps, interview preparation, recruiter sharing, SDK/webhooks and AI governance.

This document adds the competitor-informed capabilities that are not yet explicitly specified as complete product modules. It deliberately maps them onto existing modules and defines incremental contracts; it does not replace existing specifications.

### Product promise

**One verified career profile. Many job-specific applications. Measurable career progress.**

### Competitive differentiation

1. Facts and claims remain traceable to user-confirmed evidence.
2. A resume is an output of the career profile, not the only place career data lives.
3. Each application can be tied to the exact resume and cover-letter versions used.
4. Job matching, quality review, parsing diagnostics and career readiness remain separate, explainable signals.
5. The platform is reusable by X Cron and other authorized job portals through a standalone microfrontend, APIs and SDK.
6. The default file policy remains local-first; optional sync must be a separately approved privacy feature.

## 2. Competitor landscape — feature signals

This is a public-feature review, not a hands-on product audit. Competitor features and plan availability change; verify current availability, geography, pricing and terms before treating any feature as a committed requirement.

| Product | Publicly documented strengths | Gap/opportunity for this platform |
|---|---|---|
| Teal | Job-search companion/browser extension, saving jobs and managing job-search information; multiple resume versions and job tracking are publicly promoted. | Add an optional job clipper and career workspace while preserving evidence-backed facts and exact resume-version history. |
| Kickresume | Resume and cover-letter templates, AI writing, LinkedIn/PDF import, personal websites, mobile apps and career-map features appear in its public product/pricing material. | Add a portfolio website, richer document suite, controlled imports and evidence-linked career path guidance. |
| Huntr | Job board/kanban, browser extension job capture, application autofill, contacts, activities, documents, maps and metrics are documented in its help centre and product pages. | Add optional job capture, contact CRM, follow-up timeline and application analytics without making the Resume platform own X Cron's job/application source of truth. |
| Jobscan | ATS-oriented resume optimization and LinkedIn/profile optimization are part of its public product positioning. | Keep parser/format validation separate from actual ATS ranking claims; add profile-readiness checks and clearly disclose limits. |
| Rezi | AI resume tailoring and an MCP endpoint for compatible external AI clients are publicly documented. | Offer a governed, user-consented assistant/API integration surface, with evidence checks and scoped operations rather than unrestricted resume mutation. |

### Reference sources

- Teal Chrome Web Store listing: https://chromewebstore.google.com/detail/teal-job-search-companion/opafjjlpbiaicbbgifbejoochmmeikep
- Kickresume pricing/features: https://www.kickresume.com/en/pricing/
- Kickresume help centre: https://www.kickresume.com/en/help-center/general/
- Huntr job tracker overview: https://help.huntr.co/en/articles/9883324-job-tracker
- Huntr browser extension and autofill: https://help.huntr.co/en/articles/9859408-the-huntr-chrome-extension
- Huntr contacts and documents: https://help.huntr.co/en/articles/10089169-contacts-and-documents
- Jobscan product site: https://www.jobscan.co/
- Rezi Resume MCP: https://www.rezi.ai/resume-mcp

## 3. Existing capability coverage

| Capability area | Existing specification | Decision |
|---|---|---|
| Canonical career profile and achievements | 26 | Keep; extend with source-aware imports and credential references |
| Claim verification and provenance | 27 | Keep as a mandatory trust layer |
| Resume variants and immutable versions | 28 | Keep; extend version bindings to cover letters and portfolio snapshots |
| JD intelligence and evidence matching | 29 | Keep; reuse for job clipper and career-path analysis |
| Parser compatibility | 30 | Keep distinct from proprietary ATS scoring |
| Quality/export regression | 31 | Keep; add profile-readiness checks |
| Job portal integration | 32 | Keep; host portal remains owner of job/application lifecycle |
| Application resume vault | 33 | Keep; extend with contact/activity references |
| Skill gaps and readiness | 34 | Keep; extend to explain career paths and salary context |
| Interview preparation | 35 | Keep; real-time copilot is optional and consent-gated |
| Recruiter sharing and feedback | 36 | Keep; extend to portfolio sharing controls |
| SDK/API/webhooks | 37 | Keep; add scoped automation/MCP-compatible integration |
| AI governance | 38 | Keep; govern every new AI capability |
| Standalone platform architecture | 39 | Keep; all new features remain within the independent Resume platform |

No duplicate resume editor, scoring engine, career profile, parser, application tracker or AI provider layer should be created.

## 4. Proposed capability additions

### 4.1 Career Portfolio Website

**Problem:** A PDF resume is static and cannot fully present projects, demos, publications, work samples and a candidate's professional story.

**Scope**
- Generate a responsive public portfolio from a user-selected career profile and selected resume version.
- Sections: headline, about, selected experience, projects, skills, achievements, certifications, publications, links and contact preference.
- Support multiple portfolio variants for different target roles.
- Offer a platform-hosted slug initially; custom domain can be a later paid/advanced capability.
- Privacy controls per section and field: public, hidden, masked or share-only.
- Optional no-index setting, expiry, password protection and immediate revocation.
- Version portfolio snapshots; publishing must not silently expose newly added career facts.
- Keep uploaded images/files local or use explicitly approved external URLs; do not create a general-purpose file vault.

**Reuse:** Career Profile (26), Evidence Provenance (27), Resume Versions (28), Recruiter View (22), Recruiter Sharing (36).

**Acceptance:** A candidate can publish a portfolio from explicitly selected facts, preview it as an anonymous visitor, revoke it immediately and verify that hidden fields are not exposed through HTML, metadata, APIs or search indexing.

### 4.2 Cover Letter Intelligence

**Problem:** Cover letters should be consistent with the exact resume version and target job, not generated as disconnected generic text.

**Scope**
- Create cover-letter drafts from a selected resume version, confirmed career facts and normalized JD.
- Maintain cover-letter templates, sections, variants and immutable versions.
- Link every factual statement to profile evidence or mark it as user-authored/unverified.
- Provide a before/after diff and require user approval for factual changes.
- Support role-specific and employer-specific drafts, export and local save.
- Bind a submitted cover letter to an application alongside the exact resume version.
- Do not claim that a cover letter improves selection probability.

**Reuse:** Career Profile (26), Truth Verification (27), Resume Versioning (28), JD Intelligence (29), Application Resume Vault (33), AI Governance (38).

**Acceptance:** A generated draft never invents a relationship with the employer, project, result or metric; user can trace each claim and reproduce the submitted version.

### 4.3 External Profile and Career Data Import

**Problem:** Re-entering career history is high-friction and leads to inconsistent records.

**Scope**
- Support user-selected PDF/DOCX import and structured JSON/CSV import where safe.
- Support official OAuth/API integrations only when the source permits the use case and scopes.
- Do not scrape LinkedIn or other logged-in websites, bypass access controls, or imply an official integration where none exists.
- Treat imported fields as unconfirmed facts until reviewed by the user.
- Store source type, source reference, imported timestamp, field-level confidence and confirmation status.
- Detect duplicates and conflicting dates/roles; present a merge review instead of overwriting canonical facts.
- Keep raw source files local or transient and delete server-side temporary bytes.

**Reuse:** Resume Import/Parser, Career Profile (26), Evidence Provenance (27), AI Governance (38).

**Acceptance:** No imported field becomes a verified fact without user confirmation or a separately trusted verification process; conflicts are visible and reversible.

### 4.4 Career Path and Compensation Intelligence

**Problem:** Career readiness currently identifies skill gaps but does not define a complete, evidence-linked path between a candidate's current experience and a target role.

**Scope**
- Suggest adjacent and next-step role families using demonstrated skills, experience and user goals.
- Show transferable skills, missing recorded evidence, learning goals and milestone suggestions.
- Show compensation ranges only when a licensed/reliable data source exists; display currency, geography, sample size where available, source and retrieval date.
- Distinguish market data from model-generated estimates. Do not fabricate salary ranges.
- Allow users to compare career paths and save a personal development plan.
- Avoid protected-trait inference and deterministic employability labels.

**Reuse:** Career Readiness (34), JD Intelligence (29), Skill Taxonomy, Analytics and AI Governance (38).

**Acceptance:** Each recommended path explains its supporting career facts and each salary range identifies source and date; no source means no numeric salary claim.

### 4.5 Job Clipper and Browser Extension

**Problem:** Users discover jobs across many sites and need a low-friction way to send a job description to the platform.

**Scope**
- Build a separately packaged browser extension only after core web flows are stable.
- User explicitly clicks “Save job”; extension captures current page URL, title, company and visible job-description text where permitted.
- Show the extracted fields for user review before submission.
- Send a normalized job payload to the Resume API; use a user-scoped, short-lived token or secure OAuth flow.
- Store only the minimum job metadata needed for matching in the Resume platform; X Cron remains the source of truth for X Cron job listings and application status.
- Provide manual paste as fallback.
- Respect browser-store policies, website terms, CSP, permissions and privacy disclosure. No background browsing surveillance.

**Reuse:** JD Intelligence (29), Job Portal Integration (32), SDK (37), existing X Cron job integration.

**Acceptance:** Extension captures only after explicit user action, never reads unrelated tabs, supports manual correction and cannot access another user's profile.

### 4.6 Application CRM and Contact Network

**Problem:** Application tracking alone does not capture networking conversations, recruiter contacts and follow-up history.

**Scope**
- Add a contact record with name, company, role, user-provided contact channels, relationship type and notes.
- Link contacts to a host-owned job/application through an authorized external reference.
- Track user-created activities: outreach, referral request, recruiter call, interview follow-up and thank-you note.
- Add reminders as in-app tasks; email/calendar integrations are optional and separately consented.
- Support export and deletion of contact data.
- Do not enrich contacts from private sources or send unsolicited outreach.

**Reuse:** Application Vault (33), Job Portal Integration (32), Recruiter Sharing (36).

**Ownership rule:** For X Cron users, X Cron remains authoritative for application stage/status. Resume platform may maintain contact/activity context, not a competing copy of the application workflow.

**Acceptance:** Contact and activity records are user-owned, access-controlled and deletable; external IDs alone never grant host-portal access.

### 4.7 Application Autofill Assistant

**Problem:** Re-entering confirmed profile data into application forms creates friction and errors.

**Scope**
- Start with a browser-side assistant that maps user-approved profile fields to visible form fields.
- Show a field mapping review before filling; user confirms each action or an explicitly selected group.
- Never submit an application automatically in the initial release.
- Never bypass login, CAPTCHA, MFA, paywalls, anti-bot controls or site terms.
- Never infer answers to eligibility, legal, demographic or free-text questions.
- Let users exclude sensitive fields and clear local extension data.
- Maintain a site adapter allowlist and a safe manual-copy fallback.

**Reuse:** Career Profile (26), Evidence Provenance (27), SDK (37), Job Clipper (new 4.5).

**Acceptance:** No form is submitted by the assistant; sensitive/unknown fields are left blank; every filled value maps to a confirmed profile fact and is reviewable.

### 4.8 Job Search Analytics

**Problem:** Candidates need to understand their own activity and conversion patterns without misleading causal claims.

**Scope**
- Candidate dashboard: saved jobs, applications, response counts, interview stages, follow-up tasks and time-to-response where the host supplies events.
- Resume insights: which exact versions were used and their associated application outcomes, only where authorized data exists.
- Funnel metrics: application-to-response and response-to-interview rates with sample sizes and time windows.
- Filters: role family, geography, seniority, source and time period.
- Clearly label missing/incomplete data and avoid comparing users or ranking employability.
- No resume text, contact details or full JD content in analytics events.

**Reuse:** Application Vault (33), Analytics, Job Portal Integration (32), AI Governance (38).

**Acceptance:** Every metric defines denominator, date window and data source; no causal statement is made from correlation.

### 4.9 Credential and Evidence Wallet

**Problem:** Candidates need a structured way to organize references to credentials and work evidence without turning the platform into an unbounded document store.

**Scope**
- Maintain credential metadata: issuer, credential name, issue/expiry date, credential ID/reference, verification status and public verification URL if supplied.
- Store evidence references and user notes; default to metadata/reference only, not uploaded document binaries.
- Integrate trusted verification providers only with explicit consent and clear verification semantics.
- Distinguish self-reported, document-reviewed, issuer-verified and expired/revoked states.
- Allow the user to selectively disclose a credential in a resume or portfolio.
- Do not label a credential verified merely because a URL or image was provided.

**Reuse:** Career Profile (26), Evidence Provenance (27), Recruiter Sharing (36), Privacy/Security.

**Acceptance:** Verification status is traceable to a source and timestamp; candidates control disclosure; raw credentials are not exposed in public portfolio by default.

### 4.10 Human Expert Review Marketplace

**Problem:** Some candidates want professional feedback from a human rather than AI-only suggestions.

**Scope**
- Optional paid service, not required for core resume creation.
- Candidate chooses a specific resume version and explicitly shares only the necessary data.
- Reviewer access is time-limited, read-only and audited.
- Feedback uses structured criteria and comments linked to sections; reviewer cannot mutate career facts.
- Candidate decides whether to accept feedback and create a new version.
- Define reviewer vetting, dispute/refund policy, service levels, data deletion and payment provider before launch.
- Keep marketplace operations outside the core resume domain if they become a separate commercial product.

**Reuse:** Quality Review (20/31), Recruiter Sharing (36), Resume Versioning (28).

**Acceptance:** Reviewer access expires/revokes, access is audited and no reviewer can change the candidate's canonical profile or resume without candidate action.

### 4.11 Interview Copilot (optional later)

**Problem:** Existing text-based interview preparation may not cover live practice workflows.

**Scope**
- Extend interview practice to optional voice sessions first; real-time on-screen assistance is a later, separate decision.
- Use the selected resume version and job context to ground practice questions.
- Provide post-session feedback on answer relevance, structure, specificity and evidence alignment.
- Explicitly disclose recording/transcription behavior and retention; default to no recording retention.
- Never evaluate protected traits, appearance, accent or personality.
- Never impersonate the candidate or covertly assist in a live hiring assessment.

**Reuse:** Interview Preparation (35), Evidence Provenance (27), AI Governance (38).

**Acceptance:** Session is opt-in, deletable and grounded in selected facts; no hidden recording or covert interview assistance.

### 4.12 Career Document Suite

**Problem:** Career documents beyond resumes and cover letters often reuse the same verified career facts.

**Scope**
- Generate professional bio, project profile, reference-request email, thank-you note, resignation letter, promotion case and internal role profile.
- Use document-specific templates and tone controls.
- Keep each document versioned and evidence-linked where it contains factual claims.
- Store structured content metadata only; export files to local storage.
- Do not generate legal, immigration or employment-rights advice as authoritative documents.

**Reuse:** Career Profile (26), Truth Verification (27), Resume Versioning (28), Export Engine, AI Governance (38).

**Acceptance:** All factual statements are reviewable and export uses the local-first file policy.

## 5. Prioritization

Scoring: user value, differentiation, reuse and delivery effort are qualitative planning estimates, not market research or validated demand.

| Priority | Capability | Value | Effort | Release |
|---|---|---:|---:|---|
| P0 | Cover Letter Intelligence | High | Medium | First expansion |
| P0 | Career Portfolio Website | High | Medium–High | First expansion |
| P0 | External Profile/Career Data Import | High | Medium | First expansion |
| P0 | Career Path and Compensation Intelligence | High | High | First expansion (salary source dependent) |
| P1 | Job Clipper / Browser Extension | High | High | Job workflow release |
| P1 | Application CRM and Contact Network | High | Medium | Job workflow release |
| P1 | Job Search Analytics | Medium–High | Medium | Job workflow release |
| P1 | Application Autofill Assistant | High | High | After security review |
| P2 | Credential and Evidence Wallet | Medium–High | Medium–High | Trust expansion |
| P2 | Human Expert Review Marketplace | Medium | High | Commercial expansion |
| P2 | Interview Copilot | Medium–High | High | Later experiment |
| P2 | Career Document Suite | Medium | Medium | Incremental |

### Recommended first four

Implement in this order:
1. Cover Letter Intelligence — reuses the strongest existing profile/JD/version foundations.
2. Career Portfolio Website — visible differentiation and shareable candidate value.
3. External Profile Import — reduces onboarding friction while strengthening provenance.
4. Career Path Intelligence — extends the current skill-gap module; salary data is optional and source-dependent.

## 6. Domain model additions

Add the following entities to the existing model only when their corresponding capability is approved. These are additive to the core model in document 04.

| Entity | Key fields | Notes |
|---|---|---|
| CareerSource | id, userId, sourceType, sourceLabel, importedAt, status | Metadata only; no raw file bytes |
| CareerFactSource | id, careerFactId, careerSourceId, confidence, confirmationStatus | Field-level provenance link |
| CoverLetter | id, profileId, name, targetJobAnalysisId, status | Structured content; no binary |
| CoverLetterVersion | id, coverLetterId, versionNumber, snapshot, createdAt | Immutable snapshot |
| Portfolio | id, profileId, slug, visibility, noIndex, expiresAt, status | Public projection configuration |
| PortfolioVersion | id, portfolioId, versionNumber, snapshot, publishedAt | Snapshot of selected fields only |
| PortfolioShare | id, portfolioId, tokenHash, expiresAt, revokedAt, scope | Store token hash, never raw token |
| CareerPathPlan | id, profileId, targetRole, sourceVersion, status | User-owned plan |
| CareerPathMilestone | id, planId, skillId, description, status, targetDate | User-editable milestones |
| CompensationInsight | id, roleKey, geography, currency, range, source, observedAt, expiresAt | Only sourced data; TTL and provenance required |
| ClippedJob | id, userId, sourceUrl, sourceDomain, normalizedJob, capturedAt | Minimum metadata; no unbounded page archive |
| Contact | id, userId, name, company, role, channels, notes | PII; strict access and deletion |
| JobActivity | id, userId, externalJobRef, contactId, activityType, occurredAt, notes | Host status is not authoritative here |
| ApplicationMetricSnapshot | id, userId, period, dimensions, metricValues, sourceCoverage | Aggregated, privacy-safe |
| CredentialReference | id, profileId, issuer, credentialName, reference, verificationState, verifiedAt | Metadata/reference-first |
| ExpertReview | id, resumeVersionId, reviewerId, scope, status, expiresAt | Reviewer access must be separately authorized |
| ExpertReviewFinding | id, reviewId, sectionRef, comment, category, createdAt | Feedback only; no direct profile mutation |
| CareerDocument | id, profileId, documentType, title, status | Structured content metadata |
| CareerDocumentVersion | id, documentId, versionNumber, snapshot | Immutable version |

### Data model rules

- Every entity is tenant/user scoped; derive owner identity from the authenticated principal, never request body.
- Use foreign keys and indexes for owner, parent and lifecycle fields.
- Version snapshots contain structured content and references, never exported PDF/DOCX bytes.
- Public portfolio queries must use a minimized projection and never return the canonical profile object.
- Public share tokens are high entropy, hashed at rest, scoped, revocable and expiry-bound.
- Contact channels, credential references, salary history and reviewer notes are sensitive data; encrypt where appropriate and exclude from analytics/logs.
- CompensationInsight requires source, observedAt, geography, currency and expiry; stale/unsupported data is not displayed as current.
- Define retention and account deletion behavior before implementation.

## 7. API additions

All endpoints are additive under `/api/v1`; all require authentication except deliberately public, minimized portfolio routes and explicitly scoped share access.

### Cover letters
| Method | Endpoint | Purpose |
|---|---|---|
| GET | /cover-letters | List user's cover letters |
| POST | /cover-letters | Create structured cover letter |
| GET | /cover-letters/:id | Get authorized draft |
| POST | /cover-letters/:id/versions | Create immutable version |
| POST | /cover-letters/:id/suggestions | Generate evidence-grounded suggestions |
| POST | /cover-letters/:id/export/pdf | Stream PDF for local save |
| POST | /cover-letters/:id/export/docx | Stream DOCX for local save |

### Portfolio
| Method | Endpoint | Purpose |
|---|---|---|
| GET | /portfolios | List user's portfolios |
| POST | /portfolios | Create portfolio configuration |
| PATCH | /portfolios/:id | Update selected fields and visibility |
| POST | /portfolios/:id/preview | Render private preview |
| POST | /portfolios/:id/publish | Publish an explicit snapshot |
| POST | /portfolios/:id/revoke | Unpublish/revoke public access |
| POST | /portfolios/:id/shares | Create scoped expiring share |
| DELETE | /portfolios/:id/shares/:shareId | Revoke share |
| GET | /public/portfolios/:slug | Public minimized projection only |

### Import and provenance
| Method | Endpoint | Purpose |
|---|---|---|
| POST | /career-imports | Start bounded transient import |
| GET | /career-imports/:id | Get extraction/validation result |
| POST | /career-imports/:id/confirm | Confirm selected field mappings |
| POST | /career-imports/:id/merge-preview | Preview duplicate/conflict resolution |
| DELETE | /career-imports/:id | Delete import job and temporary artifacts |

### Career paths and compensation
| Method | Endpoint | Purpose |
|---|---|---|
| POST | /career-paths/analyze | Suggest paths from confirmed profile and target |
| GET | /career-paths | List saved plans |
| POST | /career-paths | Save a user-approved plan |
| PATCH | /career-paths/:id/milestones/:milestoneId | Update milestone |
| GET | /compensation-insights | Retrieve sourced ranges by role/geography |

### Job capture and contact activity
| Method | Endpoint | Purpose |
|---|---|---|
| POST | /clipped-jobs | Save user-confirmed normalized job payload |
| GET | /clipped-jobs | List user's captured jobs |
| DELETE | /clipped-jobs/:id | Delete captured job |
| GET | /contacts | List user's contacts |
| POST | /contacts | Create contact |
| PATCH | /contacts/:id | Update contact |
| DELETE | /contacts/:id | Delete contact |
| POST | /job-activities | Record user activity |
| GET | /job-activities | List activity timeline |
| GET | /analytics/job-search | Get scoped job-search aggregates |

### Autofill and external agents
- Do not expose a server endpoint that returns an unrestricted full career profile to a browser extension.
- Use short-lived, user-scoped authorization and a minimal field-selection endpoint.
- Require explicit user action for every autofill session; no auto-submit endpoint.
- If an MCP-compatible interface is introduced, expose read-only and narrowly scoped operations first. Mutations require user confirmation, scoped consent and audit events.

### Expert review and career documents
| Method | Endpoint | Purpose |
|---|---|---|
| POST | /expert-reviews | Request review of an exact resume version |
| GET | /expert-reviews/:id | Get review status and findings |
| POST | /expert-reviews/:id/revoke | Revoke reviewer access |
| GET | /career-documents | List document metadata |
| POST | /career-documents | Create structured document |
| POST | /career-documents/:id/versions | Create immutable version |
| POST | /career-documents/:id/export/:format | Stream export |

## 8. Integration and deployment boundaries

- All new modules live inside the independent Resume platform repository and deployment boundary from document 39.
- Angular frontend feature areas are lazy-loaded and independently testable; browser extension is a separate client package.
- NestJS starts as a modular monolith. New modules communicate through domain interfaces/events, not direct cross-module table access.
- Add worker processing only for import, portfolio rendering, analytics aggregation or other measured asynchronous workloads.
- X Cron remains authoritative for its job listings, employer data and application stages. Resume platform stores only authorized references and minimal snapshots.
- Other host portals integrate through versioned APIs and the SDK, never shared database access.
- Use transactional outbox for cross-platform events; webhooks contain IDs/status metadata, not resume content or PII.
- Keep public portfolio rendering isolated from authenticated user APIs; apply CSP, rate limits, anti-enumeration, abuse reporting and revocation.
- Browser extension uses least-privilege permissions, explicit user gesture and a published privacy policy.
- Optional email/calendar integrations require separate consent and provider scopes; no dependency on them for core operation.

## 9. Security, privacy and abuse controls

1. Treat career profile, resume facts, contacts, credentials, salary and reviewer notes as sensitive personal data.
2. Apply tenant isolation, object-level authorization and audit logging to every new route.
3. Public portfolio defaults to private; public fields are an explicit allowlist, not a denylist.
4. Strip hidden fields from server responses, metadata, structured data, page source and public APIs.
5. Use high-entropy hashed share tokens, expiry, revocation, rate limits and access logs.
6. Prevent SSRF in URL capture/import; block private IP ranges, unsafe redirects and unsupported schemes.
7. Browser extension must not collect tabs/history in the background or read pages without user action.
8. Autofill only visible, user-selected form fields; never submit forms or bypass site controls.
9. Do not store raw credential documents or external profile exports by default.
10. Keep analytics event allowlists; never log document contents, prompts, tokens, contact data or full job descriptions.
11. Add abuse reporting, takedown, impersonation and data-removal processes for public portfolios.
12. Document data retention, user export and deletion for every new entity before release.

## 10. Delivery roadmap

| Release | Deliverables | Exit criteria |
|---|---|---|
| E0 — Contracts and foundations | Extend data/API contracts, ownership matrix, feature flags, privacy review | Schema/API reviewed; no conflict with existing modules 26–39 |
| E1 — Cover letter intelligence | Structured drafts, evidence-linked suggestions, immutable versions, local export | User can create and export a fact-checked cover letter tied to a resume/JD |
| E2 — Portfolio | Private preview, selected-field snapshots, publish/revoke, privacy controls | Public view exposes only explicitly selected data and revocation works |
| E3 — Import and career path | Field-level import review, conflict merge, role paths and milestones | No imported fact is confirmed silently; paths link to profile evidence |
| E4 — Job workflow | Job clipper, contact/activity CRM, job analytics | Explicit capture, host ownership preserved, metrics disclose source coverage |
| E5 — Safe autofill and credentials | Browser assistant, credential references and selective disclosure | No auto-submit; no sensitive field filled without explicit consent |
| E6 — Optional services | Expert review, interview copilot, career document suite | Consent, audit, deletion, cost and safety controls pass release gates |

### Suggested delivery sequence

1. E0 contracts and privacy review.
2. E1 cover letters.
3. E2 portfolio.
4. E3 import and career path.
5. E4 job clipper, CRM and analytics.
6. E5 autofill and credential references.
7. E6 optional commercial/advanced experiences.

Do not delay the core resume MVP to build every expansion. Each release is independently feature-flagged and can be postponed without breaking existing modules.

## 11. Product metrics

Measure product usefulness without collecting resume content:

- Profile onboarding completion and time to first confirmed profile.
- Time from confirmed profile to first exported resume.
- Cover-letter completion/export rate.
- Portfolio publish rate, revocation rate and privacy-setting usage.
- Import field confirmation, correction and conflict rates.
- Job clipper capture success and manual correction rate.
- Autofill field acceptance, correction and abandonment rates.
- Application activity completion and follow-up task completion.
- Interview practice completion and user-rated usefulness.
- AI cost per successful task, unsupported-claim rate and user correction rate.
- Public portfolio abuse reports and takedown response time.

Every metric must define event, numerator, denominator, time window, data source and minimum cohort size. Do not optimize for resume volume or AI token usage as a proxy for candidate outcomes.

## 12. Decisions still requiring product approval

These are intentionally not assumed:
- Whether portfolio hosting is free, paid or limited by plan.
- Whether custom domains are supported.
- Which official external profile/credential providers are integrated.
- Which compensation data provider is licensed and affordable for target markets.
- Whether the browser extension launches in Chrome only or multiple browsers.
- Whether autofill supports a fixed allowlist of job application systems.
- Whether expert review is operated directly or through a marketplace partner.
- Whether interview voice processing is local, provider-hosted or disabled initially.
- Whether any optional cloud sync is ever introduced; local-first remains the default until separately approved.

## 13. Definition of done

- Existing specifications 26–39 remain the source of truth for their current capabilities.
- Every new feature has a feature flag, owner, data lifecycle, API contract, authorization tests and acceptance criteria.
- No duplicate career profile, scoring engine, parser, template engine or application source of truth is introduced.
- All AI-generated factual content is evidence-linked and user-approved.
- All exports follow local-first storage policy.
- Public sharing is private-by-default, minimized, revocable and auditable.
- Browser extension/autofill respects user gesture, site terms and least privilege.
- Metrics are privacy-safe and explainable.
- The standalone Angular microfrontend and NestJS platform remain independently deployable as specified in document 39.
