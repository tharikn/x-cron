-- Formal ATS applications + append-only timeline (apply → offer letter).

CREATE TABLE "xcron"."JobApplication" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "seekerUserId" TEXT NOT NULL,
    "ownerUserId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'applied',
    "coverNote" TEXT,
    "resumeUrl" TEXT,
    "seekerName" TEXT,
    "seekerPhone" TEXT,
    "seekerEmail" TEXT,
    "offerLetterText" TEXT,
    "viewedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobApplication_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "xcron"."ApplicationEvent" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "fromStatus" TEXT,
    "toStatus" TEXT,
    "actorUserId" TEXT,
    "actorRole" TEXT NOT NULL,
    "note" TEXT,
    "metaJson" JSONB,
    "at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "JobApplication_seekerUserId_jobId_key" ON "xcron"."JobApplication"("seekerUserId", "jobId");
CREATE INDEX "JobApplication_jobId_idx" ON "xcron"."JobApplication"("jobId");
CREATE INDEX "JobApplication_employerId_idx" ON "xcron"."JobApplication"("employerId");
CREATE INDEX "JobApplication_ownerUserId_idx" ON "xcron"."JobApplication"("ownerUserId");
CREATE INDEX "JobApplication_status_idx" ON "xcron"."JobApplication"("status");
CREATE INDEX "ApplicationEvent_applicationId_at_idx" ON "xcron"."ApplicationEvent"("applicationId", "at");
CREATE INDEX "ApplicationEvent_actorUserId_idx" ON "xcron"."ApplicationEvent"("actorUserId");

ALTER TABLE "xcron"."JobApplication"
  ADD CONSTRAINT "JobApplication_jobId_fkey"
  FOREIGN KEY ("jobId") REFERENCES "xcron"."Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "xcron"."JobApplication"
  ADD CONSTRAINT "JobApplication_seekerUserId_fkey"
  FOREIGN KEY ("seekerUserId") REFERENCES "xcron"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "xcron"."JobApplication"
  ADD CONSTRAINT "JobApplication_ownerUserId_fkey"
  FOREIGN KEY ("ownerUserId") REFERENCES "xcron"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "xcron"."ApplicationEvent"
  ADD CONSTRAINT "ApplicationEvent_applicationId_fkey"
  FOREIGN KEY ("applicationId") REFERENCES "xcron"."JobApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "xcron"."ApplicationEvent"
  ADD CONSTRAINT "ApplicationEvent_actorUserId_fkey"
  FOREIGN KEY ("actorUserId") REFERENCES "xcron"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
