-- Velocity spam risk snapshot on formal applications (employer badge; not a hard block).
ALTER TABLE "xcron"."JobApplication"
  ADD COLUMN IF NOT EXISTS "likelySpam" BOOLEAN NOT NULL DEFAULT false;

ALTER TABLE "xcron"."JobApplication"
  ADD COLUMN IF NOT EXISTS "spamReasonsJson" JSONB NOT NULL DEFAULT '[]'::jsonb;

CREATE INDEX IF NOT EXISTS "JobApplication_likelySpam_idx"
  ON "xcron"."JobApplication"("likelySpam");
