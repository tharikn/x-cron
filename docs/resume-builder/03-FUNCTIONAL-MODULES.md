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

## 11. Export

Initial formats:
- PDF
- HTML
- XLSX career-data workbook
- DOCX

Google Docs:
- Later optional integration through Google OAuth and Drive/Docs APIs.
- DOCX download remains available without Google authorization.

## 12. Account, privacy and settings

- Respect host identity and tenant context.
- Allow profile export and deletion.
- Configure retention of analysis and review history.
- Provide clear AI processing disclosure.
- Do not store generated document files by default.
- Keep individual document files on the user's device only.

## 13. Module dependencies

Career Profile is the source for Resume Builder. Job Analyzer feeds Match/ATS and job-specific Review. Resume Review consumes structured resume data, render validation and existing ATS evidence; it does not own a duplicate ATS engine. Optimizer consumes analysis and returns suggestions. Export consumes a confirmed resume representation. AI is an optional capability used behind the relevant modules, not a dependency of all modules.