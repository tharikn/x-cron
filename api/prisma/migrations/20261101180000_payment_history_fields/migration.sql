-- Expand Payment / Entitlement for runtime orders + add PaymentHistory timeline

ALTER TABLE "xcron"."Payment" ADD COLUMN IF NOT EXISTS "jobId" TEXT;
ALTER TABLE "xcron"."Payment" ADD COLUMN IF NOT EXISTS "planId" TEXT;
ALTER TABLE "xcron"."Payment" ADD COLUMN IF NOT EXISTS "product" TEXT;

CREATE INDEX IF NOT EXISTS "Payment_jobId_idx" ON "xcron"."Payment"("jobId");
CREATE INDEX IF NOT EXISTS "Payment_status_createdAt_idx" ON "xcron"."Payment"("status", "createdAt");

ALTER TABLE "xcron"."Entitlement" ADD COLUMN IF NOT EXISTS "paymentId" TEXT;
CREATE INDEX IF NOT EXISTS "Entitlement_paymentId_idx" ON "xcron"."Entitlement"("paymentId");

CREATE TABLE IF NOT EXISTS "xcron"."PaymentHistory" (
    "id" TEXT NOT NULL,
    "status" TEXT NOT NULL,
    "reason" TEXT,
    "orderId" TEXT,
    "userId" TEXT,
    "actorId" TEXT,
    "jobId" TEXT,
    "planId" TEXT,
    "product" TEXT,
    "gateway" TEXT,
    "gatewayOrderId" TEXT,
    "gatewayPaymentId" TEXT,
    "amountPaise" INTEGER,
    "currency" TEXT,
    "ip" TEXT,
    "userAgent" TEXT,
    "metadataJson" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PaymentHistory_pkey" PRIMARY KEY ("id")
);

CREATE INDEX IF NOT EXISTS "PaymentHistory_createdAt_idx" ON "xcron"."PaymentHistory"("createdAt");
CREATE INDEX IF NOT EXISTS "PaymentHistory_status_createdAt_idx" ON "xcron"."PaymentHistory"("status", "createdAt");
CREATE INDEX IF NOT EXISTS "PaymentHistory_orderId_idx" ON "xcron"."PaymentHistory"("orderId");
CREATE INDEX IF NOT EXISTS "PaymentHistory_userId_idx" ON "xcron"."PaymentHistory"("userId");
