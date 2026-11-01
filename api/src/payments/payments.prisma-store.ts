import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { SUBSCRIPTION_PLANS } from './payments.memory-store';
import { PaymentsStore } from './payments.store';
import {
  AuditEvent,
  Entitlement,
  EntitlementScope,
  EntitlementStatus,
  PaymentGatewayId,
  PaymentHistoryEvent,
  PaymentHistoryStatus,
  PaymentOrder,
  PaymentProduct,
  PaymentStatus,
  SubscriptionPlan,
} from './payments.types';

function asMeta(
  value: Prisma.JsonValue | null | undefined,
): Record<string, unknown> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }
  return value as Record<string, unknown>;
}

@Injectable()
export class PaymentsPrismaStore extends PaymentsStore {
  private readonly confirmAttempts = new Map<string, number>();
  private readonly processedWebhookEvents = new Set<string>();

  constructor(private readonly prisma: PrismaService) {
    super();
  }

  private async ensureUser(userId: string): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: userId },
      create: { id: userId },
      update: {},
    });
  }

  private mapOrder(row: {
    id: string;
    userId: string;
    jobId: string | null;
    planId: string | null;
    product: string | null;
    gateway: string;
    gatewayOrderId: string;
    gatewayPaymentId: string | null;
    amountPaise: number;
    currency: string;
    status: string;
    createdAt: Date;
    updatedAt: Date;
  }): PaymentOrder {
    return {
      id: row.id,
      userId: row.userId,
      jobId: row.jobId ?? undefined,
      planId: row.planId ?? undefined,
      gateway: row.gateway as PaymentGatewayId,
      gatewayOrderId: row.gatewayOrderId,
      gatewayPaymentId: row.gatewayPaymentId ?? undefined,
      amountPaise: row.amountPaise,
      currency: (row.currency as 'INR') || 'INR',
      status: row.status as PaymentStatus,
      product: (row.product as PaymentProduct) || 'job_contact_unlock',
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  private mapEntitlement(row: {
    id: string;
    userId: string;
    jobId: string | null;
    planId: string | null;
    paymentId: string | null;
    scope: string;
    status: string;
    validFrom: Date;
    validUntil: Date | null;
    createdAt: Date;
  }): Entitlement {
    return {
      id: row.id,
      userId: row.userId,
      jobId: row.jobId,
      planId: row.planId ?? undefined,
      paymentId: row.paymentId ?? undefined,
      scope: row.scope as EntitlementScope,
      status: row.status as EntitlementStatus,
      validFrom: row.validFrom.toISOString(),
      validUntil: row.validUntil ? row.validUntil.toISOString() : null,
      createdAt: row.createdAt.toISOString(),
    };
  }

  private mapHistory(row: {
    id: string;
    status: string;
    reason: string | null;
    orderId: string | null;
    userId: string | null;
    actorId: string | null;
    jobId: string | null;
    planId: string | null;
    product: string | null;
    gateway: string | null;
    gatewayOrderId: string | null;
    gatewayPaymentId: string | null;
    amountPaise: number | null;
    currency: string | null;
    ip: string | null;
    userAgent: string | null;
    metadataJson: Prisma.JsonValue | null;
    createdAt: Date;
  }): PaymentHistoryEvent {
    return {
      id: row.id,
      createdAt: row.createdAt.toISOString(),
      status: row.status as PaymentHistoryStatus,
      reason: row.reason ?? undefined,
      orderId: row.orderId ?? undefined,
      userId: row.userId ?? undefined,
      actorId: row.actorId ?? undefined,
      jobId: row.jobId ?? undefined,
      planId: row.planId ?? undefined,
      product: (row.product as PaymentProduct | undefined) ?? undefined,
      gateway: row.gateway ?? undefined,
      gatewayOrderId: row.gatewayOrderId ?? undefined,
      gatewayPaymentId: row.gatewayPaymentId ?? undefined,
      amountPaise: row.amountPaise ?? undefined,
      currency: (row.currency as 'INR' | undefined) ?? undefined,
      ip: row.ip ?? undefined,
      userAgent: row.userAgent ?? undefined,
      metadata: asMeta(row.metadataJson),
    };
  }

  async listPlans(): Promise<SubscriptionPlan[]> {
    return SUBSCRIPTION_PLANS;
  }

  async getPlan(id: string): Promise<SubscriptionPlan | undefined> {
    return SUBSCRIPTION_PLANS.find((p) => p.id === id);
  }

  async createOrder(
    input: Omit<PaymentOrder, 'id' | 'createdAt' | 'updatedAt' | 'status'> & {
      status?: PaymentStatus;
    },
  ): Promise<PaymentOrder> {
    await this.ensureUser(input.userId);
    const created = await this.prisma.payment.create({
      data: {
        id: `pay_${uuidv4().slice(0, 8)}`,
        userId: input.userId,
        jobId: input.jobId,
        planId: input.planId,
        product: input.product,
        gateway: input.gateway,
        gatewayOrderId: input.gatewayOrderId,
        gatewayPaymentId: input.gatewayPaymentId,
        amountPaise: input.amountPaise,
        currency: input.currency,
        status: input.status ?? 'created',
      },
    });
    return this.mapOrder(created);
  }

  async findOrder(id: string): Promise<PaymentOrder | undefined> {
    const row = await this.prisma.payment.findUnique({ where: { id } });
    return row ? this.mapOrder(row) : undefined;
  }

  async findOrderByGatewayId(
    gatewayOrderId: string,
  ): Promise<PaymentOrder | undefined> {
    const row = await this.prisma.payment.findUnique({
      where: { gatewayOrderId },
    });
    return row ? this.mapOrder(row) : undefined;
  }

  async updateOrder(
    id: string,
    patch: Partial<Pick<PaymentOrder, 'status' | 'gatewayPaymentId'>>,
  ): Promise<PaymentOrder | undefined> {
    try {
      const updated = await this.prisma.payment.update({
        where: { id },
        data: {
          status: patch.status,
          gatewayPaymentId: patch.gatewayPaymentId,
        },
      });
      return this.mapOrder(updated);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        return undefined;
      }
      throw err;
    }
  }

  async listOrders(): Promise<PaymentOrder[]> {
    const rows = await this.prisma.payment.findMany({
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => this.mapOrder(r));
  }

  async findActiveJobEntitlement(
    userId: string,
    jobId: string,
  ): Promise<Entitlement | undefined> {
    const now = new Date();
    const row = await this.prisma.entitlement.findFirst({
      where: {
        userId,
        jobId,
        scope: 'job_contact',
        status: 'active',
        OR: [{ validUntil: null }, { validUntil: { gt: now } }],
      },
      orderBy: { createdAt: 'desc' },
    });
    return row ? this.mapEntitlement(row) : undefined;
  }

  async findActiveSubscription(
    userId: string,
  ): Promise<Entitlement | undefined> {
    const now = new Date();
    const row = await this.prisma.entitlement.findFirst({
      where: {
        userId,
        scope: 'subscription_contact',
        status: 'active',
        validUntil: { gt: now },
      },
      orderBy: { validUntil: 'desc' },
    });
    return row ? this.mapEntitlement(row) : undefined;
  }

  async findContactAccess(
    userId: string,
    jobId: string,
  ): Promise<Entitlement | undefined> {
    return (
      (await this.findActiveJobEntitlement(userId, jobId)) ||
      (await this.findActiveSubscription(userId))
    );
  }

  async listEntitlements(userId: string): Promise<Entitlement[]> {
    const rows = await this.prisma.entitlement.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => this.mapEntitlement(r));
  }

  async grantJobContactEntitlement(input: {
    userId: string;
    jobId: string;
    paymentId: string;
  }): Promise<Entitlement> {
    await this.ensureUser(input.userId);
    const existing = await this.findActiveJobEntitlement(
      input.userId,
      input.jobId,
    );
    if (existing) return existing;

    const created = await this.prisma.entitlement.create({
      data: {
        id: `ent_${uuidv4().slice(0, 8)}`,
        userId: input.userId,
        jobId: input.jobId,
        paymentId: input.paymentId,
        scope: 'job_contact',
        status: 'active',
        validUntil: null,
      },
    });
    return this.mapEntitlement(created);
  }

  async grantSubscriptionEntitlement(input: {
    userId: string;
    planId: string;
    paymentId: string;
    durationDays: number;
  }): Promise<Entitlement> {
    await this.ensureUser(input.userId);
    const existing = await this.findActiveSubscription(input.userId);
    const from = existing?.validUntil
      ? new Date(Math.max(Date.now(), new Date(existing.validUntil).getTime()))
      : new Date();
    const validUntil = new Date(
      from.getTime() + input.durationDays * 24 * 60 * 60 * 1000,
    );

    if (existing) {
      const updated = await this.prisma.entitlement.update({
        where: { id: existing.id },
        data: {
          validUntil,
          paymentId: input.paymentId,
          planId: input.planId,
          status: 'active',
        },
      });
      return this.mapEntitlement(updated);
    }

    const created = await this.prisma.entitlement.create({
      data: {
        id: `ent_${uuidv4().slice(0, 8)}`,
        userId: input.userId,
        jobId: null,
        planId: input.planId,
        paymentId: input.paymentId,
        scope: 'subscription_contact',
        status: 'active',
        validUntil,
      },
    });
    return this.mapEntitlement(created);
  }

  async revokeUserData(userId: string): Promise<void> {
    await this.prisma.entitlement.deleteMany({ where: { userId } });
    await this.prisma.paymentHistory.deleteMany({ where: { userId } });
    await this.prisma.payment.deleteMany({ where: { userId } });
  }

  async markWebhookProcessed(eventId: string): Promise<boolean> {
    if (this.processedWebhookEvents.has(eventId)) return false;
    this.processedWebhookEvents.add(eventId);
    return true;
  }

  async addAudit(
    event: Omit<AuditEvent, 'id' | 'createdAt'>,
  ): Promise<AuditEvent> {
    if (event.actorId) {
      await this.ensureUser(event.actorId);
    }
    const created = await this.prisma.auditEvent.create({
      data: {
        id: `aud_${uuidv4().slice(0, 8)}`,
        actorId: event.actorId,
        action: event.action,
        entityType: event.entityType,
        entityId: event.entityId,
        metadata: event.metadata
          ? (event.metadata as Prisma.InputJsonValue)
          : undefined,
      },
    });
    return {
      id: created.id,
      actorId: created.actorId ?? undefined,
      action: created.action,
      entityType: created.entityType,
      entityId: created.entityId,
      metadata: asMeta(created.metadata),
      createdAt: created.createdAt.toISOString(),
    };
  }

  async addHistory(
    event: Omit<PaymentHistoryEvent, 'id' | 'createdAt'> & {
      status: PaymentHistoryStatus;
    },
  ): Promise<PaymentHistoryEvent> {
    const created = await this.prisma.paymentHistory.create({
      data: {
        id: `ph_${uuidv4().slice(0, 10)}`,
        status: event.status,
        reason: event.reason,
        orderId: event.orderId,
        userId: event.userId,
        actorId: event.actorId,
        jobId: event.jobId,
        planId: event.planId,
        product: event.product,
        gateway: event.gateway,
        gatewayOrderId: event.gatewayOrderId,
        gatewayPaymentId: event.gatewayPaymentId,
        amountPaise: event.amountPaise,
        currency: event.currency,
        ip: event.ip,
        userAgent: event.userAgent,
        metadataJson: event.metadata
          ? (event.metadata as Prisma.InputJsonValue)
          : undefined,
      },
    });
    return this.mapHistory(created);
  }

  async listHistory(filter?: {
    status?: PaymentHistoryStatus;
    orderId?: string;
    userId?: string;
    from?: string;
    to?: string;
    limit?: number;
  }): Promise<PaymentHistoryEvent[]> {
    const limit = Math.min(Math.max(filter?.limit ?? 500, 1), 5000);
    const rows = await this.prisma.paymentHistory.findMany({
      where: {
        status: filter?.status,
        orderId: filter?.orderId,
        userId: filter?.userId,
        createdAt: {
          gte: filter?.from ? new Date(filter.from) : undefined,
          lte: filter?.to ? new Date(filter.to) : undefined,
        },
      },
      orderBy: { createdAt: 'desc' },
      take: limit,
    });
    return rows.map((r) => this.mapHistory(r));
  }

  async bumpConfirmAttempt(orderId: string): Promise<number> {
    const next = (this.confirmAttempts.get(orderId) ?? 0) + 1;
    this.confirmAttempts.set(orderId, next);
    return next;
  }

  async getConfirmAttempts(orderId: string): Promise<number> {
    return this.confirmAttempts.get(orderId) ?? 0;
  }

  async clearConfirmAttempts(orderId: string): Promise<void> {
    this.confirmAttempts.delete(orderId);
  }
}
