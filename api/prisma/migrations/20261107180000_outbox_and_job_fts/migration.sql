-- Transactional outbox + Phase-1 Postgres full-text / trigram search (doc 01 §5–6).

CREATE TABLE IF NOT EXISTS "xcron"."OutboxEvent" (
    "id" TEXT NOT NULL,
    "topic" TEXT NOT NULL,
    "payloadJson" JSONB NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'pending',
    "attempts" INTEGER NOT NULL DEFAULT 0,
    "availableAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "processedAt" TIMESTAMP(3),
    "lastError" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "OutboxEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "OutboxEvent_status_availableAt_idx"
  ON "xcron"."OutboxEvent"("status", "availableAt");
CREATE INDEX IF NOT EXISTS "OutboxEvent_topic_createdAt_idx"
  ON "xcron"."OutboxEvent"("topic", "createdAt");

CREATE TABLE IF NOT EXISTS "xcron"."StoredFile" (
    "id" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "originalName" TEXT NOT NULL,
    "mimeType" TEXT NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "storageKey" TEXT NOT NULL,
    "backend" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "StoredFile_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "StoredFile_ownerUserId_createdAt_idx"
  ON "xcron"."StoredFile"("ownerUserId", "createdAt");

ALTER TABLE "xcron"."StoredFile"
  DROP CONSTRAINT IF EXISTS "StoredFile_ownerUserId_fkey";
ALTER TABLE "xcron"."StoredFile"
  ADD CONSTRAINT "StoredFile_ownerUserId_fkey"
  FOREIGN KEY ("ownerUserId") REFERENCES "xcron"."User"("id")
  ON DELETE CASCADE ON UPDATE CASCADE;

-- Full-text / typo-tolerant search helpers (managed outside Prisma client types).
CREATE EXTENSION IF NOT EXISTS pg_trgm;

ALTER TABLE "xcron"."Job"
  ADD COLUMN IF NOT EXISTS "searchDocument" tsvector;

CREATE INDEX IF NOT EXISTS "Job_searchDocument_gin"
  ON "xcron"."Job" USING GIN ("searchDocument");

CREATE INDEX IF NOT EXISTS "Job_title_trgm"
  ON "xcron"."Job" USING GIN ("title" gin_trgm_ops);

CREATE INDEX IF NOT EXISTS "Job_city_trgm"
  ON "xcron"."Job" USING GIN ("city" gin_trgm_ops);

-- Keep searchDocument in sync on write.
CREATE OR REPLACE FUNCTION xcron.job_search_document_refresh()
RETURNS trigger AS $$
DECLARE
  employer_name text;
  skills_text text;
BEGIN
  SELECT e."name" INTO employer_name
  FROM "xcron"."Employer" e
  WHERE e."id" = NEW."employerId";

  skills_text := coalesce(NEW."skillsJson"::text, '');

  NEW."searchDocument" :=
    setweight(to_tsvector('simple', coalesce(NEW."title", '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(employer_name, '')), 'A') ||
    setweight(to_tsvector('simple', coalesce(NEW."category", '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(NEW."city", '') || ' ' || coalesce(NEW."district", '') || ' ' || coalesce(NEW."state", '')), 'B') ||
    setweight(to_tsvector('simple', coalesce(NEW."about", '')), 'C') ||
    setweight(to_tsvector('simple', skills_text), 'B');

  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS job_search_document_trg ON "xcron"."Job";
CREATE TRIGGER job_search_document_trg
  BEFORE INSERT OR UPDATE OF
    "title", "category", "city", "district", "state", "about", "skillsJson", "employerId"
  ON "xcron"."Job"
  FOR EACH ROW
  EXECUTE FUNCTION xcron.job_search_document_refresh();

-- Backfill existing rows.
UPDATE "xcron"."Job" j
SET "title" = j."title";
