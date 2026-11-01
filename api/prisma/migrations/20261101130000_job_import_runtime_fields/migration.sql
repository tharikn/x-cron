-- Runtime fields needed for JOBS_STORE=prisma (JobRecord + ImportBatch parity)

ALTER TABLE "xcron"."Job" ADD COLUMN "effectiveFrom" TIMESTAMP(3);
ALTER TABLE "xcron"."Job" ADD COLUMN "priority" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "xcron"."Job" ADD COLUMN "reportCount" INTEGER NOT NULL DEFAULT 0;
ALTER TABLE "xcron"."Job" ADD COLUMN "moderationNote" TEXT;
ALTER TABLE "xcron"."Job" ADD COLUMN "ownerUserId" TEXT;

CREATE INDEX "Job_ownerUserId_idx" ON "xcron"."Job"("ownerUserId");

ALTER TABLE "xcron"."ImportBatch" ADD COLUMN "ownerUserId" TEXT NOT NULL DEFAULT '';
ALTER TABLE "xcron"."ImportBatch" ADD COLUMN "employerName" TEXT NOT NULL DEFAULT '';
ALTER TABLE "xcron"."ImportBatch" ADD COLUMN "sourceType" TEXT NOT NULL DEFAULT 'unknown';
ALTER TABLE "xcron"."ImportBatch" ADD COLUMN "filename" TEXT NOT NULL DEFAULT '';
ALTER TABLE "xcron"."ImportBatch" ADD COLUMN "warningsJson" JSONB NOT NULL DEFAULT '[]';

CREATE INDEX "ImportBatch_ownerUserId_idx" ON "xcron"."ImportBatch"("ownerUserId");

ALTER TABLE "xcron"."ImportRecord" ADD COLUMN "error" TEXT;
