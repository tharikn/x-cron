import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHmac } from 'crypto';
import { AuthUser } from '../auth/auth.types';
import { JobsMemoryStore } from '../jobs/jobs.memory-store';
import { PaymentsStore } from './payments.store';
import { RazorpayStubProvider } from './providers/razorpay.stub';

@Injectable()
export class PaymentsService {
  private readonly provider = new RazorpayStubProvider();

  constructor(
    private readonly store: PaymentsStore,
    private readonly jobs: JobsMemoryStore,
  ) {}

  async createContactOrder(user: AuthUser, jobId: string) {
    const job = this.jobs.findById(jobId);
    if (!job || job.status !== 'published') {
      throw new NotFoundException('Job not found');
    }
    if (!job.contact.hasPhone && !job.contact.hasEmail && !job.contact.hasWhatsapp) {
      throw new BadRequestException('Job has no contact methods to unlock');
    }

    const existing = this.store.findActiveJobEntitlement(user.id, jobId);
    if (existing) {
      return {
        alreadyEntitled: true,
        entitlement: this.toEntitlementDto(existing),
        order: null,
        checkout: null,
      };
    }

    const amountPaise = job.contact.unlockPricePaise || 500;
    const gateway = await this.provider.createOrder({
      amountPaise,
      currency: 'INR',
      receipt: `contact_${jobId}_${user.id}`.slice(0, 40),
      notes: { jobId, userId: user.id, product: 'job_contact_unlock' },
    });

    const order = this.store.createOrder({
      userId: user.id,
      jobId,
      gateway: 'razorpay',
      gatewayOrderId: gateway.gatewayOrderId,
      amountPaise,
      currency: 'INR',
      product: 'job_contact_unlock',
    });

    this.store.addAudit({
      actorId: user.id,
      action: 'contact_order_created',
      entityType: 'payment',
      entityId: order.id,
      metadata: { jobId, amountPaise, gatewayOrderId: order.gatewayOrderId },
    });

    return {
      alreadyEntitled: false,
      entitlement: null,
      order: this.toOrderDto(order),
      checkout: {
        gateway: 'razorpay' as const,
        keyId: gateway.keyId,
        gatewayOrderId: gateway.gatewayOrderId,
        amountPaise,
        currency: 'INR' as const,
        checkoutMode: gateway.checkoutMode,
        description: `Unlock employer contact – ₹${(amountPaise / 100).toFixed(0)}`,
      },
    };
  }

  async confirmDevPayment(user: AuthUser, orderId: string) {
    if ((process.env.PAYMENT_MODE || 'stub') !== 'stub') {
      throw new ForbiddenException('Dev payment confirm only allowed in stub mode');
    }
    const order = this.store.findOrder(orderId);
    if (!order) throw new NotFoundException('Order not found');
    if (order.userId !== user.id) {
      throw new ForbiddenException('Order belongs to another user');
    }
    if (order.status === 'paid') {
      const entitlement = this.store.findActiveJobEntitlement(user.id, order.jobId);
      return {
        order: this.toOrderDto(order),
        entitlement: entitlement ? this.toEntitlementDto(entitlement) : null,
      };
    }

    const paymentId = `pay_stub_${order.gatewayOrderId.slice(-8)}`;
    return this.markPaid(order.gatewayOrderId, paymentId, `dev_${order.id}`);
  }

  handleWebhook(
    gateway: string,
    body: Record<string, unknown>,
    signature?: string,
    rawBody?: string,
  ) {
    if (gateway !== 'razorpay') {
      throw new BadRequestException(`Unsupported gateway: ${gateway}`);
    }
    const parsed = this.provider.parseWebhook(rawBody ?? body, signature);
    const eventId =
      parsed.rawEventId || `${parsed.gatewayOrderId}:${parsed.gatewayPaymentId}`;

    if (!this.store.markWebhookProcessed(eventId)) {
      const order = this.store.findOrderByGatewayId(parsed.gatewayOrderId);
      const entitlement = order
        ? this.store.findActiveJobEntitlement(order.userId, order.jobId)
        : undefined;
      return {
        ok: true,
        duplicate: true,
        order: order ? this.toOrderDto(order) : null,
        entitlement: entitlement ? this.toEntitlementDto(entitlement) : null,
      };
    }

    if (parsed.status !== 'paid') {
      const order = this.store.findOrderByGatewayId(parsed.gatewayOrderId);
      if (order && order.status === 'created') {
        this.store.updateOrder(order.id, { status: 'failed' });
      }
      return { ok: true, duplicate: false, status: 'failed' };
    }

    return {
      ok: true,
      duplicate: false,
      ...this.markPaid(
        parsed.gatewayOrderId,
        parsed.gatewayPaymentId,
        eventId,
      ),
    };
  }

