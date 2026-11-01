import {
  BadRequestException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { createHmac } from 'crypto';
import { AuthUser } from '../auth/auth.types';
import { JobsStore } from '../jobs/jobs.store';
import { OpsService } from '../ops/ops.service';
import { SiteService } from '../site/site.service';
import { PaymentsStore } from './payments.store';
import { createPaymentProvider } from './providers/payment-provider.factory';
import { historyToExcelCsv, historyToPdf } from './payments-export';
import type {
  CreateGatewayOrderResult,
  Entitlement,
  PaymentHistoryStatus,
  PaymentOrder,
} from './payments.types';

const MAX_CLIENT_CONFIRM_ATTEMPTS = 5;
const CLIENT_CONFIRM_TTL_MS = 30 * 60 * 1000;

@Injectable()
export class PaymentsService {
  private readonly provider = createPaymentProvider();

  constructor(
    private readonly store: PaymentsStore,
    private readonly jobs: JobsStore,
    private readonly site: SiteService,
    @Optional() private readonly ops?: OpsService,
  ) {}

  listSubscriptionPlans() {
    return { items: this.store.listPlans() };
  }

  listAdminHistory(filter?: {
    status?: PaymentHistoryStatus;
    orderId?: string;
    userId?: string;
    from?: string;
    to?: string;
    limit?: number;
  }) {
    const items = this.store.listHistory(filter);
    return {
      items,
      orders: this.store.listOrders().slice(0, 200).map((o) => this.toOrderDto(o)),
      total: items.length,
    };
  }

  exportHistoryExcel(filter?: {
    status?: PaymentHistoryStatus;
    from?: string;
    to?: string;
  }): Buffer {
    return historyToExcelCsv(this.store.listHistory({ ...filter, limit: 5000 }));
  }

  exportHistoryPdf(filter?: {
    status?: PaymentHistoryStatus;
    from?: string;
    to?: string;
  }): Buffer {
    return historyToPdf(this.store.listHistory({ ...filter, limit: 5000 }));
  }

  async createSubscriptionCheckout(user: AuthUser, planId: string) {
    this.assertPaymentsEnabled();
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
      gateway: this.provider.name,
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
    this.recordHistory({
      status: 'created',
      orderId: order.id,
      userId: user.id,
      actorId: user.id,
      planId: plan.id,
      product: 'subscription',
      gateway: order.gateway,
      gatewayOrderId: order.gatewayOrderId,
      amountPaise: order.amountPaise,
      currency: 'INR',
    });

    return {
      alreadySubscribed: !!existing,
      currentSubscription: existing ? this.toEntitlementDto(existing) : null,
      order: this.toOrderDto(order),
      checkout: {
        ...this.toCheckoutDto(
          gateway,
          `${plan.name} – ₹${(plan.pricePaise / 100).toFixed(0)}`,
        ),
        plan,
      },
    };
  }

  async createContactOrder(user: AuthUser, jobId: string) {
    const job = await this.jobs.findById(jobId);
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

    // Global payments off → free unlock grant (no client confirm).
    if (!this.site.paymentsEnabled()) {
      const entitlement = this.store.grantJobContactEntitlement({
        userId: user.id,
        jobId,
        paymentId: `free_${jobId}`,
      });
      this.recordHistory({
        status: 'free_grant',
        reason: 'payments_disabled',
        userId: user.id,
        actorId: user.id,
        jobId,
        product: 'job_contact_unlock',
        amountPaise: 0,
        currency: 'INR',
      });
      return {
        alreadyEntitled: true,
        entitlement: this.toEntitlementDto(entitlement),
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
      gateway: this.provider.name,
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
    this.recordHistory({
      status: 'created',
      orderId: order.id,
      userId: user.id,
      actorId: user.id,
      jobId,
      product: 'job_contact_unlock',
      gateway: order.gateway,
      gatewayOrderId: order.gatewayOrderId,
      amountPaise,
      currency: 'INR',
    });

    return {
      alreadyEntitled: false,
      entitlement: null,
      order: this.toOrderDto(order),
      checkout: this.toCheckoutDto(
        gateway,
        `Unlock employer contact – ₹${(amountPaise / 100).toFixed(0)}`,
      ),
    };
  }

  /** Employer post-job fee checkout (mandatory / optional modes). */
  async createPostJobOrder(user: AuthUser, jobId: string) {
    this.assertPaymentsEnabled();
    const commerce = this.site.getCommerce();
    if (commerce.postJobPaymentMode === 'none') {
      throw new BadRequestException('Post-job payment is disabled');
    }
    const job = await this.jobs.findById(jobId);
    if (!job) throw new NotFoundException('Job not found');
    if (
      job.ownerUserId &&
      job.ownerUserId !== user.id &&
      !user.roles.includes('admin')
    ) {
      throw new ForbiddenException('Not your job');
    }

    const amountPaise = commerce.postJobPricePaise || 500;
    const gateway = await this.provider.createOrder({
      amountPaise,
      currency: 'INR',
      receipt: `post_${jobId}_${user.id}`.slice(0, 40),
      notes: { jobId, userId: user.id, product: 'job_post' },
    });

    const order = this.store.createOrder({
      userId: user.id,
      jobId,
      gateway: this.provider.name,
      gatewayOrderId: gateway.gatewayOrderId,
      amountPaise,
      currency: 'INR',
      product: 'job_post',
    });

    this.recordHistory({
      status: 'created',
      orderId: order.id,
      userId: user.id,
      actorId: user.id,
      jobId,
      product: 'job_post',
      gateway: order.gateway,
      gatewayOrderId: order.gatewayOrderId,
      amountPaise,
      currency: 'INR',
      metadata: { postJobPaymentMode: commerce.postJobPaymentMode },
    });

    return {
      order: this.toOrderDto(order),
      checkout: this.toCheckoutDto(
        gateway,
        `Job post fee – ₹${(amountPaise / 100).toFixed(0)}`,
      ),
      mode: commerce.postJobPaymentMode,
    };
  }

  async confirmDevPayment(
    user: AuthUser,
    orderId: string,
    meta?: { ip?: string; userAgent?: string },
  ) {
    const fail = (reason: string, status: number = 403): never => {
      const order = this.store.findOrder(orderId);
      this.recordHistory({
        status: 'confirm_failed',
        reason,
        orderId,
        userId: user.id,
        actorId: user.id,
        jobId: order?.jobId,
        product: order?.product,
        gateway: order?.gateway,
        gatewayOrderId: order?.gatewayOrderId,
        amountPaise: order?.amountPaise,
        currency: order?.currency,
        ip: meta?.ip,
        userAgent: meta?.userAgent,
      });
      if (status === 404) throw new NotFoundException(reason);
      if (status === 400) throw new BadRequestException(reason);
      throw new ForbiddenException(reason);
    };

    if (process.env.NODE_ENV === 'production') {
      fail('Client payment confirm is disabled in production');
    }
    if (!this.site.paymentsEnabled()) {
      fail('Payments are disabled in site settings');
    }
    if (!this.allowDevConfirm()) {
      fail(
        'Client confirm only when PAYMENT_GATEWAY=stub or PAYMENT_UPI_ALLOW_DEV_CONFIRM=1',
      );
    }

    const order = this.store.findOrder(orderId);
    if (!order) {
      fail('Order not found', 404);
      return;
    }
    if (order.userId !== user.id) {
      fail('Order belongs to another user');
    }

    this.recordHistory({
      status: 'confirm_attempt',
      orderId: order.id,
      userId: user.id,
      actorId: user.id,
      jobId: order.jobId,
      product: order.product,
      gateway: order.gateway,
      gatewayOrderId: order.gatewayOrderId,
      amountPaise: order.amountPaise,
      currency: 'INR',
      ip: meta?.ip,
      userAgent: meta?.userAgent,
    });

    if (order.status === 'paid') {
      return {
        order: this.toOrderDto(order),
        entitlement: this.entitlementForPaidOrder(order),
      };
    }
    if (order.status !== 'created') {
      fail(`Order status ${order.status} cannot be confirmed`, 400);
    }

    const ageMs = Date.now() - new Date(order.createdAt).getTime();
    if (ageMs > CLIENT_CONFIRM_TTL_MS || ageMs < 0) {
      this.store.updateOrder(order.id, { status: 'failed' });
      fail('Order expired — create a new checkout', 400);
    }

    const attempts = this.store.bumpConfirmAttempt(order.id);
    if (attempts > MAX_CLIENT_CONFIRM_ATTEMPTS) {
      this.store.updateOrder(order.id, { status: 'failed' });
      fail('Too many confirm attempts — order locked', 400);
    }

    const paymentId = `pay_stub_${order.gatewayOrderId.slice(-8)}`;
    const result = this.markPaid(
      order.gatewayOrderId,
      paymentId,
      `dev_${order.id}`,
    );
    this.store.clearConfirmAttempts(order.id);
    return result;
  }

  handleWebhook(
    gateway: string,
    body: Record<string, unknown>,
    signature?: string,
    rawBody?: string,
  ) {
    const active = this.provider.name;
    const accepted =
      gateway === active || (active === 'stub' && gateway === 'razorpay');
    if (!accepted) {
      throw new BadRequestException(
        `Unsupported gateway: ${gateway} (active=${active})`,
      );
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
      this.recordHistory({
        status: 'failed',
        reason: 'webhook_not_paid',
        orderId: order?.id,
        userId: order?.userId,
        jobId: order?.jobId,
        product: order?.product,
        gateway,
        gatewayOrderId: parsed.gatewayOrderId,
        gatewayPaymentId: parsed.gatewayPaymentId,
        amountPaise: order?.amountPaise,
        currency: order?.currency,
      });
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

  async getContact(user: AuthUser, jobId: string) {
    const job = await this.jobs.findById(jobId);
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

    let entitlement: Entitlement | null = null;
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
    } else if (order.product === 'job_contact_unlock') {
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
    } else if (order.product === 'job_post') {
      this.store.addAudit({
        actorId: order.userId,
        action: 'job_post_payment_captured',
        entityType: 'payment',
        entityId: updated.id,
        metadata: { jobId: order.jobId, gatewayPaymentId, eventId },
      });
    }

    this.store.clearConfirmAttempts(order.id);
    this.recordHistory({
      status: 'paid',
      orderId: updated.id,
      userId: order.userId,
      actorId: order.userId,
      jobId: order.jobId,
      planId: order.planId,
      product: order.product,
      gateway: order.gateway,
      gatewayOrderId: order.gatewayOrderId,
      gatewayPaymentId,
      amountPaise: order.amountPaise,
      currency: 'INR',
      metadata: { eventId },
    });

    return {
      order: this.toOrderDto(updated),
      entitlement:
        order.product === 'job_post'
          ? null
          : this.toEntitlementDto(entitlement!),
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

  private allowDevConfirm(): boolean {
    if (process.env.PAYMENT_ALLOW_CLIENT_CONFIRM === '0') return false;
    const mode = (
      process.env.PAYMENT_GATEWAY ||
      process.env.PAYMENT_MODE ||
      'stub'
    ).toLowerCase();
    if (mode === 'stub') return true;
    return mode === 'upi' && process.env.PAYMENT_UPI_ALLOW_DEV_CONFIRM === '1';
  }

  private assertPaymentsEnabled() {
    if (!this.site.paymentsEnabled()) {
      throw new ForbiddenException('Payments are disabled in site settings');
    }
  }

  private recordHistory(
    event: Parameters<PaymentsStore['addHistory']>[0],
  ) {
    this.store.addHistory(event);
  }

  private toCheckoutDto(gateway: CreateGatewayOrderResult, description: string) {
    return {
      gateway: this.provider.name,
      keyId: gateway.keyId ?? null,
      gatewayOrderId: gateway.gatewayOrderId,
      amountPaise: gateway.amountPaise,
      currency: gateway.currency,
      checkoutMode: gateway.checkoutMode,
      description,
      upi: gateway.upi ?? null,
    };
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
