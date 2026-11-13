# 03 — Functional Modules

## 1. Career Profile

Purpose: maintain the user's reusable, normalized career history.

Sections:
- Contact and professional links
- Professional headline and summary
- Work experience
- Responsibilities and achievements
- Skills and technologies
- Education
- Projects
- Certifications
- Awards and publications
- Languages
- Custom sections

Rules:
- Validate dates and required fields.
- Separate responsibilities (what the person did) from achievements (outcomes).
- Allow optional fields; do not force users to fabricate missing details.
- Preserve user-entered source text when AI rewrites a description.
- Support user correction, deletion and export.

## 2. Resume Builder

- Create multiple resumes from one career profile.
- Select/reorder/hide sections.
- Choose a template and page settings.
- Edit content without changing the canonical profile unless the user explicitly chooses to sync it.
- Support role-specific versions.
- Preview changes before export.
- Maintain version metadata and reproducible structured snapshots.

## 3. Resume Import / Parser

- Accept supported PDF and DOCX input with strict file size/type limits.
- Extract text and map it to candidate profile fields.
- Return uncertain fields for user review.
- Do not silently overwrite existing profile facts.
- Reject encrypted, malformed or unsupported files with clear messages.
- Delete temporary source files after parsing according to the retention policy.

## 4. Role & Responsibility Generator

Input: free text describing a role, responsibilities, projects or work notes.

Output candidates:
- Job title
- Role summary
- Responsibilities
- Achievements (only if supported by input)
- Skills and technologies
- Project descriptions

Every generated item must include source text or an indication that it is an inference requiring confirmation. Do not generate fake metrics, employer names, dates or credentials.

## 5. Template Catalogue

- Launch with at least 50 production-ready templates (target catalogue: 60).
- Organize templates by career stage, industry, role family and visual style.
- Use structured data and template tokens; never render arbitrary AI HTML.
- Keep templates immutable and versioned so old resume definitions remain reproducible.
- Validate accessibility, ATS readability, preview/export fidelity and responsive behavior.

## 6. Preview

- Provide a dedicated preview route, separate from dashboard and editor concerns.
- Support page-by-page A4/Letter rendering, zoom, pagination and overflow warnings.
- Use the same normalized render model as export.
- Preview must not permanently store document files.

## 7. Job Description Analyzer

Extract:
- Job title and seniority (when stated)
- Required and preferred skills
- Responsibilities
- Experience range
- Education/certification requirements
- Location/work mode when present
- Important keywords

Normalize synonyms through a maintainable skill taxonomy. Show extracted requirements so users can correct them.

## 8. Job Matching and ATS

- Compare job requirements with selected resume/profile evidence.
- Distinguish exact, related and missing skills.
- Calculate deterministic weighted score.
- Explain every score component and link recommendations to evidence.
- Never guarantee a result from an external ATS.

## 9. Resume Optimizer

Recommend:
- Missing relevant keywords where evidence exists
- Stronger phrasing
- Clearer impact statements
- Better section ordering
- Content gaps that require user input

All proposed changes are reviewable diffs. Never auto-add unsupported claims.

## 10. Resume Quality & Recruiter Review

Implement the dedicated review experience and architecture in [20-RESUME-QUALITY-RECRUITER-REVIEW.md](./20-RESUME-QUALITY-RECRUITER-REVIEW.md).

Core capabilities:
- General resume quality review and optional job-specific review.
- Writing, grammar, repetition, clarity, content strength and evidence checks.
- Structure, chronology, consistency, credibility and completeness checks.
- Recruiter scanability and role/seniority-aware observations.
- Export readiness, PDF/DOCX text extraction, reading order, links, clipping and layout checks.
- Evidence-linked findings with severity, confidence, explanation and recommended action.
- Separate Resume Quality Score, Job Match score and Export Readiness.
- Optional AI-assisted feedback using minimum necessary context.
- Accept/edit/dismiss workflow; no silent content changes and no invented facts.
- Versioned rules, scoring configuration, test fixtures and false-positive governance.

The review score is not an actual ATS vendor score or a hiring guarantee. Reuse the existing Job Analyzer/ATS engine for job requirements rather than implementing duplicate keyword scoring.

