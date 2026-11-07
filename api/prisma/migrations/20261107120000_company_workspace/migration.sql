-- Company workspace fields + team membership, invitations, verification, internal notes, interviews

ALTER TABLE "xcron"."Employer"
  ADD COLUMN IF NOT EXISTS "legalName" TEXT,
  ADD COLUMN IF NOT EXISTS "website" TEXT,
  ADD COLUMN IF NOT EXISTS "verifiedEmailDomain" TEXT,
  ADD COLUMN IF NOT EXISTS "industry" TEXT,
  ADD COLUMN IF NOT EXISTS "sizeBand" TEXT,
  ADD COLUMN IF NOT EXISTS "headquarters" TEXT,
  ADD COLUMN IF NOT EXISTS "hiringLocationsJson" TEXT NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "verificationNotes" TEXT,
  ADD COLUMN IF NOT EXISTS "trustTier" TEXT NOT NULL DEFAULT 'standard',
  ADD COLUMN IF NOT EXISTS "riskFlagsJson" TEXT NOT NULL DEFAULT '[]',
  ADD COLUMN IF NOT EXISTS "workspaceSettingsJson" TEXT NOT NULL DEFAULT '{}';

ALTER TABLE "xcron"."EmployerMember"
  ADD COLUMN IF NOT EXISTS "status" TEXT NOT NULL DEFAULT 'active',
  ADD COLUMN IF NOT EXISTS "invitedByUserId" TEXT,
  ADD COLUMN IF NOT EXISTS "joinedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "revokedAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "savedFiltersJson" TEXT NOT NULL DEFAULT '{}',
  ADD COLUMN IF NOT EXISTS "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Backfill owner membership rows for existing employers (idempotent via unique).
INSERT INTO "xcron"."EmployerMember" ("id", "employerId", "userId", "role", "status", "joinedAt", "createdAt", "updatedAt", "savedFiltersJson")
SELECT
  gen_random_uuid()::text,
  e."id",
  e."ownerUserId",
  'owner',
  'active',
  e."createdAt",
  e."createdAt",
  CURRENT_TIMESTAMP,
  '{}'
FROM "xcron"."Employer" e
WHERE NOT EXISTS (
  SELECT 1 FROM "xcron"."EmployerMember" m
  WHERE m."employerId" = e."id" AND m."userId" = e."ownerUserId"
);

CREATE INDEX IF NOT EXISTS "EmployerMember_employerId_status_idx"
  ON "xcron"."EmployerMember"("employerId", "status");

CREATE TABLE IF NOT EXISTS "xcron"."EmployerInvitation" (
  "id" TEXT NOT NULL,
  "employerId" TEXT NOT NULL,
  "email" TEXT NOT NULL,
  "role" TEXT NOT NULL DEFAULT 'recruiter',
  "token" TEXT NOT NULL,
  "invitedByUserId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'pending',
  "expiresAt" TIMESTAMP(3) NOT NULL,
  "acceptedAt" TIMESTAMP(3),
  "revokedAt" TIMESTAMP(3),
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EmployerInvitation_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "EmployerInvitation_token_key" ON "xcron"."EmployerInvitation"("token");
CREATE INDEX IF NOT EXISTS "EmployerInvitation_employerId_status_idx" ON "xcron"."EmployerInvitation"("employerId", "status");
CREATE INDEX IF NOT EXISTS "EmployerInvitation_email_idx" ON "xcron"."EmployerInvitation"("email");

ALTER TABLE "xcron"."EmployerInvitation"
  DROP CONSTRAINT IF EXISTS "EmployerInvitation_employerId_fkey";
ALTER TABLE "xcron"."EmployerInvitation"
  ADD CONSTRAINT "EmployerInvitation_employerId_fkey"
  FOREIGN KEY ("employerId") REFERENCES "xcron"."Employer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "xcron"."EmployerVerificationEvidence" (
  "id" TEXT NOT NULL,
  "employerId" TEXT NOT NULL,
  "kind" TEXT NOT NULL,
  "label" TEXT NOT NULL,
  "reference" TEXT NOT NULL,
  "submittedBy" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EmployerVerificationEvidence_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "EmployerVerificationEvidence_employerId_idx"
  ON "xcron"."EmployerVerificationEvidence"("employerId");

ALTER TABLE "xcron"."EmployerVerificationEvidence"
  DROP CONSTRAINT IF EXISTS "EmployerVerificationEvidence_employerId_fkey";
ALTER TABLE "xcron"."EmployerVerificationEvidence"
  ADD CONSTRAINT "EmployerVerificationEvidence_employerId_fkey"
  FOREIGN KEY ("employerId") REFERENCES "xcron"."Employer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "xcron"."EmployerVerificationAudit" (
  "id" TEXT NOT NULL,
  "employerId" TEXT NOT NULL,
  "actorUserId" TEXT NOT NULL,
  "action" TEXT NOT NULL,
  "detail" TEXT NOT NULL DEFAULT '',
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EmployerVerificationAudit_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "EmployerVerificationAudit_employerId_createdAt_idx"
  ON "xcron"."EmployerVerificationAudit"("employerId", "createdAt");

ALTER TABLE "xcron"."EmployerVerificationAudit"
  DROP CONSTRAINT IF EXISTS "EmployerVerificationAudit_employerId_fkey";
ALTER TABLE "xcron"."EmployerVerificationAudit"
  ADD CONSTRAINT "EmployerVerificationAudit_employerId_fkey"
  FOREIGN KEY ("employerId") REFERENCES "xcron"."Employer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "xcron"."CompanyInternalNote" (
  "id" TEXT NOT NULL,
  "employerId" TEXT NOT NULL,
  "applicationId" TEXT,
  "body" TEXT NOT NULL,
  "authorUserId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "CompanyInternalNote_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "CompanyInternalNote_employerId_applicationId_idx"
  ON "xcron"."CompanyInternalNote"("employerId", "applicationId");

ALTER TABLE "xcron"."CompanyInternalNote"
  DROP CONSTRAINT IF EXISTS "CompanyInternalNote_employerId_fkey";
ALTER TABLE "xcron"."CompanyInternalNote"
  ADD CONSTRAINT "CompanyInternalNote_employerId_fkey"
  FOREIGN KEY ("employerId") REFERENCES "xcron"."Employer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

CREATE TABLE IF NOT EXISTS "xcron"."CompanyInterview" (
  "id" TEXT NOT NULL,
  "employerId" TEXT NOT NULL,
  "applicationId" TEXT NOT NULL,
  "scheduledAt" TEXT NOT NULL,
  "mode" TEXT NOT NULL DEFAULT 'video',
  "locationOrLink" TEXT NOT NULL DEFAULT '',
  "notes" TEXT NOT NULL DEFAULT '',
  "status" TEXT NOT NULL DEFAULT 'scheduled',
  "createdByUserId" TEXT NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "CompanyInterview_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "CompanyInterview_employerId_applicationId_idx"
  ON "xcron"."CompanyInterview"("employerId", "applicationId");
CREATE INDEX IF NOT EXISTS "CompanyInterview_scheduledAt_idx"
  ON "xcron"."CompanyInterview"("scheduledAt");

ALTER TABLE "xcron"."CompanyInterview"
  DROP CONSTRAINT IF EXISTS "CompanyInterview_employerId_fkey";
ALTER TABLE "xcron"."CompanyInterview"
  ADD CONSTRAINT "CompanyInterview_employerId_fkey"
  FOREIGN KEY ("employerId") REFERENCES "xcron"."Employer"("id") ON DELETE CASCADE ON UPDATE CASCADE;
