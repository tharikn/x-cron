# 16 — Dashboard Design and Usage Analytics

## 1. Scope

This document covers only the authenticated user dashboard, admin/product dashboard and privacy-safe usage analytics.

Separate designs:
- Preview: [17-PREVIEW-DESIGN.md](./17-PREVIEW-DESIGN.md)
- Local files: [18-LOCAL-STORAGE-DESIGN.md](./18-LOCAL-STORAGE-DESIGN.md)
- Template gallery/catalogue: [19-PREDEFINED-TEMPLATE-CATALOG.md](./19-PREDEFINED-TEMPLATE-CATALOG.md)

Login is mandatory before entering Resume Builder. Guest access is not supported.

## 2. Dashboard navigation

~~~text
Sign In → Resume Builder Dashboard
              ├── My Resumes → Editor
              ├── Templates → Separate Template Gallery
              ├── Preview → Separate Preview route
              ├── Local Files → Device Folder Manager
              ├── ATS / Job Matches
              └── Settings

Admin → Admin Analytics Dashboard (separate permission)
~~~

The dashboard is an overview and navigation surface. Do not embed the full preview renderer or local file browser inside it.

## 3. User dashboard

Show only the authenticated user's own resume count, recently edited resume metadata, create/continue actions, recently selected templates, ATS report summaries, export/local-save status and local folder status when available. Provide navigation to template gallery, editor, preview and settings. Do not show document contents in dashboard cards.

## 4. Admin/product dashboard

Restricted to admin/product roles. Show overall usage by date, platform, template and feature; active designers/sessions; export and local-save funnel; template adoption; AI/ATS usage and estimated cost. Remove guest-to-account conversion metrics because guest access is not supported.

## 5. Metrics

| Metric | Definition |
|---|---|
| Resumes created | Authenticated resume creation records |
| Export requests | Export jobs requested |
| Successful exports | Export jobs completed and bytes returned |
| Local saves confirmed | Client event after OS/browser confirms successful write |
| Unique savers | Distinct authenticated users with a confirmed local save |
| Active designers | Unique authenticated users with meaningful editor activity |
| Active sessions | Editor sessions with documented inactivity timeout |
| Preview count | Preview renders/sessions |
| Template usage | Creations/exports by template ID and immutable version |
| AI usage | Requests by feature/provider/status/cost band |
| ATS usage | Reports generated and repeat usage |
| Export format split | Successful PDF/HTML/XLSX/DOCX exports |

A page view alone does not count as active design. Meaningful activity includes editing, section reorder, template change, preview or export.

## 6. Export versus local save

Backend can count export generation and response delivery. Only the client/platform can confirm a local write. Emit a local-save-success event only after filesystem confirmation. If browser APIs cannot confirm the final write, record download initiated. Never equate export generation with local save.

## 7. Analytics events and privacy

Allowlisted fields: event ID/name/time, authenticated user and tenant IDs, session ID, platform, app version, template ID/version, internal resume ID, export format, status and duration.

Events include dashboard opened, designer opened/activity, template selected, preview rendered, export requested/succeeded/failed, local file save succeeded, download initiated, ATS report generated and Google Docs created.

Never include resume text, contact details, job descriptions, AI prompts, file paths, file bytes or document contents.

## 8. Analytics storage

Use NestJS event ingestion, minimal raw PostgreSQL events with documented retention, and daily/hourly aggregates. Suggested tables: UsageEvent, UsageDailyAggregate, UsageTemplateAggregate, UsageExportAggregate and DesignerSession. Deduplicate by event ID; add a warehouse only when scale requires it.

## 9. Widgets and filters

Admin filters: date range, platform, template/version, export format and feature/module.

Admin widgets: KPI cards for resumes, active designers, exports and local saves; daily trends; funnel from resume creation to confirmed local save; template popularity; export format distribution; failure categories; AI/ATS usage and estimated cost.

User widgets: resume count/recent resumes, ATS activity, export/local-save statuses, template shortcuts and local folder status.

## 10. Authorization and acceptance

All dashboard endpoints require authentication. User queries are scoped to the authenticated identity. Admin endpoints require explicit admin/analytics permission. Reporting is aggregate-first; no resume content inspection. Preview and local storage open as separate routes. Export generation and confirmed local save are distinct metrics. No sensitive content or local paths enter analytics.