# 40 — Competitor Gap Analysis and Product Expansion Index

**Status:** Product-level overview and navigation index  
**Last reviewed:** 2026-11-13  
**Repository target:** `tharikn/x-cron-resume` (independent platform; repository creation is a separate action)

## 1. Product strategy

The Resume & Career Intelligence platform should not compete as another AI resume text generator. Its position is an **evidence-grounded career platform**: one user-controlled career record powers role-specific resumes, job workflows, career development and interview preparation.

**Product promise:** One verified career profile. Many job-specific applications. Measurable career progress.

Existing specifications 26–39 define the core foundation. The competitor-informed additions are deliberately split into individual feature specifications numbered 41–52. This file is an index and cross-feature decision record; it is not the detailed design for those features.

## 2. Competitor landscape — public feature signals

This is a public-feature review, not a hands-on product audit. Feature availability, geography, plan limits and terms change; validate before treating any competitor feature as a committed requirement.

| Product | Publicly documented strengths | Opportunity |
|---|---|---|
| Teal | Job-search companion/browser extension, job saving and tracking, resume versions and job-search workflows. | Add user-controlled capture while preserving evidence-backed career facts and exact resume-version history. |
| Kickresume | Resume/cover-letter templates, AI writing, LinkedIn/PDF import, personal websites, mobile apps and career-map positioning. | Add controlled imports, portfolio publishing and evidence-linked career guidance. |
| Huntr | Job tracker, browser extension/job capture, autofill, contacts, activities, documents and job-search workflow tools. | Add safe capture, contact CRM and follow-up analytics without duplicating the host portal's application source of truth. |
| Jobscan | ATS-oriented resume optimization and profile optimization. | Keep parser compatibility and resume quality explainable; do not claim access to or predict proprietary ATS ranking. |
| Rezi | AI resume tailoring and an MCP-compatible integration surface. | Offer scoped, consent-based assistant/API operations with evidence checks and user-confirmed mutations. |

