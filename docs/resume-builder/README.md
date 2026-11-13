# Resume Builder — Documentation Index

This folder defines the architecture and implementation plan for the reusable Resume & Career Intelligence Service used by X Cron Jobs.

## Product direction

Build a job-aware, independently deployable NestJS service. **Authentication is mandatory** before any Resume Builder access; there is no guest or anonymous mode.

**Individual resume documents stay on the user's device.** Generated PDF, DOCX, HTML and XLSX files and uploaded source document files must not be permanently stored on the application server, cloud object storage or database blobs. PostgreSQL may store approved structured career data, resume metadata/configuration, template references, analysis metadata and privacy-safe analytics, but not individual document files.

Dashboard, preview, local storage, template catalogue, parsing test, recruiter view, match score and resume quality analysis are separate features and routes.

## Technology baseline

| Area | Technology |
|---|---|
| Mobile | Ionic + Angular + Capacitor |
| Web | Angular |
| Backend | NestJS |
| Database | PostgreSQL + Prisma |
| Local files | Capacitor Filesystem / Android Storage Access Framework; browser File System Access API or download fallback |
| Export | Client-side or streamed renderer; no permanent server retention |
| AI | Provider-agnostic LLM and embedding adapters |

## Architecture decisions

1. Login is required for every Resume Builder route and API. Use X Cron identity; Google OAuth is optional only for Google Docs.
2. Individual document files are stored in a user-selected/created local device folder only.
3. Backend persistence is limited to approved structured career/resume data and required metadata; never store document binaries or permanent uploaded source files.
4. Local storage has its own folder/file lifecycle design.
5. Dashboard, preview, storage, template catalogue, parsing test, recruiter view, match score and quality review have independent designs and routes.
6. Launch catalogue must contain at least 50 advanced, production-ready predefined templates.
7. Templates are immutable, versioned declarative design packages.
8. ATS and Resume Match scoring are deterministic and explainable; AI only assists with extraction and recommendations.
9. AI must never invent employment history, dates, skills, education or achievements.
10. Manual editing/export must work when AI is unavailable.
11. Resume quality review uses a separate explainable quality score; it must not be presented as an actual ATS vendor score or hiring guarantee.
12. Parsing Test Score, Resume Quality Score and Resume Match Score are distinct metrics with different purposes.
13. JD URL retrieval must respect source terms and access controls; paste-in JD is the reliable fallback.
14. All analyser experiences follow the shared accessible, responsive UI architecture; feature routes, reports and scores remain independent.
15. Web, mobile web and Android share design tokens and domain behavior but use platform-appropriate layouts, navigation and native integrations.
16. Android safe areas, system bars, keyboard, back navigation, text scaling and native file handling are mandatory design and QA concerns.

## Extended Career Intelligence Capabilities

The new product capabilities are consolidated inside the existing functional-modules document. They are not separate files, so the folder intentionally remains at 25 numbered documents.

See [03-FUNCTIONAL-MODULES.md — Section 18: Extended Career Intelligence Capabilities](./03-FUNCTIONAL-MODULES.md#18-extended-career-intelligence-capabilities) for these 13 capabilities:

1. Career Intelligence Profile and Achievement Bank
2. Resume Truth Verification and Evidence Provenance
3. Multi-Resume and Immutable Version Management
4. Job Description Intelligence and Evidence-Based Matching
5. Multi-Parser Compatibility Laboratory
6. Resume Quality, Export Readiness and Regression Testing
7. Job Portal and Application Intelligence Integration
8. Application Resume Vault
9. Career Readiness and Skill Gap Guidance
10. Resume-Grounded Interview Preparation
11. Consent-Based Recruiter Feedback and Sharing
12. Integration SDK, API and Webhook Platform
13. AI Governance, Evaluation and Cost Control

The same document also contains Section 19 (Cross-Capability Architecture Rules) and Section 20 (Recommended Delivery Order).

## Documents

| File | Subject |
|---|---|
| [01-HLD.md](./01-HLD.md) | Product scope and high-level design |
| [02-ARCHITECTURE.md](./02-ARCHITECTURE.md) | Components, boundaries and runtime flows |
| [03-FUNCTIONAL-MODULES.md](./03-FUNCTIONAL-MODULES.md) | Feature modules |
| [04-RESUME-DATA-MODEL.md](./04-RESUME-DATA-MODEL.md) | Structured data model |
| [05-API-DESIGN.md](./05-API-DESIGN.md) | API contracts and authentication |
| [06-AI-ARCHITECTURE.md](./06-AI-ARCHITECTURE.md) | AI architecture and guardrails |
| [07-ATS-ENGINE.md](./07-ATS-ENGINE.md) | ATS compatibility scoring engine |
| [08-EXPORT-ENGINE.md](./08-EXPORT-ENGINE.md) | Export formats and Google Docs |
| [09-LOCAL-STORAGE.md](./09-LOCAL-STORAGE.md) | Local document storage policy |
| [10-SECURITY-PRIVACY.md](./10-SECURITY-PRIVACY.md) | Security and privacy |
| [11-MOBILE-ARCHITECTURE.md](./11-MOBILE-ARCHITECTURE.md) | Ionic + Capacitor mobile architecture |
| [12-WEB-ARCHITECTURE.md](./12-WEB-ARCHITECTURE.md) | Angular web architecture |
| [13-COST-OPTIMIZATION.md](./13-COST-OPTIMIZATION.md) | Cost optimization |
| [14-PERFORMANCE-SCALABILITY.md](./14-PERFORMANCE-SCALABILITY.md) | Performance |
| [15-DEVELOPMENT-PHASES.md](./15-DEVELOPMENT-PHASES.md) | Delivery phases |
| [16-DASHBOARD-TEMPLATE-DESIGNER-AUTH.md](./16-DASHBOARD-TEMPLATE-DESIGNER-AUTH.md) | User/admin dashboards and analytics |
| [17-PREVIEW-DESIGN.md](./17-PREVIEW-DESIGN.md) | Separate preview experience |
| [18-LOCAL-STORAGE-DESIGN.md](./18-LOCAL-STORAGE-DESIGN.md) | Local folder and file lifecycle |
| [19-PREDEFINED-TEMPLATE-CATALOG.md](./19-PREDEFINED-TEMPLATE-CATALOG.md) | 50+ advanced predefined templates |
| [20-RESUME-QUALITY-RECRUITER-REVIEW.md](./20-RESUME-QUALITY-RECRUITER-REVIEW.md) | Resume quality, recruiter-readiness review and explainable findings |
| [21-RESUME-PARSING-TEST.md](./21-RESUME-PARSING-TEST.md) | Independent PDF/DOCX parsing and extraction validation |
| [22-RECRUITER-VIEW.md](./22-RECRUITER-VIEW.md) | Separate read-only recruiter-oriented resume presentation |
| [23-RESUME-MATCH-SCORE.md](./23-RESUME-MATCH-SCORE.md) | Job-description-to-resume match score and evidence report |
| [24-RESUME-INTELLIGENCE-UI-UX-ARCHITECTURE.md](./24-RESUME-INTELLIGENCE-UI-UX-ARCHITECTURE.md) | Advanced responsive UI/UX, design system and interaction architecture |
| [25-CROSS-PLATFORM-WEB-MOBILE-ANDROID-LAYOUT-ARCHITECTURE.md](./25-CROSS-PLATFORM-WEB-MOBILE-ANDROID-LAYOUT-ARCHITECTURE.md) | Cross-platform alignment, responsive layouts, Android system integration and device QA |

Treat each document as an independent implementation prompt. Do not merge these features into the dashboard or each other.
