-- Username + password auth for seekers/employers (no OTP).

ALTER TABLE "xcron"."User"
  ADD COLUMN IF NOT EXISTS "username" TEXT,
  ADD COLUMN IF NOT EXISTS "passwordHash" TEXT,
  ADD COLUMN IF NOT EXISTS "passwordSalt" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "User_username_key" ON "xcron"."User"("username");
