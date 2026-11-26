# Uploaded assets (Supabase S3 / R2 / local / memory)

Scope: portfolio images and job-portal assets (company logos, profile photos, private resumes).
The implementation is isolated in `api/src/storage/` and `api/src/job-assets/`; the legacy
`/v1/files` flow is unchanged.

## Configuration

| Variable | Default | Purpose |
| :--- | :--- | :--- |
| `UPLOAD_STORAGE` | `local` | `local`, `memory` (tests), `r2`, or `supabase`. |
| `UPLOAD_LOCAL_DIR` | `uploads/storage` | Disk root for the local fallback. |
| `R2_BUCKET` | — | Required when `UPLOAD_STORAGE=r2`. |
| `R2_ENDPOINT` | — | R2 S3-compatible endpoint, e.g. `https://<account-id>.r2.cloudflarestorage.com`. |
| `R2_ACCESS_KEY_ID` / `R2_SECRET_ACCESS_KEY` | — | R2 API token with object read/write/delete. |
| `R2_REGION` | `auto` | Region for the S3 client; use `auto` for R2. |
| `SUPABASE_BUCKET` | — | Required when `UPLOAD_STORAGE=supabase`; create it in Supabase Storage first. |
| `SUPABASE_ENDPOINT` | — | S3 URL from Supabase project settings, e.g. `https://<ref>.storage.supabase.co/storage/v1/s3`. |
| `SUPABASE_ACCESS_KEY_ID` / `SUPABASE_SECRET_ACCESS_KEY` | — | Supabase S3 access keys. **Server-side only** — they bypass RLS. |
| `SUPABASE_REGION` | — | Region shown in Supabase S3 settings (used for SigV4 signing). |
| `APP_URL` | `http://localhost:<PORT||3010>` | Absolute API origin used in returned asset URLs. **Set this in deployed/mobile environments.** |

`UPLOAD_STORAGE=r2` and `UPLOAD_STORAGE=supabase` reject boot if their bucket, endpoint or
credentials are missing (Supabase also requires the region). Both use the same S3-compatible
client; see "Supabase S3" and "Adding AWS S3" below.

## Endpoints

All upload endpoints are multipart/form-data, field name `file`, and use the existing
cookie/Bearer auth.

| Endpoint | Access | Notes |
| :--- | :--- | :--- |
| `POST /v1/storage/uploads` | `seeker`, `employer`, `admin` | Single generic upload. `purpose` form field: `portfolio`, `company-logo`, `profile-photo`, `resume`. |
| `GET /v1/storage/public/:assetId/:versionName` | public | Images only. `versionName`: `original`, `thumb`, `medium`, `large`. Resumes return 404. |
| `GET /v1/storage/assets/:assetId/download` | owner | Private resume download (`Content-Disposition: attachment`). |
| `DELETE /v1/storage/assets/:assetId` | owner | Deletes metadata and all stored objects. |
| `POST /v1/portfolio/media/upload` | portfolio owner | Uploads with `purpose=portfolio` and adds the returned URL to the draft media library. |
| `DELETE /v1/portfolio/media/:assetId` | portfolio owner | Removes media and its storage asset. |
| `POST /v1/job-assets/images` | authenticated | `purpose=company-logo` or `profile-photo`; registers the asset for the job portal. |
| `POST /v1/job-assets/resumes` | authenticated | Private resume; not attached to applications. |
| `GET /v1/job-assets` | authenticated | Lists the caller's job assets. |
| `DELETE /v1/job-assets/:id` | owner | Removes the registry entry and its storage asset. |

Web and mobile keep transport and upload state out of feature pages:

- `core/services/upload-api.service.ts` — generic storage transport, used by portfolio uploads.
- `core/services/job-assets-api.service.ts` — job-portal transport (logos/photos/resumes).
- `core/hooks/use-image-upload.ts`, `use-job-image-upload.ts`, `use-resume-upload.ts` — validation,
  pending/error state and last-upload signal. Feature pages only call these hooks.

## Validation and variants

- Images: **svg, png, jpg, jpeg only**, **5 MB maximum**. Extension, declared MIME and magic bytes
  must agree. The API is authoritative; the web/mobile validators mirror it for fast feedback.
- SVG is accepted only as inert markup. Scripts, event handlers, external `use` references,
  foreign objects, iframes, embeds, links and `javascript:` URLs are rejected. Variants are
  rasterised to PNG; the original is still served through the API proxy.
- Generated versions: `original` (unmodified bytes), `thumb` (320px), `medium` (1024px),
  `large` (1920px). Derivatives fit inside the box without enlargement and strip metadata.
- Resumes: **pdf, doc, docx only**, **5 MB maximum**, verified by file signature. `docx` with
  VBA macros is rejected.
- `sharp` rejects corrupt or oversized-pixel images before any variant is written.

## Security model

- Object keys are generated server-side: `{portfolio|jobs}/{owner}/{assetId}/{version}.{ext}`.
  The uploaded filename never becomes part of a key or a public URL.
- Public images are read through the API proxy, never from a direct bucket URL. Responses set
  `X-Content-Type-Options: nosniff`, a restrictive `Content-Security-Policy` and an immutable
  cache header. SVG receives `sandbox; default-src 'none'`.
- Resumes are private and owner-only at both the metadata and object layers. They use
  `Cache-Control: private, no-store`, an attachment disposition, and are deliberately absent
  from job-apply payloads (apply remains profile-version based).
- Asset ownership is checked on download and delete. Listing and delete never expose another
  user's assets.
- `APP_URL` must be the real API origin so mobile clients receive reachable absolute URLs.
- Supabase buckets can stay private: the API is the only reader and serves public images through
  its own proxy with `nosniff` and CSP headers. S3 access keys never reach web/mobile clients.
- Supabase S3 does not support bucket versioning; the upload layer does not depend on it.

## Supabase S3

`SupabaseStorageProvider` (`api/src/storage/providers/supabase.storage.ts`) uses
`@aws-sdk/client-s3` with `forcePathStyle: true` because the configured endpoint already ends in
`/storage/v1/s3` and Supabase addresses objects as `{endpoint}/{bucket}/{key}`. Region must match
the one displayed in the project's S3 settings or SigV4 signing will fail.

Setup:
1. Create a bucket (e.g. `xcron-assets`) in Supabase Storage. It can remain private.
2. Generate S3 access keys in project settings and set the five `SUPABASE_*` variables above.
3. Set `UPLOAD_STORAGE=supabase` and `APP_URL` to the public API origin, then restart the API.

If access keys are ever pasted into chat, tickets or a repo, rotate them in Supabase immediately —
they grant full access to every bucket and bypass row-level security.

## Adding AWS S3

`StorageProvider` (`api/src/storage/storage.types.ts`) is the only vendor boundary. The R2 and
Supabase providers already use `@aws-sdk/client-s3`, so the usual migration is
configuration-only: point `R2_ENDPOINT` / `R2_REGION` at S3 and supply S3 credentials. If signing or endpoint
behaviour needs a distinct implementation, add `api/src/storage/providers/s3.storage.ts`
implementing `put/get/delete`, extend the `UploadStorage` enum in `env.validation.ts`, and add
one branch to `createStorageProvider()` in `storage.module.ts`. No controller, feature service,
or client change is required.

Metadata is currently an in-memory port (`UploadAssetStore` → `UploadMemoryStore`) for the MVP.
A Prisma/JSONB implementation can replace that binding without touching `UploadService`.
