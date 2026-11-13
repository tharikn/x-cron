# 16 — Dashboard, Guest-First Access, Template Designer, Preview & Google Docs Architecture

## 1. Purpose

This document defines the architecture for the Resume Builder's usage dashboards, guest-first access model, predefined template catalogue, visual designer, layout/alignment system, preview pipeline and Google Docs integration.

The design must satisfy these product requirements:

- Visitors can use Resume Builder features before being asked to create an account or log in.
- Users can choose predefined resume designs and customize content/layout safely.
- The same layout definition drives editor, preview and exported documents to minimize alignment differences.
- Users can see their own usage history where appropriate.
- Administrators/product owners can understand overall usage: exports, downloads, active designers, unique downloaders, template popularity and feature adoption.
- Google Docs is an optional destination, not a login requirement.
- Generated files remain on the user's device by default; analytics must not require permanent file storage.

## 2. Architecture overview

~~~text
                 Ionic / Angular / Web Client
                              |
                Guest Session / Auth Adapter
                              |
                 Resume Builder API (NestJS)
                              |
       +----------------------+-----------------------+
       |                      |                       |
  Template Catalog       Designer / Layout       Resume / Profile
       |                   Configuration              |
       |                      |                       |
       +----------------------+-----------------------+
                              |
                      Shared Render Model
                              |
                +-------------+--------------+
                |             |              |
             Editor         Preview       Export Adapters
                                           PDF / HTML /
                                           DOCX / XLSX
                |
          Usage Event SDK
                |
          Analytics Ingestion API
                |
       Event Store / Aggregates
                |
       +--------+-------------------------+
       |                                  |
 User Usage Dashboard             Admin Analytics Dashboard

Optional: Google OAuth → Google Docs API → User's Google Drive
~~~

## 3. Guest-first access and delayed login

### 3.1 Product rule

Do not force login before the user can experience the Resume Builder. Start in guest mode and let the visitor reach a useful result before presenting account creation.

### 3.2 Guest capabilities

A guest should be able to:
- Open the template gallery and inspect templates.
- Start a resume using a predefined template.
- Enter and edit resume information.
- Reorder, hide and show sections.
- Preview the resume.
- Generate a local PDF/HTML export where the client can do so safely.
- Keep a temporary local draft on the device/browser.

Guest mode must clearly explain that local drafts may be lost if browser/app data is cleared, the app is uninstalled or the device is lost.

### 3.3 When login is requested

Ask the user to sign in only when they choose an account-backed capability, such as:
- Save or synchronize a profile/resume in the cloud.
- Access the same resume on another device.
- Recover a resume after reinstalling or clearing browser data.
- Use account-bound job matching/history, saved reports or cross-device usage history.
- Use a feature whose access requires an account or paid entitlement.

Do not block local editing, template selection or preview behind login. For a guest who attempts a protected action, show a clear explanation and preserve their current work while the authentication flow runs.

### 3.4 Guest session and conversion flow

~~~text
Visitor opens Resume Builder
          |
     Create guest workspace
          |
  Local draft + template selection
          |
  Edit → Designer → Preview → Local export
          |
 User chooses cloud save / sync / account feature?
          |
       No  |  Yes
           |
      Continue     Show sign-in / create-account
      as guest              |
                      Authenticate
                            |
                 Link guest workspace to account
                            |
                 User confirms import/merge
                            |
                 Cloud profile/resume created
~~~

### 3.5 Guest workspace rules

- Generate a random, unguessable guest workspace identifier. It is not an authentication credential.
- Keep guest resume content in local device/browser storage by default.
- If server-side processing is required, use a short-lived guest session token with narrow scope, expiry and strict rate limits. Do not treat a guest ID as authorization.
- Avoid uploading a complete resume to the backend until a feature requires it and the user understands the processing.
- On sign-in, offer an explicit **Save this resume to my account** action.
- Merge only after showing the user what will be uploaded or changed. Do not silently overwrite an existing profile.
- If sign-in is cancelled or fails, return to the preserved guest workspace.
- Apply abuse controls to guest AI, parsing and export endpoints. Guest mode is not an exemption from rate limits.

### 3.6 Authentication boundary

Use the existing X Cron identity service when account features are needed. Resume Builder should validate signed identity tokens and enforce ownership; it should not create an unrelated mandatory identity system. Google OAuth is separate and only used for Google Docs/Drive actions.

