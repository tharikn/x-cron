-- Persist auth users + refresh sessions so mobile stays signed-in for push across API restarts.

ALTER TABLE "xcron"."User"
  ADD COLUMN IF NOT EXISTS "displayName" TEXT,
  ADD COLUMN IF NOT EXISTS "phone" TEXT,
  ADD COLUMN IF NOT EXISTS "email" TEXT,
  ADD COLUMN IF NOT EXISTS "rolesJson" JSONB NOT NULL DEFAULT '["seeker"]';

CREATE INDEX IF NOT EXISTS "User_email_idx" ON "xcron"."User"("email");
CREATE INDEX IF NOT EXISTS "User_phone_idx" ON "xcron"."User"("phone");

CREATE TABLE IF NOT EXISTS "xcron"."AuthSession" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "accessToken" TEXT NOT NULL,
    "refreshToken" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "refreshExpiresAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuthSession_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "AuthSession_accessToken_key" ON "xcron"."AuthSession"("accessToken");
CREATE UNIQUE INDEX IF NOT EXISTS "AuthSession_refreshToken_key" ON "xcron"."AuthSession"("refreshToken");
CREATE INDEX IF NOT EXISTS "AuthSession_userId_idx" ON "xcron"."AuthSession"("userId");
CREATE INDEX IF NOT EXISTS "AuthSession_refreshExpiresAt_idx" ON "xcron"."AuthSession"("refreshExpiresAt");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'AuthSession_userId_fkey'
  ) THEN
    ALTER TABLE "xcron"."AuthSession"
      ADD CONSTRAINT "AuthSession_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "xcron"."User"("id")
      ON DELETE CASCADE ON UPDATE CASCADE;
  END IF;
END $$;
