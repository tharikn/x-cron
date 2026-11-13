# 01 — High-Level Design (HLD)

## 1. Purpose

Build a reusable **Resume & Career Intelligence Service**. It is an independent microservice that can be integrated with X Cron Jobs or another job portal, recruitment platform, career application or HR product.

The service allows a user to maintain a structured career profile, create multiple resumes, tailor a resume to a target job, receive ATS compatibility feedback and export a document.

## 2. Goals

- Create and maintain one reusable career profile.
- Build multiple resumes for different roles or industries from the same profile.
- Create resume content from manually entered details, imported resumes, or user-provided role/responsibility text.
- Analyze job descriptions and compare them with a user's career profile/resume.
- Provide an explainable ATS compatibility score and actionable improvement suggestions.
- Export PDF, HTML, XLSX and DOCX.
- Support optional Google Docs creation through an authorized integration.
- Keep generated documents on the user's device by default to reduce storage cost and improve privacy.
- Expose stable APIs so any authorized client can consume the service.

## 3. Non-goals for the first release

- Building a full recruitment/ATS product for employers.
- Guaranteeing that a resume will pass every third-party ATS.
- Automatically applying to jobs.
- Inventing experience, achievements or qualifications to improve a score.
- Persistently storing every generated export in cloud storage.
- Requiring Google sign-in or Google Drive access.
- Depending on a single AI vendor.

## 4. Users and main journeys

### Job seeker

1. Create or import a career profile.
2. Review and correct extracted information.
3. Choose a template and create a resume.
4. Enter a target job description or select a job from the portal.
5. View match/ATS analysis and recommendations.
6. Accept or reject suggested edits.
7. Preview and export the resume to the device.
8. Optionally create a Google Doc after granting Google access.

### Job-aware journey

`Job Search → Job Details → Analyze My Profile/Resume → Match Report → Tailor Resume → Preview → Export → Apply`

### Role/responsibility text journey

1. User pastes role/responsibility notes.
2. Service extracts possible title, responsibilities, skills, technologies and achievements.
3. Service returns structured suggestions with confidence and source references.
4. User edits and confirms each suggestion.
5. Confirmed data is added to the career profile or selected resume only after user approval.

## 5. Core product modules

- Career Profile
- Resume Builder and Versioning
- Resume Import / Parser
- Role & Responsibility Generator
- Template and Preview Engine
- Job Description Analyzer
- Resume-to-Job Matching
- ATS Scoring Engine
- Resume Optimizer
- Export Engine
- Local Document Storage
- AI Provider Abstraction
- Integration/API layer

See [03-FUNCTIONAL-MODULES.md](./03-FUNCTIONAL-MODULES.md).

## 6. High-level architecture

```text
 Ionic / Angular Mobile App       Angular Web App       Other Client
          |                             |                    |
          +-----------------------------+--------------------+
                                        |
                                API Gateway / Auth
                                        |
                         Resume & Career Intelligence API
                                        |
       +----------------+---------------+----------------+----------------+
       |                |               |                |                |
 Career Profile   Resume Builder   Job Analyzer      ATS Engine       Export
       |                |               |                |                |
       +----------------+---------------+----------------+----------------+
                                        |
                                 AI Abstraction
                                  /          \
                              LLM          Embeddings
                                        |
                                  PostgreSQL
                         (structured data and metadata)

 Generated files: rendered on demand → saved to user's device
 Optional: Google Drive/Docs integration after user authorization
```

## 7. Data ownership and storage

**Backend stores**
- User/tenant ownership and access metadata.
- Structured career profile data.
- Resume definitions, selected sections, template and layout configuration.
- Version metadata and the minimal structured snapshot required to reproduce a resume.
- Job analysis cache and ATS report metadata, subject to retention settings.
- Template definitions and system configuration.

**Backend does not store by default**
- Every generated PDF, HTML, XLSX or DOCX.
- Temporary export files after delivery.
- Copies of documents that the user has saved locally.

The user device is the default owner of exported documents. A future opt-in cloud backup feature must be separate, transparent and consent-based.

## 8. Technology baseline

- Client: Ionic + Angular + Capacitor; Angular web.
- Backend: NestJS with modular boundaries.
- Database: PostgreSQL.
- ORM: Prisma.
- Authentication: integrate with the host application's identity mechanism using signed tokens or a documented identity federation contract.
- AI: provider-neutral adapters for text generation and embeddings.
- Export: format-specific adapters with deterministic templates.

## 9. Design principles

1. **Structured data first:** never treat a PDF as the canonical career profile.
2. **User approval:** AI suggestions are drafts until accepted.
3. **Explainability:** show why a match/ATS score was assigned.
4. **Privacy by default:** do not retain exported files unnecessarily.
5. **Graceful degradation:** manual editing works without AI.
6. **Provider independence:** AI, storage and identity integrations are replaceable.
7. **Modular boundaries:** job portal integration must not leak into core resume domain logic.
8. **Accessible output:** templates should be readable, selectable and ATS-friendly.

## 10. Success criteria

- A user can build and export a resume without AI.
- A user can create multiple role-specific resumes from one profile.
- A job description can produce a reproducible, explainable match report.
- AI-generated content never enters confirmed profile data without user approval.
- Exported documents are saved locally by default and are not retained by the service.
- Core functionality is testable without calling a paid AI provider.
