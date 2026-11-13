# 24 — Resume Intelligence UI/UX Architecture

## 1. Purpose and product direction

Define a modern, premium, accessible UI/UX system for the X Cron Resume Intelligence experiences. The interface should feel like a focused career workspace: clear, calm, fast to scan, evidence-led and consistent across Angular web and Ionic/Capacitor mobile.

This document defines presentation architecture and interaction patterns. It does not replace the feature-specific behavior in:
- [20 — Resume Quality & Recruiter Review](./20-RESUME-QUALITY-RECRUITER-REVIEW.md)
- [21 — Resume Parsing Test](./21-RESUME-PARSING-TEST.md)
- [22 — Recruiter View](./22-RECRUITER-VIEW.md)
- [23 — Resume Match Score](./23-RESUME-MATCH-SCORE.md)
- [17 — Preview Design](./17-PREVIEW-DESIGN.md)

Each is an independent route and feature. Shared UI components may be reused, but do not merge their scores, reports, navigation or responsibilities.

## 2. UX principles

1. **Outcome before decoration:** every screen answers what was checked, what was found and what the user can do next.
2. **Explain every score:** show dimensions, weights, evidence, missing inputs and calculation version. Never show an unexplained score ring as the whole report.
3. **Progressive disclosure:** show the highest-priority summary first; put detailed evidence, rule explanations and technical diagnostics behind expandable sections.
4. **Evidence-linked feedback:** every finding links to a resume section, text span, page or JD requirement when possible.
5. **User remains in control:** AI suggestions are proposed changes with before/after text; accept, edit, dismiss and undo are explicit.
6. **Separate mental models:** quality, parsing, recruiter presentation and job match are different jobs and need distinct routes, labels and result screens.
7. **Responsive by design:** desktop can use comparison panels; mobile uses a guided single-column flow and bottom actions.
8. **Accessible by default:** keyboard operation, visible focus, semantic landmarks, screen-reader labels, sufficient contrast, reduced-motion support and non-color status cues.
9. **Privacy visible:** make local-file handling, transient parsing and optional AI processing clear at the point of action.
10. **Honest states:** distinguish completed, partial, unavailable, unsupported and failed analysis. Never imply an inaccessible job URL was imported.

## 3. Information architecture and navigation

Create a Resume Intelligence landing/workspace with separate feature entry points:

| Feature | Suggested route | Primary user question |
|---|---|---|
| Resume Analyser | `/resume-builder/analyser` | How strong and clear is my resume? |
| Parsing Test | `/resume-builder/parsing-test` | Can a parser read my exported file correctly? |
| Recruiter View | `/resume-builder/recruiter-view/:resumeId` | What does my resume look like to a recruiter? |
| Job Match Score | `/resume-builder/match-score` | How closely does this resume fit this job? |
| Preview | `/resume-builder/preview/:resumeId` | How will the final document look? |

Workspace landing screen:
- Resume selector with version and last-updated information.
- Four distinct feature cards with one-line purpose and last-run status.
- Recent reports list with report type, resume version, target role (if applicable), date and status.
- Primary action to start a new analysis.
- No combined or blended “master score”.

Use a persistent desktop side navigation only within Resume Builder. On mobile, use a compact top bar, clear back navigation and a small bottom action area; do not force desktop sidebars into narrow screens.

## 4. Shared visual design system

### 4.1 Brand and visual language
- Retain X Cron's strict black-and-white product identity and white page background.
- Use black/near-black for primary text and actions, white surfaces, neutral grey for borders and secondary information.
- Use semantic status colors sparingly and consistently for success, warning and critical states; never rely on color alone.
- Avoid excessive gradients, glassmorphism, neon colors, oversized shadows, decorative charts and animated score counters.
- Use typography scale, spacing, alignment and whitespace to establish hierarchy.

### 4.2 Layout tokens
Define reusable tokens for:
- Content max-width and reading width.
- Page gutters at mobile, tablet and desktop breakpoints.
- Spacing scale, card radius, border width and elevation.
- Heading/body/caption typography and line heights.
- Focus ring, disabled, hover, pressed and selected states.
- Status severity and chart thresholds.

