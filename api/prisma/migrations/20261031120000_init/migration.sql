-- X Cron Jobs — baseline DDL
-- Dedicated application schema (not public). Safe for prisma migrate deploy on higher envs.

-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "xcron";

-- CreateEnum
CREATE TYPE "xcron"."JobStatus" AS ENUM ('DRAFT', 'NEEDS_REVIEW', 'PUBLISHED', 'EXPIRED', 'REJECTED', 'REMOVED');

-- CreateEnum
CREATE TYPE "xcron"."JobType" AS ENUM ('FULL_TIME', 'PART_TIME', 'CONTRACT', 'TEMPORARY', 'INTERNSHIP', 'APPRENTICESHIP', 'DAILY_WAGE');

-- CreateEnum
CREATE TYPE "xcron"."PayPeriod" AS ENUM ('MONTHLY', 'DAILY', 'HOURLY');

-- CreateEnum
CREATE TYPE "xcron"."UserStatus" AS ENUM ('GUEST', 'ACTIVE', 'DISABLED');

-- CreateTable
CREATE TABLE "xcron"."User" (
    "id" TEXT NOT NULL,
    "status" "xcron"."UserStatus" NOT NULL DEFAULT 'ACTIVE',
    "preferredLocale" TEXT NOT NULL DEFAULT 'en',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xcron"."UserIdentity" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "provider" TEXT NOT NULL,
    "providerSubject" TEXT NOT NULL,
    "verifiedAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserIdentity_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xcron"."UserPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "locationsJson" JSONB NOT NULL DEFAULT '[]',
    "radiusKm" INTEGER,
    "jobTypesJson" JSONB NOT NULL DEFAULT '[]',
    "salaryMinPaise" INTEGER,
    "salaryMaxPaise" INTEGER,
    "languagesJson" JSONB NOT NULL DEFAULT '["en","ta"]',
    "categoriesJson" JSONB NOT NULL DEFAULT '[]',
    "remotePreferred" BOOLEAN NOT NULL DEFAULT false,
    "sort" TEXT NOT NULL DEFAULT 'newest',
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserPreference_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xcron"."Employer" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "verificationStatus" TEXT NOT NULL DEFAULT 'unverified',
    "ownerUserId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Employer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xcron"."EmployerMember" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL DEFAULT 'staff',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "EmployerMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xcron"."Job" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "status" "xcron"."JobStatus" NOT NULL DEFAULT 'DRAFT',
    "contentLanguage" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "jobType" "xcron"."JobType" NOT NULL,
    "country" TEXT NOT NULL DEFAULT 'India',
    "state" TEXT NOT NULL,
    "district" TEXT NOT NULL,
    "city" TEXT NOT NULL,
    "locality" TEXT,
    "remote" BOOLEAN NOT NULL DEFAULT false,
    "salaryMinPaise" INTEGER,
    "salaryMaxPaise" INTEGER,
    "salaryCurrency" TEXT NOT NULL DEFAULT 'INR',
    "salaryPeriod" "xcron"."PayPeriod",
    "salaryNegotiable" BOOLEAN NOT NULL DEFAULT false,
    "experienceLabel" TEXT,
    "vacancies" INTEGER,
    "workSchedule" TEXT,
    "skillsJson" JSONB NOT NULL DEFAULT '[]',
    "about" TEXT NOT NULL,
    "responsibilitiesJson" JSONB NOT NULL DEFAULT '[]',
    "requirementsJson" JSONB NOT NULL DEFAULT '[]',
    "benefitsJson" JSONB NOT NULL DEFAULT '[]',
    "publishedAt" TIMESTAMP(3),
    "expiresAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Job_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xcron"."SavedJob" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SavedJob_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xcron"."Subscription" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "planId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'active',
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3) NOT NULL,
    "gatewayOrderId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Subscription_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xcron"."JobContactSecret" (
    "id" TEXT NOT NULL,
    "jobId" TEXT NOT NULL,
    "encryptedPhone" TEXT,
    "encryptedEmail" TEXT,
    "encryptedLinks" TEXT,
    "keyVersion" INTEGER NOT NULL DEFAULT 1,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "JobContactSecret_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xcron"."JobSource" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "storageKey" TEXT NOT NULL,
    "sourceType" TEXT NOT NULL,
    "checksum" TEXT,
    "uploadedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "JobSource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xcron"."ImportBatch" (
    "id" TEXT NOT NULL,
    "employerId" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "totalRecords" INTEGER NOT NULL DEFAULT 0,
    "processedRecords" INTEGER NOT NULL DEFAULT 0,
    "errorCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ImportBatch_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xcron"."ImportRecord" (
    "id" TEXT NOT NULL,
    "batchId" TEXT NOT NULL,
    "sourceLocator" TEXT,
    "extractionJson" JSONB,
    "confidence" DOUBLE PRECISION,
    "dedupeStatus" TEXT NOT NULL DEFAULT 'pending',
    "reviewStatus" TEXT NOT NULL DEFAULT 'needs_review',
    "jobId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ImportRecord_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xcron"."Payment" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "gateway" TEXT NOT NULL,
    "gatewayOrderId" TEXT NOT NULL,
    "gatewayPaymentId" TEXT,
    "amountPaise" INTEGER NOT NULL,
    "currency" TEXT NOT NULL DEFAULT 'INR',
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Payment_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xcron"."Entitlement" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobId" TEXT,
    "planId" TEXT,
    "scope" TEXT NOT NULL,
    "validFrom" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "validUntil" TIMESTAMP(3),
    "status" TEXT NOT NULL DEFAULT 'active',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Entitlement_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xcron"."AuditEvent" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "entityType" TEXT NOT NULL,
    "entityId" TEXT NOT NULL,
    "metadata" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AuditEvent_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xcron"."Language" (
    "code" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "nativeName" TEXT NOT NULL,
    "enabled" BOOLEAN NOT NULL DEFAULT true,
    "sortOrder" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Language_pkey" PRIMARY KEY ("code")
);

-- CreateTable
CREATE TABLE "xcron"."UiString" (
    "id" TEXT NOT NULL,
    "languageCode" TEXT NOT NULL,
    "key" TEXT NOT NULL,
    "value" TEXT NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UiString_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "xcron"."SiteConfig" (
    "key" TEXT NOT NULL,
    "value" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "SiteConfig_pkey" PRIMARY KEY ("key")
);

-- CreateIndex
CREATE INDEX "UserIdentity_userId_idx" ON "xcron"."UserIdentity"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserIdentity_provider_providerSubject_key" ON "xcron"."UserIdentity"("provider", "providerSubject");

-- CreateIndex
CREATE UNIQUE INDEX "UserPreference_userId_key" ON "xcron"."UserPreference"("userId");

-- CreateIndex
CREATE INDEX "Employer_ownerUserId_idx" ON "xcron"."Employer"("ownerUserId");

-- CreateIndex
CREATE UNIQUE INDEX "EmployerMember_employerId_userId_key" ON "xcron"."EmployerMember"("employerId", "userId");

-- CreateIndex
CREATE INDEX "EmployerMember_userId_idx" ON "xcron"."EmployerMember"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Job_slug_key" ON "xcron"."Job"("slug");

-- CreateIndex
CREATE INDEX "Job_employerId_idx" ON "xcron"."Job"("employerId");

-- CreateIndex
CREATE INDEX "Job_status_publishedAt_idx" ON "xcron"."Job"("status", "publishedAt");

-- CreateIndex
CREATE INDEX "Job_city_district_state_idx" ON "xcron"."Job"("city", "district", "state");

-- CreateIndex
CREATE INDEX "Job_jobType_category_contentLanguage_idx" ON "xcron"."Job"("jobType", "category", "contentLanguage");

-- CreateIndex
CREATE INDEX "SavedJob_userId_idx" ON "xcron"."SavedJob"("userId");

-- CreateIndex
CREATE INDEX "SavedJob_jobId_idx" ON "xcron"."SavedJob"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "SavedJob_userId_jobId_key" ON "xcron"."SavedJob"("userId", "jobId");

-- CreateIndex
CREATE INDEX "Subscription_userId_status_idx" ON "xcron"."Subscription"("userId", "status");

-- CreateIndex
CREATE UNIQUE INDEX "JobContactSecret_jobId_key" ON "xcron"."JobContactSecret"("jobId");

-- CreateIndex
CREATE INDEX "JobSource_employerId_idx" ON "xcron"."JobSource"("employerId");

-- CreateIndex
CREATE INDEX "ImportBatch_employerId_idx" ON "xcron"."ImportBatch"("employerId");

-- CreateIndex
CREATE INDEX "ImportBatch_status_idx" ON "xcron"."ImportBatch"("status");

-- CreateIndex
CREATE INDEX "ImportRecord_batchId_idx" ON "xcron"."ImportRecord"("batchId");

-- CreateIndex
CREATE INDEX "ImportRecord_jobId_idx" ON "xcron"."ImportRecord"("jobId");

-- CreateIndex
CREATE UNIQUE INDEX "Payment_gatewayOrderId_key" ON "xcron"."Payment"("gatewayOrderId");

-- CreateIndex
CREATE INDEX "Payment_userId_idx" ON "xcron"."Payment"("userId");

-- CreateIndex
CREATE INDEX "Entitlement_userId_jobId_status_idx" ON "xcron"."Entitlement"("userId", "jobId", "status");

-- CreateIndex
CREATE INDEX "AuditEvent_entityType_entityId_idx" ON "xcron"."AuditEvent"("entityType", "entityId");

-- CreateIndex
CREATE INDEX "AuditEvent_actorId_idx" ON "xcron"."AuditEvent"("actorId");

-- CreateIndex
CREATE INDEX "AuditEvent_createdAt_idx" ON "xcron"."AuditEvent"("createdAt");

-- CreateIndex
CREATE INDEX "UiString_languageCode_idx" ON "xcron"."UiString"("languageCode");

-- CreateIndex
CREATE UNIQUE INDEX "UiString_languageCode_key_key" ON "xcron"."UiString"("languageCode", "key");

-- AddForeignKey
ALTER TABLE "xcron"."UserIdentity" ADD CONSTRAINT "UserIdentity_userId_fkey" FOREIGN KEY ("userId") REFERENCES "xcron"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xcron"."UserPreference" ADD CONSTRAINT "UserPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "xcron"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xcron"."Employer" ADD CONSTRAINT "Employer_ownerUserId_fkey" FOREIGN KEY ("ownerUserId") REFERENCES "xcron"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xcron"."EmployerMember" ADD CONSTRAINT "EmployerMember_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "xcron"."Employer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xcron"."EmployerMember" ADD CONSTRAINT "EmployerMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "xcron"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xcron"."Job" ADD CONSTRAINT "Job_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "xcron"."Employer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xcron"."SavedJob" ADD CONSTRAINT "SavedJob_userId_fkey" FOREIGN KEY ("userId") REFERENCES "xcron"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xcron"."SavedJob" ADD CONSTRAINT "SavedJob_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "xcron"."Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xcron"."Subscription" ADD CONSTRAINT "Subscription_userId_fkey" FOREIGN KEY ("userId") REFERENCES "xcron"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xcron"."JobContactSecret" ADD CONSTRAINT "JobContactSecret_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "xcron"."Job"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xcron"."JobSource" ADD CONSTRAINT "JobSource_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "xcron"."Employer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xcron"."ImportBatch" ADD CONSTRAINT "ImportBatch_employerId_fkey" FOREIGN KEY ("employerId") REFERENCES "xcron"."Employer"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xcron"."ImportRecord" ADD CONSTRAINT "ImportRecord_batchId_fkey" FOREIGN KEY ("batchId") REFERENCES "xcron"."ImportBatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xcron"."ImportRecord" ADD CONSTRAINT "ImportRecord_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "xcron"."Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xcron"."Payment" ADD CONSTRAINT "Payment_userId_fkey" FOREIGN KEY ("userId") REFERENCES "xcron"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xcron"."Entitlement" ADD CONSTRAINT "Entitlement_userId_fkey" FOREIGN KEY ("userId") REFERENCES "xcron"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xcron"."Entitlement" ADD CONSTRAINT "Entitlement_jobId_fkey" FOREIGN KEY ("jobId") REFERENCES "xcron"."Job"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xcron"."AuditEvent" ADD CONSTRAINT "AuditEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "xcron"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "xcron"."UiString" ADD CONSTRAINT "UiString_languageCode_fkey" FOREIGN KEY ("languageCode") REFERENCES "xcron"."Language"("code") ON DELETE CASCADE ON UPDATE CASCADE;
