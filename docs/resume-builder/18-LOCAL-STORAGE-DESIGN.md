# 18 — Local Folder and Document Storage Design

## 1. Non-negotiable storage rule

All individual resume document files belong in a folder on the user's device. The application must not persist generated PDF, DOCX, HTML or XLSX files, uploaded source documents, or copies of those files on application servers, cloud object storage or database blobs.

PostgreSQL may store approved structured career data, resume definitions/snapshots, template references, layout configuration and analysis metadata. These records are not document files. The product must clearly disclose what structured data is saved to the signed-in account.

## 2. Mandatory authentication

Users sign in before opening Resume Builder or accessing local file management. Local file access does not bypass API authentication. If the session expires, preserve unsaved in-memory editor state where safely possible and require re-authentication before protected API operations.

## 3. Folder experience

On first export:
1. Explain that resume documents are stored locally on this device.
2. Create the default app folder where supported, e.g. X Cron/Resumes, or ask the user to choose a folder.
3. Request OS/browser permission through the native picker/user gesture.
4. Persist only a platform-supported folder reference/permission handle locally, never an arbitrary server-side path.
5. Show folder name and permission status in a dedicated Local Files screen.
6. Let the user change folder or revoke access.

Users can list files, open, rename, share and delete files where the OS permits. Never claim a file exists or was saved unless the platform confirms it.

## 4. Platform adapters

### Android — Ionic + Capacitor
- Use Capacitor Filesystem for app-private documents and cache.
- For a user-visible folder outside app sandbox, use Android Storage Access Framework/document picker through a maintained Capacitor plugin/native bridge.
- Prefer user-selected directory access for a stable visible folder.
- Do not request broad storage permissions when scoped document access is sufficient.
- Test Android API levels, app reinstall, permission revocation and external storage removal.

### iOS — Ionic + Capacitor
- Use app Documents directory for app-managed files.
- Use document picker / Files integration for user-selected locations and export/share.
- Respect sandbox and security-scoped access rules.
- Explain that app-private Documents and user-selected Files locations have different visibility and backup behavior.

### Web — Angular
- Use File System Access API only in supported browsers and after explicit user interaction.
- Persist a directory handle only where supported; re-check permission when opening the app.
- Fallback to standard download when directory access is unsupported or denied.
- Browser downloads may use the browser's configured Downloads folder; do not claim a custom folder was selected if it was not.
- IndexedDB may hold small local metadata or temporary drafts only when justified; it is not a replacement for the user's document folder.

## 5. File organization and naming

Suggested default structure:
~~~text
X Cron/
  Resumes/
    <Resume-Name>/
      <Resume-Name>-v001.pdf
      <Resume-Name>-v001.docx
      <Resume-Name>-v002.pdf
~~~

- Sanitize filenames and remove reserved characters.
- Avoid overwriting an existing file without confirmation.
- Offer predictable version suffixes and timestamp only when useful.
- Store format, size, created time and local identifier in a local index if needed.
- Do not sync file paths or full filenames to analytics.

## 6. Save/export lifecycle

~~~text
Authenticated user chooses export
 → Render bytes/stream
 → Client receives bytes
 → Local folder adapter validates permission
 → Write temporary local file
 → Flush/commit final filename
 → Verify write result
 → Update local index
 → Emit privacy-safe save-success event
 → Show saved location/name
~~~

If server-side export is used, stream the response. Avoid server temporary files. If unavoidable, encrypt and delete them immediately after response completion or failure. Do not create permanent signed download URLs or server-side export archives.

## 7. Import lifecycle

- User selects a local PDF/DOCX.
- Client sends bytes through an authenticated, bounded, encrypted transient parse request only if local parsing is not practical.
- Parse service returns structured suggestions, not a permanent file reference.
- Delete temporary bytes immediately after parse completion, failure or cancellation.
- User reviews extracted data and explicitly confirms what enters their structured career profile.
- Never store the uploaded source document as a backup.

## 8. Local index and recovery

A local index may track file display name, format, size, modified time, template/version and local URI/handle. Keep it on device only. Reconcile stale index entries against filesystem results. If a file is missing, mark it unavailable; do not recreate or upload it automatically.

If folder permission is revoked, request permission again. If the folder is moved/deleted, let the user choose a new folder. Never silently switch to cloud storage.

## 9. Backup and privacy

Local-only storage means files can be lost if a device is lost/reset, the app is uninstalled or browser data is cleared. Explain this clearly. Cloud backup/sync is out of scope and must not be introduced without a separate explicit product decision and consent.

Do not log document bytes, extracted full text, local paths or file handles. Apply encryption in transit and platform-provided at-rest protections. Provide delete/export controls for structured account data separately from local document deletion.

## 10. Acceptance criteria

- No permanent individual resume document exists on application server, object storage or database.
- User can create/select a local folder and save exports there where supported.
- Unsupported/denied folder APIs have an honest download fallback.
- Save success is shown only after filesystem confirmation.
- Existing files are not silently overwritten.
- Uploaded source files are transient and deleted on every exit path.
- Local file listing and actions are separate from the dashboard.
- No local paths, file bytes or document text enter analytics.