## 4. Predefined template catalogue

### 4.1 Recommended approach

Store predefined templates as **versioned, declarative design packages**, not screenshots and not arbitrary HTML/JavaScript. Keep source packages in Git for review and release history. Seed/publish template metadata and versions into PostgreSQL for runtime listing and selection.

A template package should contain:
- manifest.json: template ID, name, description, category, version, supported locales, page sizes, renderer compatibility and preview asset reference.
- layout.json: semantic section layout, columns, ordering, spacing and alignment constraints.
- theme.json: typography, font sizes, colors, spacing scale, borders and visual tokens.
- sections/: trusted section component definitions or identifiers.
- assets/: licensed fonts/icons/thumbnail assets where required.
- compatibility.json: supported export formats and known limitations.

Do not store executable template code supplied by users. User-created templates, if introduced later, must use the same constrained schema and validation.

### 4.2 Template categories

Start with a small curated catalogue:
- ATS-friendly single-column
- Modern professional
- Technical / developer
- Graduate / entry-level
- Executive / leadership
- Compact two-column (clearly labelled as potentially less parser-friendly)

Each template should display a thumbnail, description, best-use guidance, page format and ATS-readability label. Do not claim that any template is guaranteed to pass every ATS.

### 4.3 Source of truth and storage

| Data | Recommended storage |
|---|---|
| Template source package and history | Git repository |
| Published template metadata/version/status | PostgreSQL |
| Thumbnail/preview asset | Bundled static asset or low-cost CDN |
| User's selected template/version | Resume configuration in PostgreSQL after account save; local guest draft before login |
| User layout overrides | Validated JSON configuration |
| Generated resume document | User device by default |

Publish a template by validating the package, running render tests, assigning an immutable version, then updating the catalogue record. Never mutate an existing published version in place. New releases create a new version.

## 5. Designer and alignment model

### 5.1 Avoid pixel-coordinate-first design

Do not store every text block as arbitrary x/y pixel coordinates. This becomes fragile across page sizes, fonts, languages, PDF engines and mobile previews.

Use a **semantic layout schema** with constrained layout primitives:
- Page: size, orientation, margins and columns.
- Grid: column count, gap and responsive behavior.
- Section: type, order, visibility and spacing.
- Block: heading, paragraph, bullet list, date range, link, skill group, etc.
- Alignment: start, center, end, justified.
- Typography: token references and limited overrides.
- Flow rules: keep heading with following content, avoid splitting a bullet where possible, page-break preferences.

A 12-column logical grid can be used for multi-column templates, but content should flow within grid areas rather than depend on fixed screen pixels.

### 5.2 Example layout configuration

~~~json
{
  "schemaVersion": "1.0",
  "page": {
    "size": "A4",
    "orientation": "portrait",
    "margin": { "top": 36, "right": 36, "bottom": 36, "left": 36 },
    "columns": 1,
    "columnGap": 16
  },
  "theme": {
    "fontFamily": "Inter",
    "bodySize": 10,
    "headingSize": 13,
    "lineHeight": 1.35,
    "sectionGap": 16
  },
  "sections": [
    {
      "type": "experience",
      "visible": true,
      "order": 3,
      "layout": "full-width",
      "headingAlign": "start",
      "contentAlign": "start",
      "keepHeadingWithNext": true
    }
  ]
}
~~~

Values above are illustrative. Store dimensions in a renderer-neutral unit such as points or a documented logical unit; do not mix CSS pixels and PDF points without conversion.

### 5.3 Resume content versus design

Keep two separate objects:

1. **Resume content model** — personal details, summary, experience, skills, education and other facts.
2. **Resume design configuration** — selected template/version, section visibility/order, grid placement, spacing, typography and alignment overrides.

This separation allows the same career content to be rendered using multiple designs without duplicating the user's career history.

### 5.4 Alignment sheet / layout sheet

The alignment sheet is the canonical layout specification for a template. It defines:
- Page dimensions and margins.
- Header and section regions.
- Column/grid structure.
- Section order and allowed placements.
- Text alignment and vertical alignment.
- Typography and spacing tokens.
- Overflow and page-break behavior.

The visual editor edits this constrained configuration. The renderer interprets it. The preview and export engine must consume the same normalized render model and template version.