## 11. Resume Parsing Test

Implement the independent parser validation experience in [21-RESUME-PARSING-TEST.md](./21-RESUME-PARSING-TEST.md).

- Test generated or user-selected local PDF/DOCX files for text extraction, field/section recognition, reading order, dates, links, Unicode and layout integrity.
- Compare extracted content with known structured source data when available.
- Do not fabricate an accuracy score when no ground truth exists.
- Keep uploaded document bytes local or transient; never persist them permanently.
- Show parser/version, limitations, evidence and actionable diagnostics.
- Keep Parsing Test Score separate from Resume Quality and Resume Match scores.

## 12. Recruiter View

Implement the independent read-only presentation experience in [22-RECRUITER-VIEW.md](./22-RECRUITER-VIEW.md).

- Present identity, summary, recent experience, achievements, skills, projects and education in recruiter-friendly order.
- Provide quick-scan and full-content modes.
- Allow toggling to the original formatted preview.
- Optionally display linked quality-review annotations without duplicating the review engine.
- Support contact anonymization.
- Keep private by default; no public sharing link without explicit opt-in.
- Never mutate source resume content or create another score.

## 13. Resume Match Score

Implement the independent job-specific matching experience in [23-RESUME-MATCH-SCORE.md](./23-RESUME-MATCH-SCORE.md).

- Accept pasted job descriptions, permitted public LinkedIn/Naukri/Indeed URLs and authorized integrations where available.
- Extract role, responsibilities, required/preferred skills, experience and qualifications; let the user confirm/correct them.
- Compare against an exact selected resume version and map every match to resume evidence.
- Show a weighted 0–100 Resume Match Score, dimension breakdown, strong/partial/missing evidence and recommended actions.
- Reuse existing Job Analyzer, skill taxonomy and ATS matching primitives; do not create duplicate scoring logic.
- Never bypass login, CAPTCHA, paywalls, anti-bot controls or source terms. Paste-in is the fallback.
- Do not claim selection probability or guarantee ATS success.

## 14. Export

Initial formats:
- PDF
- HTML
- XLSX career-data workbook
- DOCX

Google Docs:
- Later optional integration through Google OAuth and Drive/Docs APIs.
- DOCX download remains available without Google authorization.

## 15. Account, privacy and settings

- Respect host identity and tenant context.
- Allow profile export and deletion.
- Configure retention of analysis and review history.
- Provide clear AI processing disclosure.
- Do not store generated document files by default.
- Keep individual document files on the user's device only.

## 16. Module dependencies

Career Profile is the source for Resume Builder. Job Analyzer feeds Match/ATS and job-specific Review. Resume Match consumes the same normalized JD and evidence services as ATS; it owns the user-facing job-specific report, not duplicate keyword/scoring logic. Parsing Test validates document extraction and is separate from the import parser. Recruiter View is a read-only projection of a resume version. Resume Review consumes structured resume data, render validation and existing ATS evidence. Optimizer consumes analysis and returns suggestions. Export consumes a confirmed resume representation. AI is optional and not a dependency of core deterministic workflows.

## 17. Resume Intelligence UI/UX Architecture

Implement the shared presentation system and feature-specific interaction patterns in [24-RESUME-INTELLIGENCE-UI-UX-ARCHITECTURE.md](./24-RESUME-INTELLIGENCE-UI-UX-ARCHITECTURE.md).

- Keep Resume Analyser, Parsing Test, Recruiter View and Job Match Score as separate routes and reports.
- Use the X Cron black-and-white visual identity with restrained semantic status colors.
- Build reusable accessible Angular components and typed view models; keep scoring/business logic in NestJS.
- Use evidence-linked findings, progressive disclosure, before/after diffs and explicit accept/edit/dismiss/undo actions.
- Show explainable score breakdowns; never present an unexplained score as a hiring prediction.
- Use desktop comparison panels and mobile single-column/tabbed flows.
- Include truthful processing, empty, partial, failure and recovery states.
- Target WCAG 2.2 AA and respect reduced-motion preferences.
- Never send resume/JD content or personal data to analytics.

