-- Admin trust & moderation: cases, reports, trust audit, suspensions, config

CREATE TABLE "xcron"."ModerationCase" (
    "id" TEXT NOT NULL,
    "queue" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'open',
    "priority" TEXT NOT NULL DEFAULT 'normal',
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "category" TEXT,
    "details" TEXT,
    "evidenceJson" JSONB NOT NULL DEFAULT '{}',
    "riskFlagsJson" JSONB NOT NULL DEFAULT '[]',
    "riskScore" INTEGER NOT NULL DEFAULT 0,
    "dismissedRiskFlagsJson" JSONB NOT NULL DEFAULT '[]',
    "assigneeUserId" TEXT,
    "slaAt" TIMESTAMP(3),
    "decision" TEXT,
    "reasonCode" TEXT,
    "reason" TEXT,
    "decidedByUserId" TEXT,
    "decidedAt" TIMESTAMP(3),
    "relatedCaseId" TEXT,
    "feedbackThreadId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModerationCase_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "xcron"."ModerationReport" (
    "id" TEXT NOT NULL,
    "caseId" TEXT NOT NULL,
    "targetType" TEXT NOT NULL,
    "targetId" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "details" TEXT NOT NULL DEFAULT '',
    "reporterUserId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ModerationReport_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "xcron"."TrustAuditEvent" (
    "id" TEXT NOT NULL,
    "actorId" TEXT,
    "action" TEXT NOT NULL,
    "resourceType" TEXT NOT NULL,
    "resourceId" TEXT NOT NULL,
    "reason" TEXT,
    "reasonCode" TEXT,
    "correlationId" TEXT,
    "beforeJson" JSONB,
    "afterJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TrustAuditEvent_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "xcron"."AccountSuspension" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "reasonCode" TEXT NOT NULL,
    "reason" TEXT NOT NULL,
    "startsAt" TIMESTAMP(3) NOT NULL,
    "endsAt" TIMESTAMP(3),
    "actorId" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,
    "clearedAt" TIMESTAMP(3),
    "clearedByUserId" TEXT,
    "clearReason" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "AccountSuspension_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "xcron"."ModerationConfigRow" (
    "id" TEXT NOT NULL DEFAULT 'default',
    "configJson" JSONB NOT NULL,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ModerationConfigRow_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "ModerationCase_queue_status_updatedAt_idx" ON "xcron"."ModerationCase"("queue", "status", "updatedAt");
CREATE INDEX "ModerationCase_targetType_targetId_status_idx" ON "xcron"."ModerationCase"("targetType", "targetId", "status");
CREATE INDEX "ModerationCase_assigneeUserId_status_idx" ON "xcron"."ModerationCase"("assigneeUserId", "status");

CREATE INDEX "ModerationReport_caseId_createdAt_idx" ON "xcron"."ModerationReport"("caseId", "createdAt");
CREATE INDEX "ModerationReport_targetType_targetId_idx" ON "xcron"."ModerationReport"("targetType", "targetId");
CREATE INDEX "ModerationReport_reporterUserId_idx" ON "xcron"."ModerationReport"("reporterUserId");

CREATE INDEX "TrustAuditEvent_resourceType_resourceId_createdAt_idx" ON "xcron"."TrustAuditEvent"("resourceType", "resourceId", "createdAt");
CREATE INDEX "TrustAuditEvent_actorId_createdAt_idx" ON "xcron"."TrustAuditEvent"("actorId", "createdAt");
CREATE INDEX "TrustAuditEvent_createdAt_idx" ON "xcron"."TrustAuditEvent"("createdAt");

CREATE INDEX "AccountSuspension_userId_active_idx" ON "xcron"."AccountSuspension"("userId", "active");
CREATE INDEX "AccountSuspension_active_endsAt_idx" ON "xcron"."AccountSuspension"("active", "endsAt");

ALTER TABLE "xcron"."ModerationCase" ADD CONSTRAINT "ModerationCase_assigneeUserId_fkey" FOREIGN KEY ("assigneeUserId") REFERENCES "xcron"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "xcron"."ModerationReport" ADD CONSTRAINT "ModerationReport_caseId_fkey" FOREIGN KEY ("caseId") REFERENCES "xcron"."ModerationCase"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "xcron"."ModerationReport" ADD CONSTRAINT "ModerationReport_reporterUserId_fkey" FOREIGN KEY ("reporterUserId") REFERENCES "xcron"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "xcron"."TrustAuditEvent" ADD CONSTRAINT "TrustAuditEvent_actorId_fkey" FOREIGN KEY ("actorId") REFERENCES "xcron"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

ALTER TABLE "xcron"."AccountSuspension" ADD CONSTRAINT "AccountSuspension_userId_fkey" FOREIGN KEY ("userId") REFERENCES "xcron"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
