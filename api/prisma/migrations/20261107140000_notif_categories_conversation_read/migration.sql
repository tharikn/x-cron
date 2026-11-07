-- Notification category prefs + ATS conversation read cursors
ALTER TABLE "xcron"."NotificationPreference"
  ADD COLUMN IF NOT EXISTS "applicationUpdatesEnabled" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "recruiterMessagesEnabled" BOOLEAN NOT NULL DEFAULT true,
  ADD COLUMN IF NOT EXISTS "productAnnouncementsEnabled" BOOLEAN NOT NULL DEFAULT false;

-- Keep marketingEnabled and productAnnouncementsEnabled aligned for existing rows
UPDATE "xcron"."NotificationPreference"
SET "productAnnouncementsEnabled" = "marketingEnabled"
WHERE "marketingEnabled" = true;

ALTER TABLE "xcron"."JobApplication"
  ADD COLUMN IF NOT EXISTS "seekerLastReadAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "employerLastReadAt" TIMESTAMP(3);