## 18. Extended Career Intelligence Capabilities

This section defines the product capabilities that differentiate X Cron Resume Builder from a template-and-AI-only resume editor. Each capability is an independently scoped module/use case within the same product and codebase. They are not separate Markdown specifications or independently deployed microservices by default.

### 18.1 Career Intelligence Profile and Achievement Bank

**Goal:** Let candidates enter career information once and reuse approved facts across multiple resumes, job matches and interview preparation.

- Maintain structured work experience, projects, skills, education, certifications, achievements and career preferences.
- Store achievements as context, personal action, skills used, scope and outcome; metrics remain optional and require candidate confirmation.
- Link each fact to its source, creation method, confirmation state and revision history.
- Support partial dates, concurrent roles, career breaks and nontraditional paths without treating gaps as negative.
- Keep a canonical career profile separate from resume-specific content.
- APIs: `/v1/career-profile`, `/v1/career-facts`, `/v1/achievement-drafts`, `/v1/skill-taxonomy`.
- Acceptance: facts are reusable; edits to a resume do not silently change the master profile; user can export, correct and delete profile data.

### 18.2 Resume Truth Verification and Evidence Provenance

**Goal:** Ensure every factual resume claim can be traced to user-provided or user-confirmed evidence.

- Classify claims as user-entered, imported, AI-rewritten or externally verified.
- Track support as direct, partial, ambiguous, absent or contradictory.
- Link bullets, skills, titles, dates, credentials and metrics to source fact IDs.
- Show before/after diffs, evidence and rationale for every AI rewrite.
- Require explicit user approval before factual suggestions are saved.
- Never invent numbers, leadership, skills, dates, credentials, employers or outcomes.
- Acceptance: unsupported factual expansions cannot be silently saved; externally verified is used only with a trusted verification provider and consent.

### 18.3 Multi-Resume and Immutable Version Management

**Goal:** Build multiple role-specific resumes from one profile and preserve exactly what was submitted.

- Support master, role-specific and company/job-specific resume variants.
- Store immutable resume snapshots with content, template version, layout configuration and source profile version.
- Compare versions at section, bullet, skill, evidence, date and design levels.
- Restore a historical version by creating a new version; never mutate history.
- Bind each job application to the exact resume and cover-letter version submitted.
- Use optimistic concurrency for editing and autosave drafts.
- Acceptance: historical versions remain reproducible and a later edit never changes an already submitted resume.

### 18.4 Job Description Intelligence and Evidence-Based Matching

**Goal:** Explain how a selected resume aligns with a specific job, rather than showing an opaque AI score.

- Normalize a job description into required/preferred skills, responsibilities, experience, qualifications and location/work mode.
- Let users confirm extracted requirements.
- Map each requirement to evidence in the exact selected resume version.
- Distinguish strong evidence, partial evidence, related skill and no recorded evidence.
- Keep exact keyword matching, taxonomy synonyms and semantic similarity as separate explainable signals.
- Version scoring rules and show dimension weights, coverage and limitations.
- Acceptance: every match result is reproducible and evidence-linked; no score is represented as a hiring probability or guaranteed ATS result.

### 18.5 Multi-Parser Compatibility Laboratory

**Goal:** Validate whether PDF and DOCX exports preserve readable content and structure across independent parser implementations.

- Build a parser-adapter interface with parser name, version, capabilities and normalized output.
- Test text extraction, reading order, section detection, dates, contact fields, skills, hyperlinks, Unicode and page boundaries.
- Compare parsed fields against structured source data when available.
- Report parser-specific warnings and disagreements; do not claim to emulate proprietary ATS ranking systems.
- Show diagnostics and coverage instead of fabricating an accuracy percentage when no ground truth exists.
- Process files locally where practical; otherwise use isolated, ephemeral workers with strict limits and guaranteed cleanup.
- Acceptance: each result identifies parser/version and test suite; no raw file is permanently stored.

### 18.6 Resume Quality, Export Readiness and Regression Testing

**Goal:** Prevent a resume improvement from accidentally damaging factual accuracy, readability or parsing compatibility.

