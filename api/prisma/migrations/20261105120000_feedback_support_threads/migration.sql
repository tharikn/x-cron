-- Feedback hub: Contact Admin messenger (seeker/recruiter ↔ admin)

CREATE TABLE "xcron"."FeedbackThread" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "audience" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "subject" TEXT NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'awaiting_admin',
    "lastMessageAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastSenderRole" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "closedAt" TIMESTAMP(3),

    CONSTRAINT "FeedbackThread_pkey" PRIMARY KEY ("id")
);

CREATE TABLE "xcron"."FeedbackMessage" (
    "id" TEXT NOT NULL,
    "threadId" TEXT NOT NULL,
    "senderUserId" TEXT NOT NULL,
    "senderRole" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "FeedbackMessage_pkey" PRIMARY KEY ("id")
);

CREATE INDEX "FeedbackThread_userId_lastMessageAt_idx" ON "xcron"."FeedbackThread"("userId", "lastMessageAt");
CREATE INDEX "FeedbackThread_status_lastMessageAt_idx" ON "xcron"."FeedbackThread"("status", "lastMessageAt");
CREATE INDEX "FeedbackThread_audience_status_idx" ON "xcron"."FeedbackThread"("audience", "status");
CREATE INDEX "FeedbackMessage_threadId_createdAt_idx" ON "xcron"."FeedbackMessage"("threadId", "createdAt");
CREATE INDEX "FeedbackMessage_senderUserId_idx" ON "xcron"."FeedbackMessage"("senderUserId");

ALTER TABLE "xcron"."FeedbackThread" ADD CONSTRAINT "FeedbackThread_userId_fkey" FOREIGN KEY ("userId") REFERENCES "xcron"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "xcron"."FeedbackMessage" ADD CONSTRAINT "FeedbackMessage_threadId_fkey" FOREIGN KEY ("threadId") REFERENCES "xcron"."FeedbackThread"("id") ON DELETE CASCADE ON UPDATE CASCADE;
ALTER TABLE "xcron"."FeedbackMessage" ADD CONSTRAINT "FeedbackMessage_senderUserId_fkey" FOREIGN KEY ("senderUserId") REFERENCES "xcron"."User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
