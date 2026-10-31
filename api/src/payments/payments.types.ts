export type PaymentStatus =
  | 'created'
  | 'paid'
  | 'failed'
  | 'refunded'
  | 'cancelled';

export type EntitlementStatus = 'active' | 'expired' | 'revoked' | 'refunded';

export type EntitlementScope = 'job_contact';

export interface PaymentOrder {
  id: string;
  userId: string;
  jobId: string;
  gateway: 'razorpay';
  gatewayOrderId: string;
  gatewayPaymentId?: string;
  amountPaise: number;
  currency: 'INR';
  status: PaymentStatus;
  product: 'job_contact_unlock';
  createdAt: string;
  updatedAt: string;
}

export interface Entitlement {
  id: string;
  userId: string;
  jobId: string;
  scope: EntitlementScope;
  status: EntitlementStatus;
  paymentId?: string;
  validFrom: string;
  /** null = for life of the job listing (PRD recommended) */
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
