# CLAUDE.md — `api/src/ingestion/` (bulk import batches)

Admin/employer **import-batch** pipeline: upload → parse → review → approve → jobs as `needs-review`.

Parent: [../CLAUDE.md](../../CLAUDE.md) · free partner/feed paths: [../integrations/CLAUDE.md](../integrations/CLAUDE.md)

## Endpoints

| Method | Path | Notes |
| --- | --- | --- |
| `GET` | `/v1/import-batches/template.csv` · `template.xlsx` | Public column templates |
| `POST` | `/v1/import-batches` | Create batch (`@Roles('admin')`) |
| `POST` | `/v1/import-batches/:id/uploads` | Multipart file (`sourceType=csv\|excel\|…`) |
| `POST` | `/v1/import-batches/:id/uploads/text` | Pasted WhatsApp/text |
| `GET` | `/v1/import-batches/:id/records` | Review rows |
| `POST` | `/v1/import-batches/:id/approve` | Publish selected records |

Store follows `JOBS_STORE` (memory / Prisma). Prisma update uses chunked `createMany` + long interactive txn for large batches.

## Parsers

| Parser | File | Notes |
| --- | --- | --- |
| CSV | `parsers/csv.parser.ts` | Canonical columns + `externalJobId`; **RFC4180 quoted newlines** (multiline `description` stays one row) |
| Excel | `parsers/excel.parser.ts` | SheetJS → CSV text → same mapper |
| Text | `parsers/text.parser.ts` | WhatsApp / telegram paste |
| OCR | `parsers/image-ocr.parser.ts` | Image/PDF stub unless OCR wired |

After parse, `applyParseResult` runs optional AI enrich (`AI_ENRICH_*`) then **O(1) within-batch title\|city Set dedupe** + `jobsStore.findActiveDuplicate` per draft.

## Agent rules

- Do not invent contacts in public descriptions.
- Keep CSV/Excel column aliases backward-compatible when adding fields.
- Quoted multiline cells must remain one record — never `split(/\n/)` the raw file for row boundaries.
- After changes: this file + `docs/DEVELOPER.md` (R2 ingestion) + `docs/FILE_MAP.md` when files move.