Do not implement a separate set of alignment rules for preview and PDF. That is the main source of preview/export mismatch.

### 5.5 Validation and constraints

- Validate layout JSON against a versioned JSON Schema.
- Clamp spacing, font sizes and column widths to supported ranges.
- Prevent overlapping regions and invalid grid spans.
- Reject unknown block types and untrusted executable content.
- Provide template defaults and safe reset.
- Store only user overrides, not a full copy of the template package.
- Migrate old configuration with explicit schema migrations when the layout schema changes.

## 6. Editor, preview and rendering consistency

### 6.1 Shared rendering pipeline

~~~text
Career Data + Resume Content + Template Version + User Overrides
                              |
                     Normalize Render Model
                              |
              +---------------+----------------+
              |                                |
        Interactive Editor                Preview Renderer
                                               |
                                       Export Renderer
                                     PDF / HTML / DOCX
~~~

The editor may use responsive CSS for editing, but the canonical page layout must be calculated from the shared render model. Preview and exports must use the same design tokens, section order, page dimensions and typography definitions.

### 6.2 Preview behavior

- Provide live or debounced preview as the user edits.
- Support page-by-page preview for A4/Letter and multi-page content.
- Show page boundaries, margins and overflow warnings.
- Indicate when content moves to another page.
- Allow zoom and fit-to-page.
- Provide a mobile-friendly editing mode without pretending the mobile viewport is the final printed page.
- Offer a final export preview using the actual PDF/DOCX renderer for high-fidelity validation where practical.

### 6.3 Preview/export fidelity

Exact pixel identity across browser, native fonts and PDF engines cannot always be guaranteed. Reduce differences by:
- Using a shared token system and versioned fonts.
- Using consistent unit conversion.
- Testing the same fixtures through browser and PDF renderers.
- Avoiding unsupported CSS/layout features in ATS templates.
- Running visual regression tests on template releases.
- Providing a final rendered PDF preview before the user downloads.

## 7. Usage analytics and dashboards

Build analytics around events and aggregate counters. Do not calculate dashboards by repeatedly scanning full resume records.

### 7.1 Dashboard audiences

**Product/admin dashboard**
- Overall usage across the service.
- Usage by date range, platform, template and feature.
- Active designer users and active editing sessions.
- Export and download funnel.
- Template adoption and feature usage.
- Guest-to-account conversion.

**User dashboard**
- Their own resumes and versions.
- Their own export/download history where available.
- Their own ATS analyses and job matches.
- Their own recent activity and storage status.
- Never expose global user or platform metrics to ordinary users.

### 7.2 Required metrics and precise definitions

| Metric | Definition |
|---|---|
| Total resumes created | Count of resume creation events/records, with deleted-record policy documented |
| Total export requests | Number of export jobs requested |
| Successful exports | Export jobs that completed and returned a file successfully |
| Total downloads | Client-reported successful save/download events; distinguish from export generation |
| Unique downloaders | Distinct authenticated users or privacy-safe guest installation IDs with at least one successful download in the selected period |
| Active designers (DAU/WAU/MAU) | Unique users/guest installations that performed a meaningful editor action in the period |
| Active designer sessions | Concurrent or recently active editor sessions, using a defined inactivity timeout |
| Preview count | Number of preview render requests or preview sessions |
| Template usage | Resume creations/exports grouped by template ID and version |
| Guest-to-account conversion | Guest workspaces linked to an account divided by eligible guest workspaces |
| AI feature usage | Requests by feature, provider, status and token/cost band |
| ATS usage | Number of ATS reports generated and repeat usage |
| Export format split | Successful PDF/HTML/XLSX/DOCX exports by format |

A page view alone must not count as an active designer. Meaningful activity includes content edits, section reorder, template change, preview, or export. Define one inactivity timeout (for example, 30 minutes) for session grouping and make it configurable.

### 7.3 Important measurement limitation

The backend can reliably count export requests and successful file generation. It cannot always prove that a browser user completed saving a file to disk. The client should emit a download/save completion event after the platform reports success where available. For ordinary browser downloads, label this metric **download initiated** unless the browser API provides a reliable completion signal. Do not mislabel generated exports as downloads.

### 7.4 Event model