  getContact(user: AuthUser, jobId: string) {
    const job = this.jobs.findById(jobId);
    if (!job || job.status !== 'published') {
      throw new NotFoundException('Job not found');
    }

    const entitlement = this.store.findActiveJobEntitlement(user.id, jobId);
    if (!entitlement) {
      return {
        allowed: false as const,
        reason: 'entitlement_required' as const,
        message:
          'Contact details are private. A verified unlock or active subscription is required.',
        contact: null,
      };
    }

    this.store.addAudit({
      actorId: user.id,
      action: 'contact_revealed',
      entityType: 'job',
      entityId: jobId,
      metadata: { entitlementId: entitlement.id },
    });

    return {
      allowed: true as const,
      reason: 'entitled' as const,
      message: 'Contact access granted for this job.',
      entitlement: this.toEntitlementDto(entitlement),
      contact: {
        phone: job.privateContact?.phone ?? null,
        email: job.privateContact?.email ?? null,
        whatsapp: job.privateContact?.whatsapp ?? null,
      },
    };
  }

  listEntitlements(user: AuthUser) {
    return {
      items: this.store.listEntitlements(user.id).map((item) => this.toEntitlementDto(item)),
    };
  }

  /** Helper for tests / docs: compute a valid stub webhook signature. */
  signWebhookBody(body: string): string {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET ?? 'dev_secret';
    return createHmac('sha256', secret).update(body).digest('hex');
  }

  private markPaid(
    gatewayOrderId: string,
    gatewayPaymentId: string,
    eventId: string,
  ) {
    const order = this.store.findOrderByGatewayId(gatewayOrderId);
    if (!order) {
      throw new NotFoundException('Payment order not found for webhook');
    }

    if (order.status === 'paid') {
      const entitlement = this.store.findActiveJobEntitlement(
        order.userId,
        order.jobId,
      );
      return {
        order: this.toOrderDto(order),
        entitlement: entitlement ? this.toEntitlementDto(entitlement) : null,
      };
    }

    if (order.status !== 'created' && order.status !== 'failed') {
      throw new BadRequestException(`Cannot mark order ${order.status} as paid`);
    }

    const updated = this.store.updateOrder(order.id, {
      status: 'paid',
      gatewayPaymentId,
    })!;

    const entitlement = this.store.grantJobContactEntitlement({
      userId: order.userId,
      jobId: order.jobId,
      paymentId: updated.id,
    });

    this.store.addAudit({
      actorId: order.userId,
      action: 'contact_entitlement_granted',
      entityType: 'entitlement',
      entityId: entitlement.id,
      metadata: {
        jobId: order.jobId,
        paymentId: updated.id,
        gatewayPaymentId,
        eventId,
      },
    });

    return {
      order: this.toOrderDto(updated),
      entitlement: this.toEntitlementDto(entitlement),
    };
  }

  private toOrderDto(order: {
    id: string;
    userId: string;
    jobId: string;
    gateway: string;
    gatewayOrderId: string;
    gatewayPaymentId?: string;
    amountPaise: number;
    currency: string;
    status: string;
    product: string;
    createdAt: string;
    updatedAt: string;
  }) {
    return {
      id: order.id,
      jobId: order.jobId,
      gateway: order.gateway,
      gatewayOrderId: order.gatewayOrderId,
      gatewayPaymentId: order.gatewayPaymentId ?? null,
      amountPaise: order.amountPaise,
      currency: order.currency,
      status: order.status,
      product: order.product,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    };
  }

  private toEntitlementDto(item: {
    id: string;
    userId: string;
    jobId: string;
    scope: string;
    status: string;
    paymentId?: string;
    validFrom: string;
    validUntil: string | null;
    createdAt: string;
  }) {
    return {
      id: item.id,
      jobId: item.jobId,
      scope: item.scope,
      status: item.status,
      validFrom: item.validFrom,
      validUntil: item.validUntil,
      createdAt: item.createdAt,
    };
  }
}
