-- Recruiter job analytics: listing view events (once per viewerKey per UTC day)
CREATE TABLE "xcron"."JobViewEvent" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "viewerKey" TEXT NOT NULL,
    "day" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobViewEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "JobViewEvent_jobId_viewerKey_day_key" ON "xcron"."JobViewEvent"("jobId", "viewerKey", "day");

CREATE INDEX "JobViewEvent_jobId_day_idx" ON "xcron"."JobViewEvent"("jobId", "day");

ALTER TABLE "xcron"."JobViewEvent" ADD CONSTRAINT "JobViewEvent_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "xcron"."Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
