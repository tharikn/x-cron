-- Speed per-seeker daily apply quota counts (anti-spam).
CREATE INDEX IF NOT EXISTS "JobApplication_seekerUserId_createdAt_idx"
  ON "xcron"."JobApplication"("seekerUserId", "createdAt");
