# 09 — Device-Only Document Storage Policy

Detailed implementation design: [18-LOCAL-STORAGE-DESIGN.md](./18-LOCAL-STORAGE-DESIGN.md).

## 1. Non-negotiable policy

Individual resume document files are stored only on the user's local device. The application must not permanently store generated PDF, DOCX, HTML or XLSX files, uploaded source resume files, or copies of those files on the application server, cloud object storage or database blobs.

## 2. Backend data boundary

Backend may store authenticated, approved structured career profile facts, structured resume content/version metadata, template/version references, layout configuration, ATS/job-analysis metadata and privacy-safe analytics. These are structured records, not document files. Never store document binaries or opaque full-document blobs.

## 3. Local folder behavior

- On first export, create or ask the user to select a dedicated folder such as X Cron/Resumes.
- Save generated documents into that folder by default.
- Let users select another folder, list, rename, open, share and delete files where platform APIs permit.
- Mobile: Capacitor Filesystem and Android Storage Access Framework / iOS document picker as appropriate.
- Web: File System Access API where supported, otherwise normal browser download.
- Confirm success only after the OS/browser confirms the write.

## 4. Transient server processing

If server-side parsing/rendering is required, stream bytes where possible. Any unavoidable temporary artifact must be encrypted, access-controlled, short-lived and deleted immediately after processing/response, including failure paths. Never expose permanent server file URLs.

## 5. Backup and full design

Local files can be lost if a device is lost/reset, the app is uninstalled or browser data is cleared. Explain this trade-off. No cloud backup/sync is enabled by default. Full folder lifecycle, platform behavior, naming, permissions and recovery are in [18-LOCAL-STORAGE-DESIGN.md](./18-LOCAL-STORAGE-DESIGN.md).