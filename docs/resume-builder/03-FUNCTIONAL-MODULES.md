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

## 5. Template and Preview

- Provide a small set of accessible, ATS-friendly templates first.
- Use structured data and template tokens; never render arbitrary AI HTML.
- Preview should match exported output as closely as practical.
- Support typography, spacing, page margins and section order.
- Version templates so older resume definitions remain reproducible.

## 6. Job Description Analyzer

Extract:
- Job title and seniority (when stated)
- Required and preferred skills
- Responsibilities
- Experience range
- Education/certification requirements
- Location/work mode when present
- Important keywords

Normalize synonyms through a maintainable skill taxonomy. Show extracted requirements so users can correct them.

## 7. Job Matching and ATS

- Compare job requirements with selected resume/profile evidence.
- Distinguish exact, related and missing skills.
- Calculate deterministic weighted score.
- Explain every score component and link recommendations to evidence.
- Never guarantee a result from an external ATS.

## 8. Resume Optimizer

Recommend:
- Missing relevant keywords where evidence exists
- Stronger phrasing
- Clearer impact statements
- Better section ordering
- Content gaps that require user input

All proposed changes are reviewable diffs. Never auto-add unsupported claims.

## 9. Export

Initial formats:
- PDF
- HTML
- XLSX career-data workbook
- DOCX

Google Docs:
- Later optional integration through Google OAuth and Drive/Docs APIs.
- DOCX download remains available without Google authorization.

## 10. Account, privacy and settings

- Respect host identity and tenant context.
- Allow profile export and deletion.
- Configure retention of analysis history.
- Provide clear AI processing disclosure.
- Do not store generated document files by default.

## 11. Module dependencies

Career Profile is the source for Resume Builder. Job Analyzer feeds Match/ATS. Optimizer consumes analysis and returns suggestions. Export consumes a confirmed resume representation. AI is an optional capability used behind the relevant modules, not a dependency of all modules.
