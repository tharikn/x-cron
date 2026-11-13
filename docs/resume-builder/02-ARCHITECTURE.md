# 02 — Technical Architecture

## 1. Deployment boundary
Implement Resume & Career Intelligence as an independently deployable NestJS application with its own modules, API contract and database boundary. Do not depend directly on X Cron job-search tables; accept normalized job payloads or authorized integration calls.

## 2. Mandatory access and document boundary
- Every Resume Builder screen and API requires an authenticated user. No guest mode, anonymous workspace or unauthenticated template editor.
- Validate signed identity tokens and enforce user/tenant ownership on every request.
- Google OAuth is optional for Google Docs only, not the primary login mechanism.
- Individual resume files and generated document binaries remain in a user-controlled local device folder. Never persist them as permanent server files, cloud objects or database blobs.
- Backend may persist approved structured career facts, resume metadata, template/version references, layout configuration and analysis metadata.
- Uploaded source documents are parsed transiently and deleted immediately after parsing. No permanent source-file archive.
- Any unavoidable temporary artifact must be encrypted, access-controlled, short-lived and automatically cleaned up.

## 3. Logical components

| Component | Responsibility |
|---|---|
| API / Auth | Require identity; validate tenant and permissions |
| Career Profile | Normalized career facts |
| Resume | Resume metadata, structured sections and versions |
| Parser | Transient source-file parsing; discard bytes |
| Parsing Test | Independent export parsing, field extraction and diagnostics |
| Role Generator | Reviewable structured suggestions |
| Template Catalog | 50+ immutable, versioned declarative templates |
| Designer / Layout | Validated semantic layout overrides |
| Preview Renderer | Dedicated preview experience |
| Recruiter View | Read-only recruiter-oriented projection |
| Shared Render Model | Normalize content, template and layout |
| Export Engine | Generate bytes/stream without permanent retention |
| Local Storage Adapter | Create/select folder; save/list/rename/share/delete files |
| Job Analyzer / Matcher | Normalize JD requirements and map resume evidence |
| Resume Match Score | Job-specific score, dimension breakdown and evidence report |
| ATS Engine | Deterministic compatibility checks and scoring primitives |
| Resume Review Engine | Quality rules, evidence-linked findings and suggestions |
| AI Adapter | Provider abstraction |
| Analytics | Privacy-safe events and aggregate dashboards |
| Integration Adapter | Authorized job source and optional Google APIs |

## 4. Suggested NestJS structure

~~~text
src/
  common/auth/
  career-profile/
  resumes/
  resume-parser/
  parsing-test/
    adapters/{pdf,docx}/
    extraction/
    comparison/
    diagnostics/
  role-generator/
  templates/
  designer/
  render-model/
  preview/
  recruiter-view/
  job-analysis/
  job-matching/
  resume-match/
    jd-sources/{paste,public-url,official-integrations}/
    requirement-normalizer/
    evidence-mapper/
    scoring/
    reports/
  ats/
  resume-review/
    orchestrator/
    rules/{content,grammar,consistency,structure,readability,links,layout}/
    evidence/
    scoring/
    ai-review/
    recruiter-lens/
    findings/
    suggestions/
  optimizer/
  export/{pdf,html,xlsx,docx}/
  local-storage/
  analytics/{ingestion,aggregation,dashboards}/
  ai/{interfaces,providers,prompts,policies}/
  integrations/{job-portal,google-docs}/
  prisma/
~~~

File bytes belong to the client/device filesystem. A backend parser may use isolated ephemeral processing only; it must never become a cloud file archive.

## 5. Runtime flows

### Authenticated build and export
~~~text
User → X Cron sign-in → Resume Builder
 → Load authorized structured profile/resume data
 → Choose one of 50+ templates
 → Edit → Dedicated Preview
 → Shared render model → Export bytes/stream
 → Client creates/selects local folder
 → Save file → Confirm only after filesystem success
~~~

### Source document import
~~~text
Authenticated client → User selects local source file
 → Secure transient stream for parsing
 → Extract structured suggestions
 → Delete temporary bytes (success or failure)
 → User reviews and confirms facts
 → Persist only approved structured data
