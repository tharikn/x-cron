import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { createHmac } from 'crypto';
import { AuthUser } from '../auth/auth.types';
import { JobsMemoryStore } from '../jobs/jobs.memory-store';
import { OpsService } from '../ops/ops.service';
import { SiteService } from '../site/site.service';
import { PaymentsStore } from './payments.store';
import { RazorpayStubProvider } from './providers/razorpay.stub';
import type { Entitlement, PaymentOrder } from './payments.types';

@Injectable()
export class PaymentsService {
  private readonly provider = new RazorpayStubProvider();

  constructor(
    private readonly store: PaymentsStore,
    private readonly jobs: JobsMemoryStore,
    private readonly site: SiteService,
    @Optional() private readonly ops?: OpsService,
  ) {}

  listSubscriptionPlans() {
    return { items: this.store.listPlans() };
  }

  async createSubscriptionCheckout(user: AuthUser, planId: string) {
    const plan = this.store.getPlan(planId);
    if (!plan) throw new NotFoundException('Plan not found');

    const existing = this.store.findActiveSubscription(user.id);
    const gateway = await this.provider.createOrder({
      amountPaise: plan.pricePaise,
      currency: 'INR',
      receipt: `sub_${plan.id}_${user.id}`.slice(0, 40),
      notes: { userId: user.id, product: 'subscription', planId: plan.id },
    });

    const order = this.store.createOrder({
      userId: user.id,
      planId: plan.id,
      gateway: 'razorpay',
      gatewayOrderId: gateway.gatewayOrderId,
      amountPaise: plan.pricePaise,
      currency: 'INR',
      product: 'subscription',
    });

    this.store.addAudit({
      actorId: user.id,
      action: 'subscription_order_created',
      entityType: 'payment',
      entityId: order.id,
      metadata: { planId: plan.id, amountPaise: plan.pricePaise },
    });

    return {
      alreadySubscribed: !!existing,
      currentSubscription: existing ? this.toEntitlementDto(existing) : null,
      order: this.toOrderDto(order),
      checkout: {
        gateway: 'razorpay' as const,
        keyId: gateway.keyId,
        gatewayOrderId: gateway.gatewayOrderId,
        amountPaise: plan.pricePaise,
        currency: 'INR' as const,
        checkoutMode: gateway.checkoutMode,
        description: `${plan.name} – ₹${(plan.pricePaise / 100).toFixed(0)}`,
        plan,
      },
    };
  }

  async createContactOrder(user: AuthUser, jobId: string) {
    const job = this.jobs.findById(jobId);
    if (!job || job.status !== 'published') {
      throw new NotFoundException('Job not found');
    }
    if (!job.contact.hasPhone && !job.contact.hasEmail && !job.contact.hasWhatsapp) {
      throw new BadRequestException('Job has no contact methods to unlock');
    }

    const existing = this.store.findContactAccess(user.id, jobId);
    if (existing) {
      return {
        alreadyEntitled: true,
        entitlement: this.toEntitlementDto(existing),
        order: null,
        checkout: null,
      };
    }

    this.assertUnlockQuota();

    const amountPaise =
      this.site.getUnlockPricePaise() || job.contact.unlockPricePaise || 500;
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
      return {
        order: this.toOrderDto(order),
        entitlement: this.entitlementForPaidOrder(order),
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
      return {
        ok: true,
        duplicate: true,
        order: order ? this.toOrderDto(order) : null,
        entitlement: order ? this.entitlementForPaidOrder(order) : null,
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

    const entitlement = this.store.findContactAccess(user.id, jobId);
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
      metadata: {
        entitlementId: entitlement.id,
        scope: entitlement.scope,
      },
    });

    return {
      allowed: true as const,
      reason: 'entitled' as const,
      message:
        entitlement.scope === 'subscription_contact'
          ? 'Contact access granted via active subscription.'
          : 'Contact access granted for this job.',
      entitlement: this.toEntitlementDto(entitlement),
      contact: {
        phone: job.privateContact?.phone ?? null,
        email: job.privateContact?.email ?? null,
        whatsapp: job.privateContact?.whatsapp ?? null,
        website: job.privateContact?.website ?? null,
      },
    };
  }

  listEntitlements(user: AuthUser) {
    return {
      items: this.store
        .listEntitlements(user.id)
        .map((item) => this.toEntitlementDto(item)),
      subscription: (() => {
        const sub = this.store.findActiveSubscription(user.id);
        return sub ? this.toEntitlementDto(sub) : null;
      })(),
    };
  }

  wipeUser(userId: string) {
    this.store.revokeUserData(userId);
  }

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
      return {
        order: this.toOrderDto(order),
        entitlement: this.entitlementForPaidOrder(order),
      };
    }

    if (order.status !== 'created' && order.status !== 'failed') {
      throw new BadRequestException(`Cannot mark order ${order.status} as paid`);
    }

    const updated = this.store.updateOrder(order.id, {
      status: 'paid',
      gatewayPaymentId,
    })!;

    let entitlement: Entitlement;
    if (order.product === 'subscription' && order.planId) {
      const plan = this.store.getPlan(order.planId);
      if (!plan) throw new NotFoundException('Subscription plan missing');
      entitlement = this.store.grantSubscriptionEntitlement({
        userId: order.userId,
        planId: plan.id,
        paymentId: updated.id,
        durationDays: plan.durationDays,
      });
      this.store.addAudit({
        actorId: order.userId,
        action: 'subscription_entitlement_granted',
        entityType: 'entitlement',
        entityId: entitlement.id,
        metadata: { planId: plan.id, paymentId: updated.id, eventId },
      });
    } else {
      if (!order.jobId) {
        throw new BadRequestException('Contact unlock order missing jobId');
      }
      entitlement = this.store.grantJobContactEntitlement({
        userId: order.userId,
        jobId: order.jobId,
        paymentId: updated.id,
      });
      this.ops?.recordUnlock();
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
    }

    return {
      order: this.toOrderDto(updated),
      entitlement: this.toEntitlementDto(entitlement),
    };
  }

  private entitlementForPaidOrder(order: PaymentOrder) {
    if (order.product === 'subscription') {
      const sub = this.store.findActiveSubscription(order.userId);
      return sub ? this.toEntitlementDto(sub) : null;
    }
    if (!order.jobId) return null;
    const ent = this.store.findActiveJobEntitlement(order.userId, order.jobId);
    return ent ? this.toEntitlementDto(ent) : null;
  }

  private assertUnlockQuota() {
    if (!this.ops) return;
    const quotas = this.ops.quotas().items;
    const unlock = quotas.find((q) => q.key === 'contact_unlocks');
    if (unlock && unlock.used >= unlock.limit) {
      throw new ForbiddenException('Daily contact unlock quota reached');
    }
  }

  private toOrderDto(order: PaymentOrder) {
    return {
      id: order.id,
      jobId: order.jobId ?? null,
      planId: order.planId ?? null,
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

  private toEntitlementDto(item: Entitlement) {
    return {
      id: item.id,
      jobId: item.jobId,
      planId: item.planId ?? null,
      scope: item.scope,
      status: item.status,
      validFrom: item.validFrom,
      validUntil: item.validUntil,
      createdAt: item.createdAt,
    };
  }
}
