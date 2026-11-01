-- Notification devices, prefs, inbox, dispatch history, delivery logs (xcron schema)

CREATE TABLE "xcron"."DeviceRegistration" (
    "id" TEXT NOT NULL,
    "userId" TEXT,
    "deviceId" TEXT NOT NULL,
    "fcmToken" TEXT NOT NULL,
    "platform" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "lastSeenAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "DeviceRegistration_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "xcron"."NotificationPreference" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "jobAlertsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "inAppEnabled" BOOLEAN NOT NULL DEFAULT true,
    "pushAlertsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "emailAlertsEnabled" BOOLEAN NOT NULL DEFAULT true,
    "marketingEnabled" BOOLEAN NOT NULL DEFAULT false,
    "quietHoursStart" INTEGER,
    "quietHoursEnd" INTEGER,
    "dailyCap" INTEGER NOT NULL DEFAULT 20,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "NotificationPreference_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "xcron"."NotificationDispatch" (
    "id" TEXT NOT NULL,
    "triggerType" TEXT NOT NULL,
    "jobId" TEXT,
    "status" TEXT NOT NULL DEFAULT 'running',
    "matchedCount" INTEGER NOT NULL DEFAULT 0,
    "sentCount" INTEGER NOT NULL DEFAULT 0,
    "suppressedCount" INTEGER NOT NULL DEFAULT 0,
    "failedCount" INTEGER NOT NULL DEFAULT 0,
    "skippedReason" TEXT,
    "metaJson" JSONB,
    "startedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "finishedAt" TIMESTAMP(3),

    CONSTRAINT "NotificationDispatch_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "xcron"."NotificationRecord" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "template" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "dataJson" JSONB,
    "status" TEXT NOT NULL DEFAULT 'queued',
    "dedupeKey" TEXT NOT NULL,
    "jobId" TEXT,
    "dispatchId" TEXT,
    "provider" TEXT,
    "providerMessageId" TEXT,
    "error" TEXT,
    "readAt" TIMESTAMP(3),
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationRecord_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "xcron"."NotificationDelivery" (
    "id" TEXT NOT NULL,
    "dispatchId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "channel" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "provider" TEXT,
    "providerMessageId" TEXT,
    "title" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "dedupeKey" TEXT NOT NULL,
    "jobId" TEXT,
    "error" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "NotificationDelivery_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "DeviceRegistration_fcmToken_key" ON "xcron"."DeviceRegistration"("fcmToken");
CREATE INDEX "DeviceRegistration_userId_idx" ON "xcron"."DeviceRegistration"("userId");
CREATE INDEX "DeviceRegistration_deviceId_idx" ON "xcron"."DeviceRegistration"("deviceId");

CREATE UNIQUE INDEX "NotificationPreference_userId_key" ON "xcron"."NotificationPreference"("userId");

CREATE INDEX "NotificationDispatch_triggerType_startedAt_idx" ON "xcron"."NotificationDispatch"("triggerType", "startedAt");
CREATE INDEX "NotificationDispatch_jobId_idx" ON "xcron"."NotificationDispatch"("jobId");
CREATE INDEX "NotificationDispatch_status_idx" ON "xcron"."NotificationDispatch"("status");

CREATE UNIQUE INDEX "NotificationRecord_dedupeKey_key" ON "xcron"."NotificationRecord"("dedupeKey");
CREATE INDEX "NotificationRecord_userId_channel_createdAt_idx" ON "xcron"."NotificationRecord"("userId", "channel", "createdAt");
CREATE INDEX "NotificationRecord_jobId_idx" ON "xcron"."NotificationRecord"("jobId");
CREATE INDEX "NotificationRecord_dispatchId_idx" ON "xcron"."NotificationRecord"("dispatchId");

CREATE INDEX "NotificationDelivery_dispatchId_createdAt_idx" ON "xcron"."NotificationDelivery"("dispatchId", "createdAt");
CREATE INDEX "NotificationDelivery_userId_createdAt_idx" ON "xcron"."NotificationDelivery"("userId", "createdAt");
CREATE INDEX "NotificationDelivery_channel_status_idx" ON "xcron"."NotificationDelivery"("channel", "status");

ALTER TABLE "xcron"."DeviceRegistration" ADD CONSTRAINT "DeviceRegistration_userId_fkey" FOREIGN KEY ("userId") REFERENCES "xcron"."User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "xcron"."NotificationPreference" ADD CONSTRAINT "NotificationPreference_userId_fkey" FOREIGN KEY ("userId") REFERENCES "xcron"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "xcron"."NotificationRecord" ADD CONSTRAINT "NotificationRecord_userId_fkey" FOREIGN KEY ("userId") REFERENCES "xcron"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "xcron"."NotificationRecord" ADD CONSTRAINT "NotificationRecord_dispatchId_fkey" FOREIGN KEY ("dispatchId") REFERENCES "xcron"."NotificationDispatch"("id") ON DELETE SET NULL ON UPDATE CASCADE;
ALTER TABLE "xcron"."NotificationDelivery" ADD CONSTRAINT "NotificationDelivery_dispatchId_fkey" FOREIGN KEY ("dispatchId") REFERENCES "xcron"."NotificationDispatch"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "xcron"."NotificationDelivery" ADD CONSTRAINT "NotificationDelivery_userId_fkey" FOREIGN KEY ("userId") REFERENCES "xcron"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