~~~

### Resume parsing test
~~~text
Local PDF/DOCX or generated export
 → Format validation → Parser adapter(s)
 → Extracted fields + reading order + layout diagnostics
 → Compare with known structured source when available
 → Parsing Test report
~~~

### Recruiter view
~~~text
Authorized resume version
 → Read-only recruiter projection
 → Optional target-role context / linked quality annotations
 → Recruiter View
~~~

### Job-specific Resume Match Score
~~~text
Paste JD / permitted public URL / official integration
 → Safe retrieval + JD extraction
 → User confirms normalized requirements
 → Select exact resume version
 → Evidence mapping + deterministic matching
 → Optional semantic signal
 → Explainable Resume Match Score + report
~~~

### Resume quality review
~~~text
Authenticated resume/version + optional job analysis
 → Review Orchestrator
 → Deterministic rules + structure/consistency checks + render validation
 → Optional bounded-context AI review
 → Reuse existing Job Analyzer/ATS evidence when job-specific
 → Aggregate evidence-linked findings and separate quality score
 → User accepts/edits/dismisses suggestions
 → Approved changes create a structured resume version
~~~

## 6. Persistence boundary
PostgreSQL stores approved structured career data, resume definitions/snapshots, template versions, layout overrides, ATS/analysis metadata, parsing-test report metadata, match reports, recruiter-view configuration (if any), review report metadata/findings and privacy-safe analytics. It must not store generated PDF/DOCX/HTML/XLSX bytes, permanent uploaded source files, local folder contents, arbitrary local paths or file content in logs/analytics.

Retain raw JD text only according to a disclosed retention policy. Store structured evidence references and minimal excerpts rather than copying full resume text into logs or telemetry. Parsing test reports must not retain uploaded document binaries.

## 7. Failure isolation
- AI failure must not block manual editing/export, deterministic review, parsing diagnostics or deterministic matching.
- Export failure must not lose editor state.
- Filesystem permission failure must show recovery steps and never claim save success.
- Parser failure allows manual entry; temporary bytes are still deleted.
- JD URL retrieval failure must offer paste-in without blocking match analysis.
- Google failure must not block DOCX/local export.
- Analytics failure must not block core workflows.
- Expired login preserves unsaved editor state and returns through authentication safely.
- Review/matching timeout or cancellation returns a clear partial/failed state and cleans up temporary input bytes.

## 8. Constraints
Mandatory authentication; no guest access. No permanent server-side individual document storage. No permanent source uploads. No AI-generated facts persisted without approval. No arbitrary executable template code. No cross-tenant access. No sensitive resume content in analytics. Preview and export use the same normalized render model. Dashboard, preview, storage, templates, parsing test, recruiter view, match score and quality review remain distinct feature boundaries. None of the scores is a hiring guarantee.

## 9. Detailed references
- [16-DASHBOARD-TEMPLATE-DESIGNER-AUTH.md](./16-DASHBOARD-TEMPLATE-DESIGNER-AUTH.md)
- [17-PREVIEW-DESIGN.md](./17-PREVIEW-DESIGN.md)
- [18-LOCAL-STORAGE-DESIGN.md](./18-LOCAL-STORAGE-DESIGN.md)
- [19-PREDEFINED-TEMPLATE-CATALOG.md](./19-PREDEFINED-TEMPLATE-CATALOG.md)
- [20-RESUME-QUALITY-RECRUITER-REVIEW.md](./20-RESUME-QUALITY-RECRUITER-REVIEW.md)
- [21-RESUME-PARSING-TEST.md](./21-RESUME-PARSING-TEST.md)
- [22-RECRUITER-VIEW.md](./22-RECRUITER-VIEW.md)
- [23-RESUME-MATCH-SCORE.md](./23-RESUME-MATCH-SCORE.md)
- [04-RESUME-DATA-MODEL.md](./04-RESUME-DATA-MODEL.md)
- [05-API-DESIGN.md](./05-API-DESIGN.md)