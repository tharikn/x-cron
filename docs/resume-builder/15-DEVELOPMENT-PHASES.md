# 15 — Development Phases and Acceptance Criteria

## Phase 0 — Foundation
- Confirm X Cron identity/tenant integration contract.
- Create NestJS service/module skeleton.
- Configure PostgreSQL and Prisma migrations.
- Establish API versioning, validation, logging and CI.
- Define strict local-only document policy and transient upload cleanup.

Exit: authenticated identity is enforced on every builder route/API; no guest routes; no cross-user access; no permanent document file storage.

## Phase 1 — Authenticated Resume Builder MVP
- Career profile CRUD and structured resume management.
- Experience, skills, education, projects and certifications.
- Resume definitions and section ordering.
- Publish at least 50 finished predefined templates (target 60).
- Separate dashboard, editor and dedicated preview routes.
- PDF and HTML export.
- Local folder creation/selection and device-local save.
- Mobile/web client integration.

Exit: signed-in user can create/edit a resume, select a template, preview it and save PDF/HTML into a local folder. Dashboard does not contain the preview or file browser. Backend does not retain generated files.

## Phase 2 — Import and editable formats
- Transient PDF/DOCX parsing with immediate file-byte deletion.
- Review-and-confirm import workflow.
- XLSX structured-data export and DOCX export.
- Import/export security tests.
- Initial Resume Parsing Test for local PDF/DOCX extraction, section recognition and export diagnostics.

Exit: source files are not retained; extracted fields are not silently confirmed; DOCX opens in common word processors; XLSX formula injection is prevented; Parsing Test reports parser limitations and never claims universal ATS compatibility.

## Phase 3 — Job-specific Resume Match Score
- Job description paste-in input and metadata.
- JD extraction, requirement normalization and user confirmation.
- Resume evidence mapping for required/preferred skills, responsibilities, role and experience.
- Deterministic weighted Resume Match Score and evidence report.
- Match history tied to exact resume/JD versions.
- Safe public URL retrieval for LinkedIn, Naukri and Indeed only where permitted and accessible; paste-in fallback.
- Reuse ATS matching primitives and skill taxonomy.

Exit: user can paste a JD and compare it with a selected resume version; each score dimension has evidence; blocked/login-protected URL import falls back to paste; no hiring or ATS vendor guarantee is made.

## Phase 4 — Recruiter View and quality review
- Separate read-only Recruiter View with quick-scan and full-content modes.
- Contact anonymization and optional linked quality annotations.
- Resume Quality & Recruiter Review deterministic rules, findings and score.
- Separate score definitions for quality, parsing and job match.

Exit: Recruiter View cannot mutate source resume; all review findings are evidence-linked; all three scores remain separate and explainable.

## Phase 5 — AI assistance and advanced matching
- Role/responsibility text generator.
- Resume parsing assistance and summary suggestions.
- Achievement/bullet rewriting and resume optimizer.
- Optional semantic matching signal and score calibration.
- Provider abstraction, quotas and evaluation tests.

Exit: AI suggestions require user approval; no unsupported facts are added; manual editing and deterministic matching remain available when AI fails.

## Phase 6 — Optional integrations and maturity
- Google Docs creation with explicit OAuth consent.
- Authorized job-board integrations only when official APIs/partner terms permit.
- Usage analytics with privacy-safe aggregation.
- Template management/localization improvements.
- Operational dashboards and cost controls.

Cloud document backup/sync is excluded from this design. Do not add it without a separate explicit product requirement and approval.

## Recommended implementation order
1. Identity foundation and API authorization.
2. Structured profile/resume model.
3. 50+ predefined templates and template gallery.
4. Editor and dedicated preview renderer.
5. Local folder manager and PDF/HTML export.
6. Import and DOCX/XLSX.
7. Resume Parsing Test.
8. JD paste-in, normalization and deterministic Resume Match Score.
9. Recruiter View and Resume Quality Review.
10. Optional safe public URL import and approved platform integrations.
11. AI capabilities and semantic matching.
12. Analytics and optional Google Docs integration.

## Definition of done
- DTO/domain validation and authorization tests.
- Unit/integration tests and error/empty states.
- Logs contain no PII or document content.
- Local save verified on Android, iOS and web.
- Temporary source files deleted on all paths.
- Retention and cleanup behavior verified.
- Parsing, quality and match scores are separate and versioned.
- JD URL retrieval respects source access controls and includes paste-in fallback.
- Documentation and migrations updated.
