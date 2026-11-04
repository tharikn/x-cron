-- Performance Score (seeker + employer) + apply-time match %

CREATE TABLE "xcron"."UserReputation" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "score" INTEGER NOT NULL DEFAULT 50,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "UserReputation_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "xcron"."ReputationEvent" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "role" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "delta" INTEGER NOT NULL,
    "scoreAfter" INTEGER NOT NULL,
    "applicationId" TEXT,
    "jobId" TEXT,
    "matchPercent" INTEGER,
    "note" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ReputationEvent_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "UserReputation_userId_role_key" ON "xcron"."UserReputation"("userId", "role");
CREATE INDEX "UserReputation_score_idx" ON "xcron"."UserReputation"("score");
CREATE INDEX "ReputationEvent_userId_role_createdAt_idx" ON "xcron"."ReputationEvent"("userId", "role", "createdAt");
CREATE INDEX "ReputationEvent_type_createdAt_idx" ON "xcron"."ReputationEvent"("type", "createdAt");

ALTER TABLE "xcron"."UserReputation" ADD CONSTRAINT "UserReputation_userId_fkey" FOREIGN KEY ("userId") REFERENCES "xcron"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "xcron"."ReputationEvent" ADD CONSTRAINT "ReputationEvent_userId_fkey" FOREIGN KEY ("userId") REFERENCES "xcron"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "xcron"."JobApplication" ADD COLUMN "matchPercent" INTEGER;
