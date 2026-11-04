-- Seeker retention + job geo / walk-in + employer profile fields
-- Higher envs: apply via prisma migrate deploy so JOBS_STORE=prisma can store/retrieve.

ALTER TABLE "xcron"."Employer"
  ADD COLUMN IF NOT EXISTS "slug" TEXT,
  ADD COLUMN IF NOT EXISTS "about" TEXT,
  ADD COLUMN IF NOT EXISTS "logoUrl" TEXT;

CREATE UNIQUE INDEX IF NOT EXISTS "Employer_slug_key" ON "xcron"."Employer"("slug");

ALTER TABLE "xcron"."Job"
  ADD COLUMN IF NOT EXISTS "lat" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "lng" DOUBLE PRECISION,
  ADD COLUMN IF NOT EXISTS "walkInAt" TIMESTAMP(3),
  ADD COLUMN IF NOT EXISTS "applyBy" TIMESTAMP(3);

CREATE INDEX IF NOT EXISTS "Job_walkInAt_idx" ON "xcron"."Job"("walkInAt");

CREATE TABLE IF NOT EXISTS "xcron"."SeekerProfile" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "displayName" TEXT,
  "experienceBand" TEXT,
  "skillsJson" JSONB NOT NULL DEFAULT '[]',
  "preferredCitiesJson" JSONB NOT NULL DEFAULT '[]',
  "openToWork" BOOLEAN NOT NULL DEFAULT true,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SeekerProfile_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "SeekerProfile_userId_key" ON "xcron"."SeekerProfile"("userId");

CREATE TABLE IF NOT EXISTS "xcron"."SeekerApplication" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "jobId" TEXT NOT NULL,
  "status" TEXT NOT NULL DEFAULT 'contacted',
  "channel" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SeekerApplication_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "SeekerApplication_userId_jobId_key" ON "xcron"."SeekerApplication"("userId", "jobId");
CREATE INDEX IF NOT EXISTS "SeekerApplication_userId_idx" ON "xcron"."SeekerApplication"("userId");
CREATE INDEX IF NOT EXISTS "SeekerApplication_jobId_idx" ON "xcron"."SeekerApplication"("jobId");

CREATE TABLE IF NOT EXISTS "xcron"."HiddenJob" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "jobId" TEXT NOT NULL,
  "employerId" TEXT,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "HiddenJob_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX IF NOT EXISTS "HiddenJob_userId_jobId_key" ON "xcron"."HiddenJob"("userId", "jobId");
CREATE INDEX IF NOT EXISTS "HiddenJob_userId_idx" ON "xcron"."HiddenJob"("userId");
CREATE INDEX IF NOT EXISTS "HiddenJob_jobId_idx" ON "xcron"."HiddenJob"("jobId");
CREATE INDEX IF NOT EXISTS "HiddenJob_employerId_idx" ON "xcron"."HiddenJob"("employerId");

CREATE TABLE IF NOT EXISTS "xcron"."SavedSearch" (
  "id" TEXT NOT NULL,
  "userId" TEXT NOT NULL,
  "name" TEXT NOT NULL,
  "queryJson" JSONB NOT NULL DEFAULT '{}',
  "alertEnabled" BOOLEAN NOT NULL DEFAULT false,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL,
  CONSTRAINT "SavedSearch_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "SavedSearch_userId_idx" ON "xcron"."SavedSearch"("userId");
CREATE INDEX IF NOT EXISTS "SavedSearch_alertEnabled_idx" ON "xcron"."SavedSearch"("alertEnabled");

DO $$ BEGIN
  ALTER TABLE "xcron"."SeekerProfile"
    ADD CONSTRAINT "SeekerProfile_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "xcron"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "xcron"."SeekerApplication"
    ADD CONSTRAINT "SeekerApplication_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "xcron"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "xcron"."SeekerApplication"
    ADD CONSTRAINT "SeekerApplication_jobId_fkey"
    FOREIGN KEY ("jobId") REFERENCES "xcron"."Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "xcron"."HiddenJob"
    ADD CONSTRAINT "HiddenJob_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "xcron"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "xcron"."HiddenJob"
    ADD CONSTRAINT "HiddenJob_jobId_fkey"
    FOREIGN KEY ("jobId") REFERENCES "xcron"."Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE "xcron"."SavedSearch"
    ADD CONSTRAINT "SavedSearch_userId_fkey"
    FOREIGN KEY ("userId") REFERENCES "xcron"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
EXCEPTION WHEN duplicate_object THEN NULL;
END $$;
