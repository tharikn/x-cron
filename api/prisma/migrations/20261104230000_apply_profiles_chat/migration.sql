-- Multi-version apply profiles (no CV) + application chat + apply snapshot.

CREATE TABLE "xcron"."ApplyProfile" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "headline" TEXT,
    "summary" TEXT,
    "experienceBand" TEXT,
    "skillsJson" JSONB NOT NULL DEFAULT '[]',
    "projectsJson" JSONB NOT NULL DEFAULT '[]',
    "portfolioLinksJson" JSONB NOT NULL DEFAULT '[]',
    "isDefault" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ApplyProfile_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ApplyProfile_userId_idx" ON "xcron"."ApplyProfile"("userId");
CREATE INDEX "ApplyProfile_userId_isDefault_idx" ON "xcron"."ApplyProfile"("userId", "isDefault");

ALTER TABLE "xcron"."ApplyProfile"
  ADD CONSTRAINT "ApplyProfile_userId_fkey"
  FOREIGN KEY ("userId") REFERENCES "xcron"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "xcron"."JobApplication"
  ADD COLUMN "applyProfileId" TEXT,
  ADD COLUMN "applyProfileSnapshotJson" JSONB;

CREATE INDEX "JobApplication_applyProfileId_idx" ON "xcron"."JobApplication"("applyProfileId");

CREATE TABLE "xcron"."ApplicationMessage" (
    "id" TEXT NOT NULL,
    "applicationId" TEXT NOT NULL,
    "senderUserId" TEXT NOT NULL,
    "senderRole" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ApplicationMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ApplicationMessage_applicationId_createdAt_idx"
  ON "xcron"."ApplicationMessage"("applicationId", "createdAt");
CREATE INDEX "ApplicationMessage_senderUserId_idx"
  ON "xcron"."ApplicationMessage"("senderUserId");

ALTER TABLE "xcron"."ApplicationMessage"
  ADD CONSTRAINT "ApplicationMessage_applicationId_fkey"
  FOREIGN KEY ("applicationId") REFERENCES "xcron"."JobApplication"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "xcron"."ApplicationMessage"
  ADD CONSTRAINT "ApplicationMessage_senderUserId_fkey"
  FOREIGN KEY ("senderUserId") REFERENCES "xcron"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