- Keep Resume Quality, Job Match and Parsing Compatibility as distinct reports.
- Check grammar, clarity, repetition, evidence strength, chronology, consistency, section completeness and recruiter scanability.
- Validate PDF/DOCX text extraction, reading order, hyperlinks, clipping, overflow and page layout.
- Run regression checks when content, template, renderer or scoring rules change.
- Compare against the previous version and explain material gains, regressions and engine-version changes.
- Maintain synthetic fixtures across templates, page lengths, languages and role families.
- Acceptance: critical factual/export failures are surfaced before export; warnings remain explainable and do not become arbitrary blocking scores.

### 18.7 Job Portal and Application Intelligence Integration

**Goal:** Connect job discovery to tailored resumes while keeping this resume capability reusable outside X Cron.

- Integrate through versioned APIs and normalized job-context contracts, not direct access to job portal database tables.
- Flow: open job -> analyze requirements -> select resume -> map evidence -> propose tailoring -> review diff -> create version -> export/apply.
- Keep job/application lifecycle owned by the host job portal.
- Record the exact resume version used for each application.
- Support paste-in job descriptions as the reliable fallback; URL ingestion is best-effort and must respect source access controls.
- Do not automate applications or bypass CAPTCHA, authentication or platform terms in the initial scope.
- Acceptance: Resume Builder works without X Cron-specific schema dependencies and all candidate data access requires user authorization.

### 18.8 Application Resume Vault

**Goal:** Give candidates a reliable history of what they sent to each employer and when.

- Maintain a private application-to-resume mapping with external job ID, employer label, application date, resumeVersionId and optional coverLetterVersionId.
- Store a snapshot reference, not a mutable link to the current resume.
- Allow candidate notes, interview stages and follow-up reminders where the host portal owns the application workflow.
- Show which resume version was shared or submitted.
- Acceptance: changing a resume later cannot alter the historical application record; the portal remains the source of truth for application status.

### 18.9 Career Readiness and Skill Gap Guidance

**Goal:** Help users plan career development from evidence, not label people as employable or unemployable.

- Compare a chosen target role with confirmed career profile evidence.
- Distinguish demonstrated experience, project evidence, self-reported skill, certification and no recorded evidence.
- Phrase gaps as missing recorded evidence, not proof that the candidate lacks a skill.
- Identify transferable skills with links to the source experience.
- Suggest learning goals and practice milestones that users can edit or dismiss.
- Avoid a single opaque employability score and never predict hiring outcomes.
- Acceptance: every strength maps to evidence and every learning suggestion is clearly labelled as a recommendation.

### 18.10 Resume-Grounded Interview Preparation

**Goal:** Prepare candidates for interviews using the exact resume version and job context they choose.

- Generate resume walkthrough, job-specific, technical and behavioral practice questions.
- Support STAR answer practice, turn-based mock interviews and answer feedback.
- Ground resume-specific questions in confirmed claims and evidence IDs.
- Separate general knowledge questions from questions about the candidate's claimed experience.
- Assess relevance, structure, clarity, specificity and evidence alignment; avoid accent, appearance, personality or protected-trait judgments.
- Keep sessions private, deletable and text-first; audio/video requires separate consent.
- Acceptance: AI cannot imply the candidate performed undocumented work; provider failure does not block basic practice.

### 18.11 Consent-Based Recruiter Feedback and Sharing

**Goal:** Let candidates share a specific resume version and receive useful feedback without giving recruiters control of their profile.

- Sharing is private by default and requires an explicit candidate action.
- Scope each share to one resume version, recipient, permission set and expiry.
- Allow contact-field visibility controls and immediate revocation.
- Recruiter view is read-only; feedback is structured around clarity, relevance, evidence and presentation.
- Candidate decides whether to accept feedback and create a new resume version.
- Use high-entropy, hashed share tokens, access logs, rate limits and anti-enumeration protections.
- Acceptance: recruiters cannot mutate candidate facts or access other resume versions.

### 18.12 Integration SDK, API and Webhook Platform

**Goal:** Make Resume & Career Intelligence a reusable service for X Cron and future authorized platforms.

