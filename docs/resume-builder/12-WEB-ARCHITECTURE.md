# 12 — Web Architecture (Angular)

## 1. Scope

The Angular web client provides the same core resume workflows as mobile. It uses the same versioned APIs and domain contracts.

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

The editor should work on desktop and mobile browsers. Keep the form and preview usable at narrow widths. Avoid making the editor depend on drag-and-drop; provide accessible move-up/move-down controls for section ordering.

## 7. Testing

- Unit-test forms, validation and state transitions.
- Test downloads in major supported browsers.
- Test HTML rendering with malicious content.
- Test responsive editor and preview.
- Test expired sessions, API failures and conflicting edits.
