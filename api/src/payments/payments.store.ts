import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  AuditEvent,
  Entitlement,
  PaymentHistoryEvent,
  PaymentHistoryStatus,
  PaymentOrder,
  PaymentStatus,
  SubscriptionPlan,
} from './payments.types';

const HISTORY_CAP = 5000;

export const SUBSCRIPTION_PLANS: SubscriptionPlan[] = [
  {
    id: 'seeker_weekly',
    name: 'Seeker Weekly',
    description: 'Unlimited contact unlocks for 7 days.',
    pricePaise: 4900,
    durationDays: 7,
    contactUnlocksIncluded: 'unlimited',
  },
  {
    id: 'seeker_monthly',
    name: 'Seeker Monthly',
    description: 'Unlimited contact unlocks for 30 days.',
    pricePaise: 14900,
    durationDays: 30,
    contactUnlocksIncluded: 'unlimited',
  },
];

@Injectable()
export class PaymentsStore {
  private readonly orders = new Map<string, PaymentOrder>();
  private readonly ordersByGateway = new Map<string, string>();
  private readonly entitlements = new Map<string, Entitlement>();
  private readonly audit: AuditEvent[] = [];
  private readonly history: PaymentHistoryEvent[] = [];
  private readonly confirmAttempts = new Map<string, number>();
  private readonly processedWebhookEvents = new Set<string>();

  listPlans(): SubscriptionPlan[] {
    return SUBSCRIPTION_PLANS;
  }

  getPlan(id: string): SubscriptionPlan | undefined {
    return SUBSCRIPTION_PLANS.find((p) => p.id === id);
  }

