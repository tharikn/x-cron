# 01 — High-Level Design (HLD)

## 1. Purpose
Build a reusable Resume & Career Intelligence Service as an independent microservice for X Cron Jobs and other authorized job/career platforms. Users authenticate before entering the builder, maintain structured career information, create role-specific resumes, analyze job fit and save generated documents into a local folder on their device.

## 2. Goals
- Require login before any Resume Builder access.
- Maintain one reusable structured career profile.
- Build multiple role-specific resumes from that profile.
- Launch with at least 50 advanced predefined templates.
- Keep dashboard, preview and local storage as separate experiences/designs.
- Analyze job descriptions and provide explainable ATS compatibility feedback.
- Export PDF, HTML, XLSX and DOCX into a user-selected/created local folder.
- Keep individual resume document files exclusively on the user's device.
- Expose stable APIs for authorized clients.

## 3. Non-goals
- Guest or anonymous Resume Builder access.
- Guaranteeing a resume passes every third-party ATS.
- Automatically applying to jobs.
- Inventing experience or qualifications.
- Permanently storing generated exports or uploaded source documents on the server.
- Requiring Google sign-in or Google Drive access.
- Depending on one AI vendor.

## 4. Main user journey
1. User signs in through X Cron identity.
2. User opens Resume Builder.
3. User creates or imports a structured career profile.
4. User chooses one of 50+ predefined templates.
5. User edits content and design.
6. User opens the dedicated Preview experience.
7. User reviews page layout and export fidelity.
8. User exports and saves the file into a local device folder.
9. User may optionally create a Google Doc after granting Google authorization.

## 5. Core modules
Authentication/authorization; Career Profile; Resume Builder/versioning; Resume Import/Parser; Role Generator; Advanced Template Catalog; Designer/Layout; Dedicated Preview Renderer; Job Analyzer; Matching; ATS; Optimizer; Export; Local Folder Storage; User/Admin Dashboards; AI abstraction; Integration API.

## 6. Data ownership and storage
Backend may store user/tenant access metadata, approved structured career profile facts, structured resume data/version snapshots, template/layout references, job analysis and ATS metadata, template definitions and privacy-safe analytics.

Backend must not store generated PDF/HTML/XLSX/DOCX binaries, permanent copies of uploaded source resume files, individual resume document files as server files/object-storage objects, local folder contents or arbitrary local device paths.

User device stores individual resume documents, generated exports and user-selected source files. Temporary server processing of source files must be short-lived and deleted immediately after parsing. Structured profile persistence is distinct from document-file storage and must be transparent to the user.

## 7. Technology baseline
Client: Ionic + Angular + Capacitor and Angular web. Backend: NestJS. Database: PostgreSQL + Prisma. Authentication: X Cron signed identity tokens. AI: provider-neutral adapters. Local files: Capacitor Filesystem / Android Storage Access Framework / iOS document picker and browser File System Access API with download fallback. Export adapters may stream bytes but cannot retain generated files.

## 8. Design principles
Structured data first; mandatory authentication; local-first document privacy; explicit user approval for AI suggestions; explainable scoring; graceful degradation without AI; provider independence; separate dashboard, preview, storage and template catalogue designs; accessible ATS-conscious output.

## 9. Success criteria
- Unauthenticated users cannot open Resume Builder routes or APIs.
- A signed-in user can build/export without AI.
- At least 50 advanced predefined templates are published and validated.
- Preview is a dedicated screen, not part of dashboard design.
- Files are saved to a local device folder and are not permanently retained by the service.
- Uploaded source documents are transient and deleted.
- AI-generated facts are never confirmed without user approval.