# 03 — Functional Modules

> **Platform deployment boundary:** These modules belong to the independently deployable Resume platform, not the X Cron application monolith. The Angular microfrontend and NestJS API live in the separate `tharikn/x-cron-resume` repository. X Cron integrates through the documented identity and API contracts; it does not embed these modules or share their database. See [39-INDEPENDENT-RESUME-PLATFORM-ARCHITECTURE.md](./39-INDEPENDENT-RESUME-PLATFORM-ARCHITECTURE.md) before implementation.

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

The following capabilities are maintained as separate implementation specifications. Each is independently scoped while following the shared architecture and delivery rules in Sections 19 and 20.

1. [Career Intelligence Profile and Achievement Bank](./26-CAREER-INTELLIGENCE-PROFILE-AND-ACHIEVEMENT-BANK.md)
2. [Resume Truth Verification and Evidence Provenance](./27-RESUME-TRUTH-VERIFICATION-AND-EVIDENCE-PROVENANCE.md)
3. [Multi-Resume and Immutable Version Management](./28-MULTI-RESUME-AND-IMMUTABLE-VERSION-MANAGEMENT.md)
4. [Job Description Intelligence and Evidence-Based Matching](./29-JOB-DESCRIPTION-INTELLIGENCE-AND-EVIDENCE-BASED-MATCHING.md)
5. [Multi-Parser Compatibility Laboratory](./30-MULTI-PARSER-COMPATIBILITY-LABORATORY.md)
6. [Resume Quality, Export Readiness and Regression Testing](./31-RESUME-QUALITY-EXPORT-READINESS-AND-REGRESSION-TESTING.md)
7. [Job Portal and Application Intelligence Integration](./32-JOB-PORTAL-AND-APPLICATION-INTELLIGENCE-INTEGRATION.md)
8. [Application Resume Vault](./33-APPLICATION-RESUME-VAULT.md)
9. [Career Readiness and Skill Gap Guidance](./34-CAREER-READINESS-AND-SKILL-GAP-GUIDANCE.md)
10. [Resume-Grounded Interview Preparation](./35-RESUME-GROUNDED-INTERVIEW-PREPARATION.md)
11. [Consent-Based Recruiter Feedback and Sharing](./36-CONSENT-BASED-RECRUITER-FEEDBACK-AND-SHARING.md)
12. [Integration SDK, API and Webhook Platform](./37-INTEGRATION-SDK-API-AND-WEBHOOK-PLATFORM.md)
13. [AI Governance, Evaluation and Cost Control](./38-AI-GOVERNANCE-EVALUATION-AND-COST-CONTROL.md)

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


## 21. Competitor-Informed Product Expansion

The following additions extend the existing modules; they must reuse the career profile, evidence, versioning, JD, application, review, export and AI-governance foundations rather than create duplicate engines. Full requirements, data entities, APIs, privacy controls and acceptance criteria are in [40-COMPETITOR-GAP-ANALYSIS-AND-PRODUCT-EXPANSION.md](./40-COMPETITOR-GAP-ANALYSIS-AND-PRODUCT-EXPANSION.md).

| New capability | Reuses existing modules | Boundary / key rule |
|---|---|---|
| Cover Letter Intelligence | 26, 27, 28, 29, 33, 38 | Evidence-linked drafts; immutable versions; bind submitted version to application |
| Career Portfolio Website | 26, 27, 28, 22, 36 | Explicitly selected fields; private by default; publish snapshots and revocation |
| External Profile/Career Import | Resume Import, 26, 27, 38 | Imported facts require user confirmation; official integrations only |
| Career Path and Compensation Intelligence | 29, 34, Skill Taxonomy, 38 | Evidence-linked paths; salary only with dated, sourced data |
| Job Clipper / Browser Extension | 29, 32, 37 | Explicit user action; no background tab surveillance or prohibited scraping |
| Application CRM and Contact Network | 32, 33, 36 | Host portal remains source of truth for its application status |
| Application Autofill Assistant | 26, 27, 37 | User-reviewed field mapping; no auto-submit or access-control bypass |
| Job Search Analytics | 32, 33, Analytics, 38 | Privacy-safe aggregates; define denominators and source coverage |
| Credential and Evidence Wallet | 26, 27, 36 | Metadata/reference-first; verification status must be source-backed |
| Human Expert Review | 20, 28, 36 | Time-limited read-only reviewer access; candidate controls changes |
| Interview Copilot | 35, 27, 38 | Opt-in sessions; no covert assistance or protected-trait assessment |
| Career Document Suite | 26, 27, 28, Export, 38 | Versioned factual content; local-first exports |

**Delivery rule:** These are expansion candidates, not blockers for the Resume Builder MVP. Follow the E0–E6 release sequence in document 40 and gate every capability behind privacy/security review and feature flags.