### Public reference links
- [Teal Chrome Web Store](https://chromewebstore.google.com/detail/teal-job-search-companion/opafjjlpbiaicbbgifbejoochmmeikep)
- [Kickresume pricing and features](https://www.kickresume.com/en/pricing/)
- [Kickresume Help Center](https://www.kickresume.com/en/help-center/general/)
- [Huntr job tracker](https://help.huntr.co/en/articles/9883324-job-tracker)
- [Huntr browser extension](https://help.huntr.co/en/articles/9859408-the-huntr-chrome-extension)
- [Huntr contacts and documents](https://help.huntr.co/en/articles/10089169-contacts-and-documents)
- [Jobscan](https://www.jobscan.co/)
- [Rezi Resume MCP](https://www.rezi.ai/resume-mcp)

## 3. Existing capability foundation

Specifications 26–38 already define the canonical career profile, evidence provenance, immutable resume versions, JD intelligence, parser laboratory, quality regression, job portal integration, application resume vault, career readiness, interview preparation, recruiter sharing, SDK/webhooks and AI governance. Document 39 defines the independent platform architecture.

Do not create a second career profile, parser, scoring engine, resume editor, application tracker or AI provider abstraction. New capabilities must reuse the existing modules through domain interfaces and versioned APIs.

## 4. Standalone feature specifications

Each capability below has its own design document. Implement and review each independently; do not merge the specifications back into this overview.

| ID | Capability | Priority | Standalone design |
|---|---|---:|---|
| 41 | Career Portfolio Website | P0 | [41-CAREER-PORTFOLIO-WEBSITE.md](./41-CAREER-PORTFOLIO-WEBSITE.md) |
| 42 | Cover Letter Intelligence | P0 | [42-COVER-LETTER-INTELLIGENCE.md](./42-COVER-LETTER-INTELLIGENCE.md) |
| 43 | External Profile and Career Data Import | P0 | [43-EXTERNAL-PROFILE-AND-CAREER-DATA-IMPORT.md](./43-EXTERNAL-PROFILE-AND-CAREER-DATA-IMPORT.md) |
| 44 | Career Path and Compensation Intelligence | P0* | [44-CAREER-PATH-AND-COMPENSATION-INTELLIGENCE.md](./44-CAREER-PATH-AND-COMPENSATION-INTELLIGENCE.md) |
| 45 | Job Clipper and Browser Extension | P1 | [45-JOB-CLIPPER-AND-BROWSER-EXTENSION.md](./45-JOB-CLIPPER-AND-BROWSER-EXTENSION.md) |
| 46 | Application CRM and Contact Network | P1 | [46-APPLICATION-CRM-AND-CONTACT-NETWORK.md](./46-APPLICATION-CRM-AND-CONTACT-NETWORK.md) |
| 47 | Application Autofill Assistant | P1 | [47-APPLICATION-AUTOFILL-ASSISTANT.md](./47-APPLICATION-AUTOFILL-ASSISTANT.md) |
| 48 | Job Search Analytics | P1 | [48-JOB-SEARCH-ANALYTICS.md](./48-JOB-SEARCH-ANALYTICS.md) |
| 49 | Credential and Evidence Wallet | P1 | [49-CREDENTIAL-AND-EVIDENCE-WALLET.md](./49-CREDENTIAL-AND-EVIDENCE-WALLET.md) |
| 50 | Human Expert Review Marketplace | P2 | [50-HUMAN-EXPERT-REVIEW-MARKETPLACE.md](./50-HUMAN-EXPERT-REVIEW-MARKETPLACE.md) |
| 51 | Interview Copilot | P2 | [51-INTERVIEW-COPILOT.md](./51-INTERVIEW-COPILOT.md) |
| 52 | Career Document Suite | P2 | [52-CAREER-DOCUMENT-SUITE.md](./52-CAREER-DOCUMENT-SUITE.md) |

*Career path guidance can launch before compensation data. Numeric compensation insights are blocked until a reliable, licensed source with geography, currency, freshness and provenance is approved.

## 5. Cross-feature architecture rules

1. All twelve features live inside the independent Resume platform defined in document 39; feature modules remain separately testable and feature-flagged.
2. Angular feature areas are lazy-loaded. Browser extensions and public portfolio rendering are separate client/runtime surfaces.
3. NestJS starts as a modular monolith. Extract microservices only for demonstrated scaling, security isolation or release-cadence needs.
4. PostgreSQL is owned by the Resume platform. X Cron and other host portals must never share or directly query its tables.
5. X Cron remains authoritative for its job listings, employers and application stages. Resume platform stores only authorized references and minimal snapshots.
6. Local-first document storage remains the default. Do not permanently store resume, cover-letter, credential or exported document binaries.
7. Use versioned APIs, OpenAPI, SDKs, scoped identity handoff and signed minimal webhooks. Never place tokens in URLs.
8. Every AI-generated factual statement must be evidence-linked, labeled when unverified and approved by the user.
9. Imports remain unconfirmed until reviewed. No unauthorized scraping or access-control bypass.
10. Public sharing is private by default, based on explicit allowlists, minimized, revocable and auditable.
11. Browser capture/autofill requires explicit user action. No background surveillance, automatic application submission, CAPTCHA/MFA bypass or covert live-interview assistance.
12. Compensation data requires a trustworthy source. Never fabricate salary ranges or imply causal hiring outcomes from correlation.

## 6. Recommended delivery order

| Release | Feature scope | Exit gate |
|---|---|---|
| E0 | Contracts, ownership matrix, privacy/threat review and feature flags | No conflict with documents 26–39; API/data contracts reviewed |
| E1 | Cover Letter Intelligence (42) | Evidence-linked draft, immutable version and local export |
| E2 | Career Portfolio Website (41) | Private preview, explicit field selection, publish and verified revocation |
| E3 | External Import (43) and Career Path (44) | Field-level confirmation, conflict resolution and evidence-linked role guidance |
| E4 | Job Clipper (45), CRM (46) and Analytics (48) | Explicit capture, host ownership preserved and metrics explain source coverage |
| E5 | Autofill (47) and Credential Wallet (49) | No auto-submit; sensitive data excluded by default; disclosure is controlled |
| E6 | Expert Review (50), Interview Copilot (51) and Career Documents (52) | Consent, audit, deletion, operating cost and safety controls pass release gates |

Do not delay the core resume MVP to build every expansion. Each feature is independently feature-flagged and may be postponed without breaking core resume workflows.

## 7. Product metrics

Track onboarding completion, time to first exported resume, cover-letter completion, portfolio publish/revoke rates, import correction/conflict rates, job capture success, autofill correction rates, follow-up completion, interview practice usefulness, AI cost per successful task and privacy/abuse incidents.

Every metric must define its numerator, denominator, time window, source and minimum cohort size. Avoid collecting resume contents and avoid treating resume volume or AI token usage as candidate success.

## 8. Decisions requiring explicit approval

- Portfolio hosting limits, pricing and custom domains.
- External profile and credential providers and their permitted scopes.
- Compensation-data provider, licensing, geography and refresh cadence.
- Browser support and the initial extension site-adapter allowlist.
- Whether autofill is commercially viable under supported site terms.
- Expert-review operations, reviewer vetting, payment/refund and dispute model.
- Voice provider, processing location and retention policy for interview practice.
- Any future cloud sync; local-first remains the default until separately approved.

## 9. Completion rule

The detailed design for each capability belongs only in its linked standalone file. Update this index when a feature specification changes; do not paste the full feature design into this document.