Keep long-form resume/JD text at a comfortable reading width. Use a wider workspace only when two documents or evidence panels genuinely need comparison.

### 4.3 Component library
Build Angular standalone, accessible components:
- AppPageHeader, Breadcrumbs, ResumeVersionPicker.
- FeatureCard, ReportHistoryList, EmptyState, ErrorState.
- ScoreSummary, ScoreBreakdown, MetricTrend (where historical data exists).
- FindingCard, SeverityTag, EvidenceQuote, RequirementRow.
- ExpandableSection, FilterChips, SearchField, InlineNotice.
- ResumeDocumentPane, JobDescriptionPane, DiffViewer.
- StepProgress, ProcessingTimeline, Toast/InlineFeedback.
- StickyActionBar, ConfirmationDialog, AccessibleTooltip.

Components must consume typed view models; they must not calculate business scores or call AI providers.

## 5. Shared analyser interaction patterns

### 5.1 Start analysis flow
Use a short guided flow:
1. Choose an existing resume/version or select a local document when supported.
2. Choose the analysis type.
3. Provide optional context such as target role/JD only when relevant.
4. Review privacy and processing notice.
5. Start analysis.

Do not ask for JD input in the general quality analyser. Do not require an uploaded file when structured resume data is already available.

### 5.2 Processing state
Replace an indefinite spinner with a truthful staged progress view:
- Validating input
- Extracting/normalizing content
- Running deterministic checks
- Comparing requirements (match mode only)
- Preparing evidence and report

Show stages as pending/running/completed/failed only when the backend reports those states. If exact progress is unavailable, label the display as “Processing steps” rather than a fabricated percentage. Support cancellation where the backend can safely cancel.

### 5.3 Results layout
Recommended order:
1. Report title, resume version, target job (if any), timestamp and analysis version.
2. Main result summary with score name and clear interpretation.
3. Dimension breakdown with weights and accessible textual values.
4. Highest-priority findings and positive evidence.
5. Detailed findings grouped by category.
6. Recommended next actions.
7. Re-run/recalculate action and report history link.

Use a sticky summary only on wide screens where it does not obscure content. On mobile, use a compact summary that scrolls normally.

## 6. Feature-specific screen patterns

### 6.1 Resume Analyser — quality review
- Top summary: Resume Quality Score, number of critical/high-priority findings, strengths and review status.
- Category breakdown: writing, content strength, structure, consistency, readability and document readiness.
- Findings list sorted by severity and user impact, with filters for category/severity.
- Finding detail opens inline or in a side panel and shows exact evidence, why it matters, recommended fix and confidence.
- Suggestions use a before/after diff with Accept, Edit, Dismiss and Undo.
- Clearly label the score as X Cron's quality assessment, not a vendor ATS score or hiring prediction.

### 6.2 Resume Parsing Test
- Separate upload/select-file entry point with supported formats and size limits shown before selection.
- Result header: Parsing Test status, parser/version and whether ground truth was available.
- Display extracted text/sections alongside the source page or generated preview.
- Highlight missing fields, incorrect reading order, broken links, Unicode/glyph problems and layout-induced extraction issues.
- When structured source data exists, show expected-versus-extracted comparison and a measured accuracy metric with its method.
- Without ground truth, show diagnostics and coverage indicators only; never fabricate an accuracy percentage.

### 6.3 Recruiter View
- Minimal, reading-first document presentation.
- Quick-scan overview: headline, summary, recent relevant experience, achievements and core skills.
- Full-content mode with section navigation and expandable role details.
- Toggle between recruiter presentation and original formatted preview.
- Optional anonymized mode that masks contact details.
- Clearly mark any linked quality annotations; keep the view read-only and do not add a recruiter score.

