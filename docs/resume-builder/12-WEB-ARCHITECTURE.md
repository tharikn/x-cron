# 12 — Web Architecture (Angular)

## 1. Scope

The Angular web client provides the same core resume workflows as mobile. It uses the same versioned APIs and domain contracts.

Cross-platform layout, responsive breakpoints, alignment rules, mobile-web behavior and visual regression standards are defined in [25-CROSS-PLATFORM-WEB-MOBILE-ANDROID-LAYOUT-ARCHITECTURE.md](./25-CROSS-PLATFORM-WEB-MOBILE-ANDROID-LAYOUT-ARCHITECTURE.md). Follow it as the source of truth for responsive layout behavior.

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
  components/
  data-access/
  state/
  models/
  utils/
```

## 3. Client responsibilities

- Form editing and client-side validation for usability.
- API calls and user-visible save state.
- Preview using trusted template/render model.
- Request exports and download returned files.
- Manage local drafts only where explicitly supported.
- Do not calculate authoritative ATS scores in the browser.

## 4. Browser file handling

- Use standard Blob/object URL download with proper MIME type and filename.
- Revoke object URLs after use.
- Use File System Access API only as an enhancement after explicit user interaction.
- Provide standard download fallback.
- Do not rely on localStorage for full resume files or sensitive profile payloads.
- Use IndexedDB only for justified draft/offline needs and define cleanup.

## 5. Security

- Follow the host application's authentication model.
- Avoid storing long-lived tokens in localStorage where a safer host pattern exists.
- Sanitize imported/rendered content.
- Use CSP and secure cookie/token configuration at the host application level.
- Do not render raw AI-generated HTML.
- Protect against XSS and unsafe file names.

## 6. Responsive behavior

- The editor must work on desktop and mobile browsers.
- Use content-driven breakpoints and responsive containers; do not simply shrink desktop layouts.
- Use bounded reading/workspace widths, fluid gutters and CSS Grid/Flexbox.
- Desktop may use side navigation and multi-panel workspaces where each panel remains readable.
- Tablet should collapse to two panels or tabs.
- Mobile web should use a compact top bar, single-column content and task-focused detail screens.
- Keep forms one-column on phones; replace tables with labelled cards/rows.
- Avoid whole-page horizontal scrolling, clipped controls and fixed heights on text-bearing surfaces.
- Do not make drag-and-drop mandatory; provide accessible move-up/move-down controls.
- Use browser capability detection for file APIs and retain download fallback.
- Support 200% zoom, text reflow and keyboard/screen-reader navigation.

## 7. Testing

- Unit-test forms, validation and state transitions.
- Test downloads in major supported browsers.
- Test HTML rendering with malicious content.
- Test responsive editor and preview.
- Test expired sessions, API failures and conflicting edits.
- Run visual regression at agreed phone, tablet, laptop and desktop widths.
- Verify no unintended horizontal overflow, clipping, overlap or inaccessible sticky action bars.
- Test keyboard-only navigation, screen-reader labels, focus management and 200% zoom.
- Validate mobile Safari and Chrome Android in addition to desktop browsers.