Use a small, versioned event schema:
- eventId
- eventName
- occurredAt
- anonymousInstallationId (random, rotating/pseudonymous)
- userId (nullable)
- guestSessionId (nullable)
- sessionId
- platform (web/android/ios)
- appVersion
- templateId/templateVersion (nullable)
- resumeId (nullable, internal identifier only)
- exportFormat (nullable)
- status
- durationMs (nullable)
- metadata allowlist

Example event names:
- designer_opened
- designer_activity
- template_selected
- preview_rendered
- export_requested
- export_succeeded
- export_failed
- download_initiated
- download_saved
- guest_workspace_created
- guest_workspace_claimed
- login_completed
- ats_report_generated
- google_docs_created

Never include resume text, contact details, job description content, exported file bytes or AI prompts in analytics events.

### 7.5 Active designer counting

- Generate a session ID when the editor opens.
- Send a lightweight activity heartbeat only while the editor is visible and the user is active.
- Also emit events for meaningful interactions.
- Stop heartbeats when the tab/app is hidden or editor closes.
- Expire a session after the configured inactivity window.
- Deduplicate by user ID for signed-in users and privacy-safe installation ID for guests.
- Dashboard must distinguish signed-in users from guest installations.
- Do not call a user "currently active" based only on a stale heartbeat.

### 7.6 Analytics data architecture

For a low-budget MVP:
- Ingest events through a NestJS analytics endpoint.
- Store minimal raw events in a partitioned PostgreSQL table with retention.
- Maintain daily/hourly aggregate tables for dashboards.
- Use scheduled aggregation or database upserts.
- Add a dedicated analytics warehouse/streaming platform only when scale requires it.

Suggested tables:
- UsageEvent
- UsageDailyAggregate
- UsageTemplateAggregate
- UsageExportAggregate
- DesignerSession (short-lived session state)

Use idempotent event IDs to prevent duplicate counting. Index event date, event name, platform and user/installation key. Apply retention to raw events and keep only aggregates for longer periods where appropriate.

### 7.7 Dashboard filters and visualizations

Admin dashboard filters:
- Date range (today, 7 days, 30 days, custom)
- Platform
- Guest vs authenticated
- Template and template version
- Export format
- Feature/module

Recommended widgets:
- KPI cards: total resumes, active designers, export requests, successful exports, downloads, unique downloaders.
- Trend chart: active designers and exports per day.
- Funnel: designer opened → resume edited → previewed → export generated → download initiated/saved → account created.
- Bar chart: template popularity.
- Donut/bar: export format distribution.
- Table: recent failures and export error categories.
- Cohort: guest-to-account conversion.
- AI/ATS usage and estimated cost.

Do not expose personal resume content in admin dashboards. Access should be role-based and aggregate-first.

## 8. Google Docs integration

### 8.1 Optional integration flow

1. User selects **Open/Create in Google Docs**.
2. Explain the Google permissions required.
3. Start Google OAuth using the supported authorization-code flow and PKCE where applicable.
4. Request minimum Drive/Docs scopes needed for the chosen operation.
5. Generate DOCX or a normalized document structure.
6. Create a Google Doc in the user's authorized Drive using the Google Docs/Drive APIs.
7. Return the Google document URL.
8. Allow disconnect/revoke and handle expired/revoked tokens.

Use OAuth state validation, secure token handling and least-privilege scopes. Do not put Google refresh tokens in browser localStorage or analytics. Prefer a secure backend token vault or the host application's approved OAuth pattern.

### 8.2 Product behavior

- Google sign-in is not required for Resume Builder.
- PDF, HTML, DOCX and local save remain available without Google.
- If Google authorization fails, keep the resume and offer DOCX download.
- Do not silently upload resume data to Google.
- Show the destination account and ask for confirmation before creating the document.
- Store only the Google document ID/URL and connection metadata if the user chooses to link it to their account. Do not copy the exported file into Resume Builder storage.

## 9. API additions

Suggested endpoints (exact route naming can follow the existing API conventions):