### 6.4 Job Match Score
- Job input screen offers three clear paths: paste description, enter permitted job URL, or select an authorized integration if configured.
- For LinkedIn, Naukri and Indeed URLs, explain that access depends on public availability and source permissions. If retrieval fails, preserve the URL context and offer a paste-in editor immediately.
- Show extracted job title, company, seniority, responsibilities, required/preferred skills, experience and qualifications in an editable confirmation step.
- Require the user to select an exact resume version before scoring.
- Results header shows **Resume Match Score** and the exact target role/company, source and resume version.
- Use a clear score breakdown: required skills, preferred skills, relevant experience, responsibilities, qualifications and role/seniority alignment. Weights are configuration/versioned, visible and calibrated; do not hard-code misleading universal weights in the UI.
- Requirement matrix states: Strong evidence, Partial evidence, Not found, Not applicable/uncertain. Each row links to resume evidence or explicitly says no evidence was found.
- Provide filters for matched, partial and missing requirements; search within requirements; expand evidence snippets.
- Show suggested actions in priority order. A missing skill must not be suggested for insertion unless the user's profile supports it or the user confirms it.
- Allow side-by-side JD and resume evidence on desktop; on mobile use tabs or a requirement-detail drill-in.
- Include a “What this score means” explanation: it is an X Cron evidence-based comparison, not selection probability, employer ATS score or guarantee of interview.

## 7. Advanced interaction patterns

- **Progressive disclosure:** collapse low-priority details but keep critical warnings visible.
- **Inline evidence anchors:** selecting a finding scrolls/highlights the corresponding resume section or JD requirement.
- **Requirement matrix:** sticky category labels on desktop, compact stacked rows on mobile.
- **Diff-first editing:** display original and proposed text together; preserve the source until user approval.
- **Undo and version history:** every accepted change creates a reversible structured revision.
- **Compare runs:** show score/category deltas only when reports use compatible scoring versions and identical or explicitly aligned inputs.
- **Smart filters:** severity, category, matched state and section filters; provide a clear “reset filters”.
- **Helpful empty states:** explain why there is no report and provide one primary next action.
- **Error recovery:** retain safe user-entered JD text locally during a recoverable failure; never silently discard it.
- **Tooltips with plain-language definitions:** avoid unexplained ATS/NLP jargon.

## 8. Responsive behavior

### Desktop (wide)
- Use two-column or three-region workspaces only where they materially aid comparison.
- Example Match layout: left JD requirement list, center resume evidence/document, right score summary and actions; allow collapsing panels.
- Keep the main content width controlled and avoid dense dashboards with too many cards.

### Tablet
- Reduce to two panels or a tabbed comparison.
- Preserve the score summary and selected requirement context.

### Mobile
- Single-column guided flow.
- Replace side-by-side comparison with JD/Resume tabs and a focused evidence drawer.
- Use touch targets at least 44 CSS px where practical.
- Avoid hover-only explanations and horizontal scrolling tables.
- Put primary actions within thumb reach without covering content.
- Support file picker and local save behaviors defined in the local-storage design.

## 9. Accessibility and motion

- Target WCAG 2.2 AA for web UI.
- Semantic heading hierarchy, landmarks, labels and descriptive button names.
- Full keyboard navigation and visible focus.
- Announce analysis completion/errors and score updates through appropriate live regions without excessive announcements.
- Charts must have adjacent textual summaries or accessible data tables.
- Status must include text/icon/shape, not color alone.
- Respect prefers-reduced-motion; no essential information may depend on animation.
- Ensure zoom/reflow and high-contrast behavior remain usable.

## 10. Angular + Ionic implementation architecture

Suggested frontend structure:

```text
apps/
  web/
    src/app/resume-intelligence/
      core/
        resume-intelligence.routes.ts
        services/
        state/
        view-models/
      shared/
        components/
        design-tokens/
        accessibility/
      features/
        workspace/
        analyser/
        parsing-test/
        recruiter-view/
        match-score/
        preview/
  mobile/
    src/app/resume-intelligence/
      routes/
      shared/
      features/
```

