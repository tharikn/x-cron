export type PaymentStatus =
  | 'created'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export type EntitlementStatus = 'active' | 'expired' | 'revoked' | 'refunded';

export type EntitlementScope = 'job_contact' | 'subscription_contact';

export type PaymentProduct = 'job_contact_unlock' | 'subscription';

export interface PaymentOrder {
  id: string;
  userId: string;
  jobId?: string;
  planId?: string;
  gateway: 'razorpay';
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
  keyId: string;
  checkoutMode: 'stub' | 'razorpay';
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
