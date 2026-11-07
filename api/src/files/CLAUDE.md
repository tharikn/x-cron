# CLAUDE.md — `api/src/files/`

Object-storage seam (doc 01 topology). Strategy/Adapter for local disk, stub memory, and S3-compatible (local mirror until AWS SDK wired).

## Env

| Key | Default | Notes |
| --- | --- | --- |
| `FILE_STORAGE` | `local` | `local` \| `s3` \| `stub` |
| `FILE_LOCAL_DIR` | `api/uploads` | Absolute or cwd-relative |
| `FILE_S3_BUCKET` | — | Required when `FILE_STORAGE=s3` (validated at boot) |
| `FILE_S3_REGION` / `FILE_S3_ENDPOINT` | — | Reserved for SDK wiring |

## Endpoints

- `POST /v1/files` — multipart `file` (auth). Max 5MB; jpeg/png/webp/pdf/txt/csv.
- `GET /v1/files/:id` — owner-only download.

Metadata in Prisma `StoredFile` when `JOBS_STORE=prisma`. Blobs never go in Postgres.

## Agent rules

- Do not store resume/PII blobs in Redis or notification payloads.
- Keep virus-scan / malware checks as a future worker (outbox topic) — not inline in the request path for MVP.