| Method | Endpoint | Purpose |
|---|---|---|
| POST | /guest-sessions | Create short-lived guest processing session if server processing is needed |
| POST | /guest-workspaces/claim | Link a local guest workspace after authentication and explicit confirmation |
| GET | /templates | List published templates and versions |
| GET | /templates/:id/versions/:version | Retrieve template metadata/layout schema |
| GET | /resumes/:id/designer-config | Retrieve selected template and user overrides |
| PUT | /resumes/:id/designer-config | Save validated design overrides |
| POST | /resumes/:id/preview | Generate preview render model or preview output |
| POST | /analytics/events | Ingest allowlisted client events |
| GET | /analytics/me/usage | Get the authenticated user's own usage |
| GET | /admin/analytics/overview | Admin aggregate KPIs |
| GET | /admin/analytics/trends | Admin time-series metrics |
| GET | /admin/analytics/templates | Template usage statistics |
| GET | /admin/analytics/exports | Export/download statistics |
| POST | /integrations/google/oauth/start | Start optional Google authorization |
| GET | /integrations/google/oauth/callback | Handle OAuth callback |
| POST | /integrations/google-docs | Create a Google Doc from a confirmed resume version |
| DELETE | /integrations/google/connection | Disconnect/revoke integration |

All admin analytics routes require an explicit admin/analytics permission. Guest endpoints require short TTLs, strict quotas and no access to another guest's workspace.

## 10. Suggested database additions

| Entity | Key fields / purpose |
|---|---|
| Template | id, slug, name, category, status |
| TemplateVersion | templateId, version, schemaVersion, manifest, layout, theme, publishedAt |
| ResumeDesignConfig | resumeId or guest-local reference, templateId, templateVersion, overrides JSONB |
| UsageEvent | eventId, eventName, occurredAt, userId nullable, installation/session IDs, allowlisted metadata |
| UsageDailyAggregate | date, metricKey, dimensions JSONB, count |
| DesignerSession | sessionId, userId nullable, installationId, startedAt, lastActiveAt, platform |
| GoogleConnection | userId, provider, encrypted token reference, granted scopes, status |
| GoogleDocumentLink | userId, resumeVersionId, providerDocumentId, documentUrl, createdAt |

Do not persist guest-local resume content in these analytics tables. Keep template JSON schema-versioned and validate it before saving. Encrypt Google tokens using a dedicated secrets/key-management mechanism; never store plaintext tokens.

## 11. Privacy, consent and retention

- Provide a clear analytics/privacy notice appropriate to the deployment and applicable law.
- Use pseudonymous identifiers for guest analytics; avoid fingerprinting.
- Make non-essential analytics configurable according to consent requirements.
- Do not send resume content or PII to analytics.
- Retain raw events only for a documented, limited period; retain aggregates longer only if they cannot reasonably identify users.
- Restrict dashboard access by role and audit admin access.
- Allow account deletion to remove or anonymize user-linked analytics according to the retention policy.
- Never use dashboard analytics as a back door to inspect user resumes.

## 12. Delivery plan

### Phase A — Guest-first designer foundation
- Guest workspace and local draft.
- Predefined template catalogue.
- Declarative layout schema and alignment constraints.
- Editor, preview and local PDF/HTML export.
- Login prompt only for cloud/account-backed actions.

### Phase B — Core analytics
- Event schema and ingestion.
- Export requested/succeeded and download initiated/saved events.
- Active designer sessions and daily aggregates.
- Admin dashboard KPIs, trends and template usage.
- User-specific usage dashboard.

### Phase C — Advanced designer
- More template variants.
- Controlled layout customization.
- Schema migration and template version compatibility.
- Visual regression suite for preview/export.

### Phase D — Google Docs
- OAuth consent and connection management.
- Create Google Doc from a confirmed resume version.
- Disconnect/revocation and DOCX fallback.

## 13. Acceptance criteria

- A visitor can create, edit, preview and locally export a resume without logging in.
- A protected cloud action triggers login without losing the guest draft.
- Guest workspace claiming requires explicit user confirmation.
- Predefined templates are versioned, validated and reproducible.
- Alignment is stored as semantic layout configuration, not fragile pixel coordinates.
- Editor, preview and export consume the same normalized render model.
- Dashboard distinguishes export generation from download/save activity.
- Active designer metrics count meaningful editor activity, not simple page views.
- Unique downloaders distinguish authenticated users and guest installations.
- Admin metrics are aggregate-first and protected by role-based access.
- No resume content or PII is stored in analytics events.
- Google Docs works only after explicit authorization and is never required for core usage.
- DOCX and local export remain available when Google integration is disconnected or unavailable.
