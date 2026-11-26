-- Profile photo URL for seekers (binary bytes live in the upload provider).
ALTER TABLE "xcron"."SeekerProfile"
  ADD COLUMN IF NOT EXISTS "photoUrl" TEXT;
