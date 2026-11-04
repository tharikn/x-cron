-- Optional employer screening question + seeker answer (anti mass-apply friction).
ALTER TABLE "xcron"."Job"
  ADD COLUMN IF NOT EXISTS "screeningQuestion" TEXT;

ALTER TABLE "xcron"."JobApplication"
  ADD COLUMN IF NOT EXISTS "screeningAnswer" TEXT;
