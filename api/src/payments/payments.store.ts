import {
  AuditEvent,
  Entitlement,
  PaymentHistoryEvent,
  PaymentHistoryStatus,
  PaymentOrder,
  PaymentStatus,
  SubscriptionPlan,
} from './payments.types';

/**
 * Payments persistence contract. Memory and Prisma implementations share this surface.
 * All methods are async so Prisma can be the live path under PAYMENTS_STORE=prisma.
 */
export abstract class PaymentsStore {
  abstract listPlans(): Promise<SubscriptionPlan[]>;
  abstract getPlan(id: string): Promise<SubscriptionPlan | undefined>;

  abstract createOrder(
    input: Omit<PaymentOrder, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
      status?: PaymentStatus;
    },
  ): Promise<PaymentOrder>;

  abstract findOrder(id: string): Promise<PaymentOrder | undefined>;
  abstract findOrderByGatewayId(
    gatewayOrderId: string,
  ): Promise<PaymentOrder | undefined>;
  abstract updateOrder(
    id: string,
    patch: Partial<Pick<PaymentOrder, 'status' | 'gatewayPaymentId'>>,
  ): Promise<PaymentOrder | undefined>;
  abstract listOrders(): Promise<PaymentOrder[]>;

  abstract findActiveJobEntitlement(
    userId: string,
    jobId: string,
  ): Promise<Entitlement | undefined>;
  abstract findActiveSubscription(
    userId: string,
  ): Promise<Entitlement | undefined>;
  abstract findContactAccess(
    userId: string,
    jobId: string,
  ): Promise<Entitlement | undefined>;
  abstract listEntitlements(userId: string): Promise<Entitlement[]>;

  abstract grantJobContactEntitlement(input: {
    userId: string;
    jobId: string;
    paymentId: string;
  }): Promise<Entitlement>;

  abstract grantSubscriptionEntitlement(input: {
    userId: string;
    planId: string;
    paymentId: string;
    durationDays: number;
  }): Promise<Entitlement>;

  abstract revokeUserData(userId: string): Promise<void>;

  abstract markWebhookProcessed(eventId: string): Promise<boolean>;

  abstract addAudit(
    event: Omit<AuditEvent, 'id' | 'createdAt'>,
  ): Promise<AuditEvent>;

  abstract addHistory(
    event: Omit<PaymentHistoryEvent, 'id' | 'createdAt'> & {
      status: PaymentHistoryStatus;
    },
  ): Promise<PaymentHistoryEvent>;

  abstract listHistory(filter?: {
    status?: PaymentHistoryStatus;
    orderId?: string;
    userId?: string;
    from?: string;
    to?: string;
    limit?: number;
  }): Promise<PaymentHistoryEvent[]>;

  abstract bumpConfirmAttempt(orderId: string): Promise<number>;
  abstract getConfirmAttempts(orderId: string): Promise<number>;
  abstract clearConfirmAttempts(orderId: string): Promise<void>;
}
