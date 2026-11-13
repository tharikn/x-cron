# 11 — Mobile Architecture (Ionic + Angular + Capacitor)

## 1. Scope

The mobile app provides the resume-builder experience and owns device-side draft/export handling. It consumes the Resume & Career Intelligence APIs; domain rules remain in the backend where shared across clients.

Cross-platform layout, alignment, Android safe-area, keyboard, navigation and device QA standards are defined in [25-CROSS-PLATFORM-WEB-MOBILE-ANDROID-LAYOUT-ARCHITECTURE.md](./25-CROSS-PLATFORM-WEB-MOBILE-ANDROID-LAYOUT-ARCHITECTURE.md). That document is the source of truth for responsive behavior.

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
- Recover drafts after app backgrounding or process recreation according to the security policy.

## 5. Device file storage

Use Capacitor Filesystem and supported sharing/opening plugins. Confirm platform-specific behavior for each supported OS version. Use cache for temporary preview files and documents/app storage for retained app-managed exports. Where the OS supports a user-selected save destination, prefer that for user control.

On Android:
- Prefer Android Storage Access Framework/document picker for user-selected files and destinations.
- Request only the permissions required for the operation; avoid broad storage permission when SAF is sufficient.
- Handle URI permission persistence, provider cancellation, permission revocation, duplicate filenames, low storage and interrupted writes.
- Confirm save only after the native write operation succeeds.
- Respect status/navigation bars, display cutouts, edge-to-edge insets and gesture navigation.
- Keep bottom actions above system navigation insets and ensure the keyboard does not cover active fields or actions.
- Handle Android system back consistently, dismissing the topmost overlay before navigating away.

## 6. Offline behavior

MVP may require network access for account/profile sync and AI. Basic editing can preserve a local draft during temporary disconnection. Do not promise full offline synchronization until conflict resolution, encryption and recovery are implemented.

## 7. UX and accessibility

- Clear progress and errors for imports/exports.
- Never imply a file was saved before native save success.
- Support screen readers, keyboard navigation where relevant and scalable text.
- Use a consistent, minimal visual system; the X Cron product may apply its black-and-white theme without coupling that theme to the reusable service.
- Use one-column mobile forms and task-focused navigation; do not compress desktop multi-panel layouts onto phone screens.
- Support TalkBack, large Android font scaling, portrait/landscape and both gesture/three-button navigation.
- Follow the cross-platform responsive architecture document for breakpoints, layout tokens and release acceptance criteria.

## 8. Testing

Test on real Android and iOS devices:
- file save/open/share
- permission denial
- low storage
- app termination during export
- long resume preview and pagination
- offline edits and conflict handling
- Unicode names and multilingual text
- status/navigation bar and display cutout insets
- keyboard visible/hidden and validation scroll behavior
- system back with dialogs, drawers and nested routes
- 200% text scaling / large display settings where supported
- phone, tablet, landscape and foldable widths where available
- no unintended horizontal overflow, clipping or overlapping actions
