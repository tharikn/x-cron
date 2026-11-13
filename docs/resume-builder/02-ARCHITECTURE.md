# 02 — Technical Architecture

## 1. Deployment boundary

Implement the Resume & Career Intelligence Service as an independently deployable NestJS application. It may initially run in the same infrastructure as X Cron Jobs, but it must maintain its own domain modules, API contract and database schema boundary.

Do not make the resume service depend directly on X Cron job-search database tables. The host portal should pass a job description or call a documented integration endpoint.

## 2. Logical components

| Component | Responsibility |
|---|---|
| API / Auth adapter | Validate identity, tenant and permissions; support guest-scoped access where permitted |
| Career Profile | Own normalized career facts |
| Resume | Own resume definitions, sections, versions and configuration |
| Parser | Extract text and structured facts from uploaded resumes |
| Role Generator | Convert user notes into reviewable structured suggestions |
| Template Catalog | Publish and serve immutable, versioned design packages |
| Designer / Layout | Validate user overrides and manage semantic alignment configuration |
| Shared Render Model | Normalize content, template version and layout for editor, preview and exports |
| Job Analyzer | Normalize job descriptions, skills and requirements |
| Match Engine | Compare profile/resume against job requirements |
| ATS Engine | Calculate deterministic score and evidence |
| Optimizer | Propose edits based on missing or weak evidence |
| AI Adapter | Abstract LLM and embedding vendors |
| Export Engine | Produce requested output format |
| Local Storage Adapter | Return export bytes/stream for client-side save |
| Analytics | Ingest privacy-safe events and serve aggregate dashboards |
| Integration Adapter | Connect to host job portal and optional Google APIs |

## 3. Suggested NestJS structure

~~~text
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
  designer/
  render-model/
  job-analysis/
  job-matching/
  ats/
  optimizer/
  export/
    pdf/
    html/
    xlsx/
    docx/
  analytics/
    ingestion/
    aggregation/
    dashboards/
  ai/
    interfaces/
    providers/
    prompts/
    policies/
  integrations/
    job-portal/
    google-docs/
  prisma/
~~~

Each module should own its DTOs, application services, domain rules and persistence access. Avoid a single oversized ResumeService.

## 4. Runtime flows

### Build and export

~~~text
Client → Guest workspace or authenticated profile
       → Edit local form state
       → Select versioned template
       → Save confirmed structured data when account-backed
       → Normalize content + layout into render model
       → Preview
       → Request export format
       → Export engine returns file bytes
       → Client saves to device
       → Client emits privacy-safe export/download events
~~~

### Job-aware tailoring

~~~text
Client → Submit job description / portal job ID
       → Job Analyzer normalizes requirements
       → Load selected resume/profile
       → Match Engine + ATS Engine
       → Return score, evidence and gaps
       → Optimizer proposes changes
       → User accepts/rejects
       → Save updated resume configuration/content
~~~

### AI role generation

~~~text
User notes → Input validation → AI extraction
          → Strict JSON schema validation
          → Provenance/confidence tagging
          → User review and correction
          → Explicit confirmation
          → Persist accepted facts
~~~

### Guest-to-account conversion

~~~text
Guest local workspace → User requests cloud save/sync
                      → Sign in / create account
                      → Show import/merge preview
                      → User confirms
                      → Persist selected workspace to account
~~~

## 5. Integration with X Cron

The job portal owns job discovery, job details and application workflow. The resume service owns career data, resume content and analysis.

Integration options:
- Preferred: X Cron backend calls the resume service using service-to-service authentication.
- Client may call the resume service directly only when its token and authorization model explicitly permit it.
- Send a normalized job payload or stable external job reference plus authorized data retrieval. Do not couple the resume service to portal tables.
- Include tenant/user context in every request and enforce ownership in the service.
- Guest workflows must not gain access to account-owned portal data.

## 6. API and versioning

- Prefix public APIs with /api/v1.
- Use DTO validation and explicit response schemas.
- Use idempotency keys for expensive generation/export requests where appropriate.
- Return correlation/request IDs.
- Keep breaking changes behind a new API version.
- Use pagination for lists and bounded payload sizes for text/file input.
- Protect admin analytics endpoints with explicit analytics/admin permissions.

## 7. Persistence

Use PostgreSQL via Prisma. Start with one service-owned schema/database. Keep migrations owned by this service. Avoid cross-service writes.

Store structured career facts, resume metadata, immutable template versions, validated design overrides and privacy-safe analytics events/aggregates. Store temporary processing artifacts only when required, with short TTL and explicit cleanup.

## 8. Asynchronous processing

Keep ordinary CRUD and small exports synchronous. Use a queue only when measured latency or resource consumption justifies it, such as large resume parsing, batch analysis, scheduled analytics aggregation or expensive AI tasks. Queue jobs must be retry-safe, observable and time-limited.

## 9. Failure isolation

- AI provider failure must not block manual editing or deterministic export.
- Export failure must not lose unsaved client edits.
- Parser failure should return a useful error and allow manual entry.
- Job portal outage should not block profile/resume editing.
- Google integration failure should not block DOCX export.
- Analytics ingestion failure must not block core resume editing/export.
- Login cancellation must return the visitor to the preserved guest workspace.

## 10. Architecture constraints

- No generated file retention by default.
- No direct execution of AI-produced HTML, JavaScript or SQL.
- No AI-generated facts persisted as confirmed without user approval.
- No arbitrary client-supplied template code.
- No cross-tenant data access.
- Guest identifiers are not authentication credentials.
- No analytics event may contain resume text, contact details, job description content or exported file bytes.
- Preview and export must use the same normalized render model and template version.
- All external providers must sit behind adapters.

## 11. Detailed architecture references

- Guest-first access, template packages, designer alignment, dashboards, preview fidelity and Google Docs: [16-DASHBOARD-TEMPLATE-DESIGNER-AUTH.md](./16-DASHBOARD-TEMPLATE-DESIGNER-AUTH.md)
- Resume domain and persistence: [04-RESUME-DATA-MODEL.md](./04-RESUME-DATA-MODEL.md)
- API contracts: [05-API-DESIGN.md](./05-API-DESIGN.md)
- Export and local file lifecycle: [08-EXPORT-ENGINE.md](./08-EXPORT-ENGINE.md) and [09-LOCAL-STORAGE.md](./09-LOCAL-STORAGE.md)
