# 11 — Mobile Architecture (Ionic + Angular + Capacitor)

## 1. Scope

The mobile app provides the resume-builder experience and owns device-side draft/export handling. It consumes the Resume & Career Intelligence APIs; domain rules remain in the backend where shared across clients.

## 2. Suggested feature structure

```text
src/app/features/resume/
  pages/
    career-profile/
    resume-list/
    resume-editor/
    resume-preview/
    job-match/
    ats-report/
    local-exports/
  components/
    section-editor/
    experience-editor/
    skill-selector/
    template-selector/
    score-breakdown/
  data-access/
    resume-api.service.ts
    career-profile-api.service.ts
    export-api.service.ts
  state/
  models/
  storage/
    local-draft.service.ts
    device-file.service.ts
```

## 3. Main screens

1. Career Profile — add/edit confirmed facts.
2. Resume List — create and manage role-specific resumes.
3. Resume Editor — edit sections, order and visibility.
4. Template Selection — choose a template.
5. Preview — inspect pagination and formatting.
6. Job Match — paste/select a job description.
7. ATS Report — score breakdown and suggestions.
8. Local Exports — show files known to the app, with open/share/delete actions where supported.

## 4. State and saving

- Use local component/feature state for in-progress edits.
- Debounce save operations.
- Show saved/saving/error status.
- Use optimistic UI only where rollback is reliable.
- Include version/updatedAt to detect conflicts.
- Preserve unsaved work when AI or network requests fail.

## 5. Device file storage

Use Capacitor Filesystem and supported sharing/opening plugins. Confirm platform-specific behavior for each supported OS version. Use cache for temporary preview files and documents/app storage for retained app-managed exports. Where the OS supports a user-selected save destination, prefer that for user control.

## 6. Offline behavior

MVP may require network access for account/profile sync and AI. Basic editing can preserve a local draft during temporary disconnection. Do not promise full offline synchronization until conflict resolution, encryption and recovery are implemented.

## 7. UX and accessibility

- Clear progress and errors for imports/exports.
- Never imply a file was saved before native save success.
- Support screen readers, keyboard navigation where relevant and scalable text.
- Use a consistent, minimal visual system; the X Cron product may apply its black-and-white theme without coupling that theme to the reusable service.

## 8. Testing

Test on real Android and iOS devices:
- file save/open/share
- permission denial
- low storage
- app termination during export
- long resume preview and pagination
- offline edits and conflict handling
- Unicode names and multilingual text
