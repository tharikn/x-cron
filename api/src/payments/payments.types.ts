export type PaymentStatus =
  | 'created'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export type EntitlementStatus = 'active' | 'expired' | 'revoked' | 'refunded';

export type EntitlementScope = 'job_contact' | 'subscription_contact';

export type PaymentProduct =
  | 'job_contact_unlock'
  | 'subscription'
  | 'job_post';

/** Structured payment history row for admin table / Excel / PDF export. */
export type PaymentHistoryStatus =
  | 'created'
  | 'confirm_attempt'
  | 'confirm_failed'
  | 'paid'
  | 'failed'
  | 'cancelled'
  | 'webhook_rejected'
  | 'free_grant';

export interface PaymentHistoryEvent {
  id: string;
  createdAt: string;
  status: PaymentHistoryStatus;
  reason?: string;
  orderId?: string;
  userId?: string;
  actorId?: string;
  jobId?: string;
  planId?: string;
  product?: PaymentProduct;
  gateway?: PaymentGatewayId | string;
  gatewayOrderId?: string;
  gatewayPaymentId?: string;
  amountPaise?: number;
  currency?: 'INR';
  ip?: string;
  userAgent?: string;
  metadata?: Record<string, unknown>;
}

/** Active + planned gateways. Extend when adding an adapter. */
export type PaymentGatewayId = 'stub' | 'upi' | 'razorpay' | 'cashfree' | 'phonepe';

export type CheckoutMode = 'stub' | 'upi' | 'razorpay' | 'cashfree' | 'phonepe';

export interface UpiCheckoutPayload {
  /** Merchant UPI ID (VPA) */
  vpa: string;
  payeeName: string;
  /** NPCI intent — open in UPI apps */
  intentUri: string;
  /** Same as intentUri; client encodes QR locally (free) */
  qrPayload: string;
}

export interface PaymentOrder {
  id: string;
  userId: string;
  jobId?: string;
  planId?: string;
  gateway: PaymentGatewayId;
  gatewayOrderId: string;
  gatewayPaymentId?: string;
  amountPaise: number;
  currency: 'INR';
  status: PaymentStatus;
  product: PaymentProduct;
  createdAt: string;
  updatedAt: string;
}

export interface Entitlement {
  id: string;
  userId: string;
  jobId: string | null;
  planId?: string;
  scope: EntitlementScope;
  status: EntitlementStatus;
  paymentId?: string;
  validFrom: string;
  /** null = for life of the job listing (job unlock) or until plan end */
  validUntil: string | null;
  createdAt: string;
}

export interface AuditEvent {
  id: string;
  actorId?: string;
  action: string;
  entityType: string;
  entityId: string;
  metadata?: Record<string, unknown>;
  createdAt: string;
}

export interface CreateGatewayOrderResult {
  gatewayOrderId: string;
  amountPaise: number;
  currency: 'INR';
  checkoutMode: CheckoutMode;
  /** Hosted checkout PSPs (e.g. Razorpay key id) */
  keyId?: string;
  /** Present when checkoutMode is `upi` (QR + VPA) */
  upi?: UpiCheckoutPayload;
}

export interface GatewayWebhookPayload {
  gatewayOrderId: string;
  gatewayPaymentId: string;
  status: 'paid' | 'failed';
  rawEventId?: string;
}

export type SubscriptionPlanId = 'seeker_weekly' | 'seeker_monthly';

export interface SubscriptionPlan {
  id: SubscriptionPlanId;
  name: string;
  description: string;
  pricePaise: number;
  durationDays: number;
  contactUnlocksIncluded: 'unlimited' | number;
}
