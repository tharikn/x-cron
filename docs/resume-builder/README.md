# Resume Builder — Documentation Index

This folder defines the architecture and implementation plan for the reusable Resume & Career Intelligence Service used by X Cron Jobs.

## Product direction

Build a job-aware, independently deployable NestJS service. **Authentication is mandatory** before any Resume Builder access; there is no guest or anonymous mode.

**Individual resume documents stay on the user's device.** Generated PDF, DOCX, HTML and XLSX files and uploaded source document files must not be permanently stored on the application server, cloud object storage or database blobs. PostgreSQL may store approved structured career data, resume metadata/configuration, template references, analysis metadata and privacy-safe analytics, but not individual document files.

Dashboard, preview, local storage and advanced template catalogue are separate designs and features.

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
5. Dashboard, preview, storage and template catalogue have independent designs and routes.
6. Launch catalogue must contain at least 50 advanced, production-ready predefined templates.
7. Templates are immutable, versioned declarative design packages.
8. ATS scoring is deterministic and explainable; AI only assists with extraction and recommendations.
9. AI must never invent employment history, dates, skills, education or achievements.
10. Manual editing/export must work when AI is unavailable.

## Documents

| File | Subject |
|---|---|
| [01-HLD.md](./01-HLD.md) | Product scope and high-level design |
| [02-ARCHITECTURE.md](./02-ARCHITECTURE.md) | Components, boundaries and runtime flows |
| [03-FUNCTIONAL-MODULES.md](./03-FUNCTIONAL-MODULES.md) | Feature modules |
| [04-RESUME-DATA-MODEL.md](./04-RESUME-DATA-MODEL.md) | Structured data model |
| [05-API-DESIGN.md](./05-API-DESIGN.md) | API contracts and authentication |
| [06-AI-ARCHITECTURE.md](./06-AI-ARCHITECTURE.md) | AI architecture and guardrails |
| [07-ATS-ENGINE.md](./07-ATS-ENGINE.md) | ATS scoring |
| [08-EXPORT-ENGINE.md](./08-EXPORT-ENGINE.md) | Export formats and Google Docs |
| [09-LOCAL-STORAGE.md](./09-LOCAL-STORAGE.md) | Local document storage policy |
| [10-SECURITY-PRIVACY.md](./10-SECURITY-PRIVACY.md) | Security and privacy |
| [11-MOBILE-ARCHITECTURE.md](./11-MOBILE-ARCHITECTURE.md) | Ionic + Capacitor |
| [12-WEB-ARCHITECTURE.md](./12-WEB-ARCHITECTURE.md) | Angular web |
| [13-COST-OPTIMIZATION.md](./13-COST-OPTIMIZATION.md) | Cost optimization |
| [14-PERFORMANCE-SCALABILITY.md](./14-PERFORMANCE-SCALABILITY.md) | Performance |
| [15-DEVELOPMENT-PHASES.md](./15-DEVELOPMENT-PHASES.md) | Delivery phases |
| [16-DASHBOARD-TEMPLATE-DESIGNER-AUTH.md](./16-DASHBOARD-TEMPLATE-DESIGNER-AUTH.md) | User/admin dashboards and analytics |
| [17-PREVIEW-DESIGN.md](./17-PREVIEW-DESIGN.md) | Separate preview experience |
| [18-LOCAL-STORAGE-DESIGN.md](./18-LOCAL-STORAGE-DESIGN.md) | Local folder and file lifecycle |
| [19-PREDEFINED-TEMPLATE-CATALOG.md](./19-PREDEFINED-TEMPLATE-CATALOG.md) | 50+ advanced predefined templates |

Treat each document as an independent implementation prompt. Do not merge preview or local file management into the dashboard.