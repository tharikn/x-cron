# Resume Builder — Documentation Index

This folder defines the architecture and implementation plan for the reusable Resume & Career Intelligence Service used by X Cron Jobs.

## Product direction

Build a **job-aware Resume Builder** as an independently deployable NestJS service. It should be reusable by other applications through versioned APIs and should not depend on X Cron's job-search UI.

The service manages structured career information, builds tailored resumes, analyzes job descriptions, calculates explainable ATS compatibility scores, and exports documents. It stores structured data and configuration—not every generated document.

## Technology baseline

| Area | Technology |
|---|---|
| Mobile app | Ionic + Angular + Capacitor |
| Web app | Angular |
| Backend | NestJS |
| Database | PostgreSQL |
| ORM | Prisma |
| File generation | Server-side or client-side export adapters, selected per format |
| AI | Provider-agnostic LLM and embedding adapters |
| Device storage | Capacitor Filesystem on mobile; browser download/IndexedDB where appropriate |

## Architecture decisions

1. Structured career profile is the source of truth.
2. Resume versions store references and configuration/snapshots needed to reproduce a version; they do not require storing every exported file.
3. Generated PDF, HTML, XLSX and DOCX files are saved to the user's device by default.
4. Direct Google Docs creation is an optional integration requiring explicit Google authorization. DOCX export is the baseline interoperability path.
5. ATS scores are calculated by a deterministic, explainable scoring engine. AI provides extraction and recommendations, not arbitrary scores.
6. AI must never invent employment history, dates, skills, education, certifications, projects or quantified achievements.
7. Manual resume editing and export must remain usable when AI services are unavailable.
8. Keep the service provider-independent, tenant-aware, secure and cost-conscious.

## Documents / tabs

| File | Tab / subject |
|---|---|
| [01-HLD.md](./01-HLD.md) | Product scope and high-level design |
| [02-ARCHITECTURE.md](./02-ARCHITECTURE.md) | Components, boundaries and runtime flows |
| [03-FUNCTIONAL-MODULES.md](./03-FUNCTIONAL-MODULES.md) | Feature modules and responsibilities |
| [04-RESUME-DATA-MODEL.md](./04-RESUME-DATA-MODEL.md) | Domain model and persistence |
| [05-API-DESIGN.md](./05-API-DESIGN.md) | API contracts and examples |
| [06-AI-ARCHITECTURE.md](./06-AI-ARCHITECTURE.md) | AI use cases, provider abstraction and guardrails |
| [07-ATS-ENGINE.md](./07-ATS-ENGINE.md) | ATS scoring and explainability |
| [08-EXPORT-ENGINE.md](./08-EXPORT-ENGINE.md) | PDF, HTML, XLSX, DOCX and Google Docs |
| [09-LOCAL-STORAGE.md](./09-LOCAL-STORAGE.md) | Device-first document storage |
| [10-SECURITY-PRIVACY.md](./10-SECURITY-PRIVACY.md) | Security, privacy and data lifecycle |
| [11-MOBILE-ARCHITECTURE.md](./11-MOBILE-ARCHITECTURE.md) | Ionic + Capacitor integration |
| [12-WEB-ARCHITECTURE.md](./12-WEB-ARCHITECTURE.md) | Angular web integration |
| [13-COST-OPTIMIZATION.md](./13-COST-OPTIMIZATION.md) | Low-budget operating model |
| [14-PERFORMANCE-SCALABILITY.md](./14-PERFORMANCE-SCALABILITY.md) | Performance and scaling |
| [15-DEVELOPMENT-PHASES.md](./15-DEVELOPMENT-PHASES.md) | Delivery plan and acceptance criteria |

## How to use these documents

Treat each file as an independent implementation prompt/tab. Read the HLD and architecture first, then implement in phase order. Update the relevant document when a design decision changes. Do not implement every future feature in the MVP.