- Publish versioned OpenAPI contracts and generate a TypeScript SDK first.
- Support user-scoped clients and trusted backend integrations with delegated user consent.
- Separate application identity from end-user identity; service credentials alone never grant access to personal resumes.
- Publish minimal, versioned events through a transactional outbox.
- Sign webhooks, rotate secrets, reject replayed deliveries, retry safely and support idempotent consumers.
- Enforce tenant isolation, object-level authorization, quotas, audit and deprecation policies.
- Acceptance: a new platform can integrate without direct database access and without weakening user consent.

### 18.13 AI Governance, Evaluation and Cost Control

**Goal:** Use AI only where it adds measurable value, with deterministic fallbacks and verifiable quality.

- Keep CRUD, validation, rendering, export, score arithmetic and exact matching deterministic.
- Use AI selectively for parsing assistance, job-description extraction, semantic mapping, rewriting and interview coaching.
- Route AI through typed provider interfaces and a policy gateway for consent, redaction, quotas, timeouts and provider selection.
- Validate every response against strict schemas and evidence rules; model output is untrusted.
- Maintain synthetic evaluation fixtures for factuality, unsupported metrics, prompt injection, multilingual content and bias.
- Track schema validity, unsupported-claim rate, user correction rate, latency, failure rate and cost per successful task.
- Use caching, debouncing, token/page limits and smaller models where evaluations support them.
- Acceptance: AI can be disabled without breaking resume creation/export; critical factuality tests gate releases; prompts and resume content are not written to ordinary logs.

## 19. Cross-Capability Architecture Rules

1. **Deployment:** Begin as a modular NestJS monolith with explicit domain boundaries. Extract a module into a separately deployed service only when independent scaling, isolation, release cadence or operational ownership justifies it.
2. **Client:** Angular/Ionic clients consume typed APIs. Keep business rules, authorization and scoring on the server; the client owns interaction state and local document export where supported.
3. **Persistence:** PostgreSQL is the transactional source of truth. Use relational columns for ownership, lifecycle, query and relationship fields; use bounded JSON for extensible attributes only. Use migrations and tenant-scoped indexes.
4. **File handling:** Do not persist generated resume binaries by default. Treat uploads as untrusted, process locally or ephemerally, enforce size/page/time limits and clean temporary files on every exit path.
5. **Versioning:** Every report records the exact resume/profile version and engine/rule/template/parser versions used to produce it.
6. **Security:** Enforce tenant and subject ownership in every repository operation. Apply least privilege, object-level authorization, rate limits, audit events and explicit sharing consent.
7. **Privacy:** Do not place resume content, job-description bodies, tokens or contact data in application logs, analytics or webhook payloads.
8. **AI boundary:** AI is an optional provider behind typed interfaces. No model output directly executes code, SQL, HTML or arbitrary URLs, and no generated factual claim bypasses user approval.
9. **Scoring:** Keep Resume Quality, Job Match, Parsing Compatibility and Career Readiness distinct, explainable and versioned. Never market them as an actual ATS decision or hiring prediction.
10. **Resilience:** Manual profile editing, resume creation, preview and export must work when AI, parser workers, webhooks or integrations are unavailable.

## 20. Recommended Delivery Order

| Release | Scope | Exit criteria |
|---|---|---|
| R1 — Core builder | Career profile, achievement bank foundation, editor, versioned templates, preview, PDF/DOCX export | User can create and export multiple resumes without AI |
| R2 — Trust and quality | Provenance, truth checks, import review, quality review, immutable versions | No unsupported AI claims silently saved; history is reproducible |
| R3 — Job intelligence | JD analyzer, explainable match, tailoring proposals, parser lab, regression | Job-specific resume can be validated against evidence and parser diagnostics |
| R4 — Portal workflow | Job portal API integration, application vault, exact submitted-version mapping | X Cron and another test client can integrate through documented APIs |
| R5 — Career growth | Career readiness, skill goals, interview practice, recruiter feedback | User-controlled, evidence-grounded career tools are available |
| R6 — Platform scale | SDK, webhooks, localization, provider governance and optional service extraction | External integrations are secure, versioned and independently operable |

Do not implement all releases in one sprint. Complete the core data contracts, privacy model and versioning foundations before adding AI or external integrations.