Implementation rules:
- Use standalone Angular components and lazy-loaded feature routes.
- Use typed API clients and feature-scoped state (signals or the existing state standard).
- Keep domain/scoring logic in NestJS; UI only renders server-provided score dimensions and evidence.
- Use design tokens and shared components across web/mobile, with platform-specific layouts where needed.
- Use virtual scrolling only for genuinely large report histories or requirement lists.
- Avoid large charting libraries for simple score bars; use accessible native/CSS visualizations where sufficient.
- Instrument only privacy-safe UI events; never send resume text, JD text, names, contact details or evidence snippets to analytics.

## 11. Backend view-model contracts

Return presentation-ready but domain-neutral DTOs. Example match result:

```json
{
  "reportId": "report-id",
  "resumeVersionId": "resume-version-id",
  "jobDescriptionId": "job-id",
  "score": {
    "name": "resume_match",
    "value": 78,
    "scale": 100,
    "scoringVersion": "1.0",
    "interpretation": "good_alignment"
  },
  "dimensions": [
    {
      "key": "required_skills",
      "label": "Required skills",
      "score": 82,
      "weight": 0.35,
      "matchedCount": 8,
      "partialCount": 2,
      "missingCount": 1
    }
  ],
  "requirements": [
    {
      "requirementId": "req-1",
      "label": "NestJS",
      "importance": "required",
      "status": "strong_evidence",
      "evidence": [
        {
          "resumeSection": "experience",
          "text": "Built NestJS APIs for...",
          "sourceReference": "resume-section-id"
        }
      ],
      "explanation": "Direct experience is stated in the selected resume."
    }
  ],
  "limitations": []
}
```

The UI must tolerate unknown/partial fields and show “Not assessed” rather than zero when a dimension was not evaluated. The backend remains authoritative for scoring, versioning and evidence mapping.

## 12. Privacy and trust UX

- Show a concise processing notice before document/JD analysis.
- Clearly distinguish local document files from account-backed structured resume data.
- Disclose when a third-party AI provider receives content; minimize data sent.
- Do not expose private resume data through shareable URLs by default.
- Anonymized Recruiter View must mask configured personal fields in the rendered projection, not merely visually cover them while leaving them in accessible markup.
- Do not store document binaries or permanent uploaded files; follow the local-storage and transient-processing policies.
- Provide report deletion and retention controls where supported.

## 13. Performance and resilience

- Lazy-load feature routes and heavy document preview modules.
- Render the first useful result summary before secondary charts/details.
- Paginate or virtualize long findings and requirement lists.
- Cache only safe structured metadata with explicit invalidation by resume/JD/scoring version.
- Use skeletons for known layout regions; use staged status for real processing.
- Handle offline, timeout, rate limit, unsupported file and URL retrieval failure states.
- Keep deterministic review/matching usable if optional AI services are unavailable.

## 14. UX analytics and product metrics

Track privacy-safe events:
- Analysis started/completed/failed by feature type.
- Time to first useful result.
- Findings opened, accepted, edited or dismissed by rule ID/category (not content).
- Match report rerun and requirement filter usage.
- Parsing failures by file type/parser version.
- Accessibility errors and task completion from usability tests.

Do not collect resume/JD text, names, contact information, employer details or evidence snippets in analytics.

## 15. Design validation and acceptance criteria

Before release:
1. Prototype desktop and mobile flows for all four analyser features.
2. Test first-time, returning and error-recovery journeys.
3. Validate keyboard-only and screen-reader operation.
4. Run WCAG 2.2 AA checks and manual contrast/focus/reflow review.
5. Test long resumes, long JDs, missing sections, multiple pages and narrow screens.
6. Confirm score labels and explanations are understandable without domain knowledge.
7. Verify every finding/requirement can be traced to evidence or clearly marked as unsupported.
8. Confirm no UI invents progress, accuracy, ATS compatibility or hiring probability.
9. Verify local-only file policy and AI processing disclosures.
10. Conduct usability tests with job seekers across experience levels and iterate on observed task friction.

Release gate: users must be able to independently understand and navigate Resume Analyser, Parsing Test, Recruiter View and Job Match Score without confusing their purposes or scores.