  createOrder(
    input: Omit<PaymentOrder, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
      status?: PaymentStatus;
    },
  ): PaymentOrder {
    const now = new Date().toISOString();
    const order: PaymentOrder = {
      id: `pay_${uuidv4().slice(0, 8)}`,
      status: input.status ?? 'created',
      createdAt: now,
      updatedAt: now,
      userId: input.userId,
      jobId: input.jobId,
      planId: input.planId,
      gateway: input.gateway,
      gatewayOrderId: input.gatewayOrderId,
      gatewayPaymentId: input.gatewayPaymentId,
      amountPaise: input.amountPaise,
      currency: input.currency,
      product: input.product,
    };
    this.orders.set(order.id, order);
    this.ordersByGateway.set(order.gatewayOrderId, order.id);
    return order;
  }

  findOrder(id: string): PaymentOrder | undefined {
    return this.orders.get(id);
  }

  findOrderByGatewayId(gatewayOrderId: string): PaymentOrder | undefined {
    const id = this.ordersByGateway.get(gatewayOrderId);
    return id ? this.orders.get(id) : undefined;
  }

  updateOrder(
    id: string,
    patch: Partial<Pick<PaymentOrder, 'status' | 'gatewayPaymentId'>>,
  ): PaymentOrder | undefined {
    const order = this.orders.get(id);
    if (!order) return undefined;
    const next: PaymentOrder = {
      ...order,
      ...patch,
      updatedAt: new Date().toISOString(),
    };
    this.orders.set(id, next);
    return next;
  }

  findActiveJobEntitlement(
    userId: string,
    jobId: string,
  ): Entitlement | undefined {
    for (const item of this.entitlements.values()) {
      if (
        item.userId === userId &&
        item.jobId === jobId &&
        item.scope === 'job_contact' &&
        item.status === 'active' &&
        (!item.validUntil || new Date(item.validUntil) > new Date())
      ) {
        return item;
      }
    }
    return undefined;
  }

  findActiveSubscription(userId: string): Entitlement | undefined {
    for (const item of this.entitlements.values()) {
      if (
        item.userId === userId &&
        item.scope === 'subscription_contact' &&
        item.status === 'active' &&
        item.validUntil &&
        new Date(item.validUntil) > new Date()
      ) {
        return item;
      }
    }
    return undefined;
  }

  findContactAccess(
    userId: string,
    jobId: string,
  ): Entitlement | undefined {
    return (
      this.findActiveJobEntitlement(userId, jobId) ||
      this.findActiveSubscription(userId)
    );
  }

  listEntitlements(userId: string): Entitlement[] {
    return [...this.entitlements.values()]
      .filter((item) => item.userId === userId)
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  grantJobContactEntitlement(input: {
    userId: string;
    jobId: string;
    paymentId: string;
  }): Entitlement {
    const existing = this.findActiveJobEntitlement(input.userId, input.jobId);
    if (existing) return existing;

    const entitlement: Entitlement = {
      id: `ent_${uuidv4().slice(0, 8)}`,
      userId: input.userId,
      jobId: input.jobId,
      scope: 'job_contact',
      status: 'active',
      paymentId: input.paymentId,
      validFrom: new Date().toISOString(),
      validUntil: null,
      createdAt: new Date().toISOString(),
    };
    this.entitlements.set(entitlement.id, entitlement);
    return entitlement;
  }

  grantSubscriptionEntitlement(input: {
    userId: string;
    planId: string;
    paymentId: string;
    durationDays: number;
  }): Entitlement {
    const existing = this.findActiveSubscription(input.userId);
    const from = existing?.validUntil
      ? new Date(Math.max(Date.now(), new Date(existing.validUntil).getTime()))
      : new Date();
    const validUntil = new Date(
      from.getTime() + input.durationDays * 24 * 60 * 60 * 1000,
    ).toISOString();

    if (existing) {
      existing.validUntil = validUntil;
      existing.paymentId = input.paymentId;
      existing.planId = input.planId;
      existing.status = 'active';
      this.entitlements.set(existing.id, existing);
      return existing;
    }

    const entitlement: Entitlement = {
      id: `ent_${uuidv4().slice(0, 8)}`,
      userId: input.userId,
      jobId: null,
      planId: input.planId,
      scope: 'subscription_contact',
      status: 'active',
      paymentId: input.paymentId,
      validFrom: new Date().toISOString(),
      validUntil,
      createdAt: new Date().toISOString(),
    };
    this.entitlements.set(entitlement.id, entitlement);
    return entitlement;
  }

  revokeUserData(userId: string): void {
    for (const [id, ent] of this.entitlements) {
      if (ent.userId === userId) this.entitlements.delete(id);
    }
    for (const [id, order] of this.orders) {
      if (order.userId === userId) {
        this.ordersByGateway.delete(order.gatewayOrderId);
        this.orders.delete(id);
      }
    }
  }

  markWebhookProcessed(eventId: string): boolean {
    if (this.processedWebhookEvents.has(eventId)) return false;
    this.processedWebhookEvents.add(eventId);
    return true;
  }

  addAudit(event: Omit<AuditEvent, 'id' | 'createdAt'>): AuditEvent {
    const record: AuditEvent = {
      id: `aud_${uuidv4().slice(0, 8)}`,
      createdAt: new Date().toISOString(),
      ...event,
    };
    this.audit.push(record);
    return record;
  }

  addHistory(
    event: Omit<PaymentHistoryEvent, 'id' | 'createdAt'> & {
      status: PaymentHistoryStatus;
    },
  ): PaymentHistoryEvent {
    const record: PaymentHistoryEvent = {
      id: `ph_${uuidv4().slice(0, 10)}`,
      createdAt: new Date().toISOString(),
      ...event,
    };
    this.history.unshift(record);
    if (this.history.length > HISTORY_CAP) {
      this.history.length = HISTORY_CAP;
    }
    return record;
  }

  listHistory(filter?: {
    status?: PaymentHistoryStatus;
    orderId?: string;
    userId?: string;
    from?: string;
    to?: string;
    limit?: number;
  }): PaymentHistoryEvent[] {
    let rows = this.history;
    if (filter?.status) {
      rows = rows.filter((r) => r.status === filter.status);
    }
    if (filter?.orderId) {
      rows = rows.filter((r) => r.orderId === filter.orderId);
    }
    if (filter?.userId) {
      rows = rows.filter((r) => r.userId === filter.userId);
    }
    if (filter?.from) {
      const from = filter.from;
      rows = rows.filter((r) => r.createdAt >= from);
    }
    if (filter?.to) {
      const to = filter.to;
      rows = rows.filter((r) => r.createdAt <= to);
    }
    const limit = Math.min(Math.max(filter?.limit ?? 500, 1), 5000);
    return rows.slice(0, limit);
  }

  bumpConfirmAttempt(orderId: string): number {
    const next = (this.confirmAttempts.get(orderId) ?? 0) + 1;
    this.confirmAttempts.set(orderId, next);
    return next;
  }

  getConfirmAttempts(orderId: string): number {
    return this.confirmAttempts.get(orderId) ?? 0;
  }

  clearConfirmAttempts(orderId: string): void {
    this.confirmAttempts.delete(orderId);
  }

  listOrders(): PaymentOrder[] {
    return [...this.orders.values()].sort((a, b) =>
      b.createdAt.localeCompare(a.createdAt),
    );
  }
}
