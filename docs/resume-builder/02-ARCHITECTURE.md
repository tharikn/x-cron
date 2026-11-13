# 02 — Technical Architecture

## 1. Deployment boundary

Implement the Resume & Career Intelligence Service as an independently deployable NestJS application. It may initially run in the same infrastructure as X Cron Jobs, but it must maintain its own domain modules, API contract and database schema boundary.

Do not make the resume service depend directly on X Cron job-search database tables. The host portal should pass a job description or call a documented integration endpoint.

## 2. Logical components

| Component | Responsibility |
|---|---|
| API / Auth adapter | Validate identity, tenant and permissions |
| Career Profile | Own normalized career facts |
| Resume | Own resume definitions, sections, versions and configuration |
| Parser | Extract text and structured facts from uploaded resumes |
| Role Generator | Convert user notes into reviewable structured suggestions |
| Template Engine | Render structured data using versioned templates |
| Job Analyzer | Normalize job descriptions, skills and requirements |
| Match Engine | Compare profile/resume against job requirements |
| ATS Engine | Calculate deterministic score and evidence |
| Optimizer | Propose edits based on missing or weak evidence |
| AI Adapter | Abstract LLM and embedding vendors |
| Export Engine | Produce requested output format |
| Local Storage Adapter | Return export bytes/stream for client-side save |
| Integration Adapter | Connect to host job portal and optional Google APIs |

## 3. Suggested NestJS structure

```text
src/
  app.module.ts
  common/
    auth/
    guards/
    decorators/
    dto/
    errors/
    logging/
    validation/
  health/
  career-profile/
  resumes/
  resume-parser/
  role-generator/
  templates/
  job-analysis/
  job-matching/
  ats/
  optimizer/
  export/
    pdf/
    html/
    xlsx/
    docx/
  ai/
    interfaces/
    providers/
    prompts/
    policies/
  integrations/
    job-portal/
    google-docs/
  prisma/
```

Each module should own its DTOs, application services, domain rules and persistence access. Avoid a single oversized ResumeService.

## 4. Runtime flows

### Build and export

```text
Client → GET career profile → Edit local form state
       → Save confirmed structured data → API
       → Select resume sections/template
       → Preview from structured data
       → Request export format
       → Export engine returns file bytes
       → Client saves to device
```

### Job-aware tailoring

```text
Client → Submit job description / portal job ID
       → Job Analyzer normalizes requirements
       → Load selected resume/profile
       → Match Engine + ATS Engine
       → Return score, evidence and gaps
       → Optimizer proposes changes
       → User accepts/rejects
       → Save updated resume configuration/content
```

### AI role generation

```text
User notes → Input validation → AI extraction
          → Strict JSON schema validation
          → Provenance/confidence tagging
          → User review and correction
          → Explicit confirmation
          → Persist accepted facts
```

## 5. Integration with X Cron

The job portal owns job discovery, job details and application workflow. The resume service owns career data, resume content and analysis.

Integration options:
- Preferred: X Cron backend calls the resume service using service-to-service authentication.
- Client may call the resume service directly only when its token and authorization model explicitly permit it.
- Send a normalized job payload or stable external job reference plus authorized data retrieval. Do not couple the resume service to portal tables.
- Include tenant/user context in every request and enforce ownership in the service.

## 6. API and versioning

- Prefix public APIs with `/api/v1`.
- Use DTO validation and explicit response schemas.
- Use idempotency keys for expensive generation/export requests where appropriate.
- Return correlation/request IDs.
- Keep breaking changes behind a new API version.
- Use pagination for lists and bounded payload sizes for text/file input.

## 7. Persistence

Use PostgreSQL via Prisma. Start with one service-owned schema/database. Keep migrations owned by this service. Avoid cross-service writes.

Store structured career facts and resume metadata. Store temporary processing artifacts only when required, with short TTL and explicit cleanup.

## 8. Asynchronous processing

Keep ordinary CRUD and small exports synchronous. Use a queue only when measured latency or resource consumption justifies it, such as large resume parsing, batch analysis or expensive AI tasks. Queue jobs must be retry-safe, observable and time-limited.

## 9. Failure isolation

- AI provider failure must not block manual editing or deterministic export.
- Export failure must not lose unsaved client edits.
- Parser failure should return a useful error and allow manual entry.
- Job portal outage should not block profile/resume editing.
- Google integration failure should not block DOCX export.

## 10. Architecture constraints

- No generated file retention by default.
- No direct execution of AI-produced HTML, JavaScript or SQL.
- No AI-generated facts persisted as confirmed without user approval.
- No arbitrary client-supplied template code.
- No cross-tenant data access.
- All external providers must sit behind adapters.
