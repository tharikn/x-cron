import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  AuditEvent,
  Entitlement,
  PaymentOrder,
  PaymentStatus,
} from './payments.types';

@Injectable()
export class PaymentsStore {
  private readonly orders = new Map<string, PaymentOrder>();
  private readonly ordersByGateway = new Map<string, string>();
  private readonly entitlements = new Map<string, Entitlement>();
  private readonly audit: AuditEvent[] = [];
  private readonly processedWebhookEvents = new Set<string>();

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
}
