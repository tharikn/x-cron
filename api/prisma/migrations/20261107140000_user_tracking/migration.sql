-- Auth session forensics (IP / UA / last seen)
ALTER TABLE "xcron"."AuthSession" ADD COLUMN IF NOT EXISTS "ip" TEXT;
ALTER TABLE "xcron"."AuthSession" ADD COLUMN IF NOT EXISTS "userAgent" TEXT;
ALTER TABLE "xcron"."AuthSession" ADD COLUMN IF NOT EXISTS "lastSeenAt" TIMESTAMP(3);

-- Product analytics events for admin user-tracking desk
CREATE TABLE IF NOT EXISTS "xcron"."TrackingEvent" (
    "id" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "userId" TEXT,
    "visitorKey" TEXT,
    "jobId" TEXT,
    "path" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "durationMs" INTEGER,
    "metaJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "TrackingEvent_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "TrackingEvent_userId_createdAt_idx" ON "xcron"."TrackingEvent"("userId", "createdAt");
CREATE INDEX IF NOT EXISTS "TrackingEvent_visitorKey_createdAt_idx" ON "xcron"."TrackingEvent"("visitorKey", "createdAt");
CREATE INDEX IF NOT EXISTS "TrackingEvent_type_createdAt_idx" ON "xcron"."TrackingEvent"("type", "createdAt");
CREATE INDEX IF NOT EXISTS "TrackingEvent_createdAt_idx" ON "xcron"."TrackingEvent"("createdAt");

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_constraint WHERE conname = 'TrackingEvent_userId_fkey'
  ) THEN
    ALTER TABLE "xcron"."TrackingEvent"
      ADD CONSTRAINT "TrackingEvent_userId_fkey"
      FOREIGN KEY ("userId") REFERENCES "xcron"."User"("id")
      ON DELETE SET NULL ON UPDATE CASCADE;
  END IF;
END $$;
