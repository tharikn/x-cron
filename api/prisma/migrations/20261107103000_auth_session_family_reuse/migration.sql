-- Refresh-token family + revoked-refresh ledger for reuse detection.
-- Existing sessions get a per-row family id (gen_random_uuid).

ALTER TABLE "xcron"."AuthSession"
  ADD COLUMN IF NOT EXISTS "familyId" TEXT;

UPDATE "xcron"."AuthSession"
SET "familyId" = gen_random_uuid()::text
WHERE "familyId" IS NULL OR "familyId" = '';

ALTER TABLE "xcron"."AuthSession"
  ALTER COLUMN "familyId" SET NOT NULL;

CREATE INDEX IF NOT EXISTS "AuthSession_familyId_idx"
  ON "xcron"."AuthSession"("familyId");

CREATE TABLE IF NOT EXISTS "xcron"."RevokedRefreshToken" (
  "refreshToken" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "familyId" TEXT NOT NULL,
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "RevokedRefreshToken_pkey" PRIMARY KEY ("refreshToken")
);

CREATE INDEX IF NOT EXISTS "RevokedRefreshToken_familyId_idx"
  ON "xcron"."RevokedRefreshToken"("familyId");

CREATE INDEX IF NOT EXISTS "RevokedRefreshToken_expiresAt_idx"
  ON "xcron"."RevokedRefreshToken"("expiresAt");
