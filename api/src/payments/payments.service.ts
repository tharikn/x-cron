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

  async listSubscriptionPlans() {
    return { items: await this.store.listPlans() };
  }

  async listAdminHistory(filter?: {
    status?: PaymentHistoryStatus;
    orderId?: string;
    userId?: string;
    from?: string;
    to?: string;
    limit?: number;
  }) {
    const items = await this.store.listHistory(filter);
    const orders = await this.store.listOrders();
    return {
      items,
      orders: orders.slice(0, 200).map((o) => this.toOrderDto(o)),
      total: items.length,
    };
  }

  async exportHistoryExcel(filter?: {
    status?: PaymentHistoryStatus;
    from?: string;
    to?: string;
  }): Promise<Buffer> {
    return historyToExcelCsv(
      await this.store.listHistory({ ...filter, limit: 5000 }),
    );
  }

  async exportHistoryPdf(filter?: {
    status?: PaymentHistoryStatus;
    from?: string;
    to?: string;
  }): Promise<Buffer> {
    return historyToPdf(
      await this.store.listHistory({ ...filter, limit: 5000 }),
    );
  }

  async createSubscriptionCheckout(user: AuthUser, planId: string) {
    this.assertPaymentsEnabled();
    const plan = await this.store.getPlan(planId);
    if (!plan) throw new NotFoundException('Plan not found');

    const existing = await this.store.findActiveSubscription(user.id);
    const gateway = await this.provider.createOrder({
      amountPaise: plan.pricePaise,
      currency: 'INR',
      receipt: `sub_${plan.id}_${user.id}`.slice(0, 40),
      notes: { userId: user.id, product: 'subscription', planId: plan.id },
    });

    const order = await this.store.createOrder({
      userId: user.id,
      planId: plan.id,
      gateway: this.provider.name,
      gatewayOrderId: gateway.gatewayOrderId,
      amountPaise: plan.pricePaise,
      currency: 'INR',
      product: 'subscription',
    });

    await this.store.addAudit({
      actorId: user.id,
      action: 'subscription_order_created',
      entityType: 'payment',
      entityId: order.id,
      metadata: { planId: plan.id, amountPaise: plan.pricePaise },
    });
    await this.recordHistory({
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

    const existing = await this.store.findContactAccess(user.id, jobId);
    if (existing) {
      return {
        alreadyEntitled: true,
        entitlement: this.toEntitlementDto(existing),
        order: null,
        checkout: null,
      };
    }

    if (!this.site.paymentsEnabled()) {
      const entitlement = await this.store.grantJobContactEntitlement({
        userId: user.id,
        jobId,
        paymentId: `free_${jobId}`,
      });
      await this.recordHistory({
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

    const order = await this.store.createOrder({
      userId: user.id,
      jobId,
      gateway: this.provider.name,
      gatewayOrderId: gateway.gatewayOrderId,
      amountPaise,
      currency: 'INR',
      product: 'job_contact_unlock',
    });

    await this.store.addAudit({
      actorId: user.id,
      action: 'contact_order_created',
      entityType: 'payment',
      entityId: order.id,
      metadata: { jobId, amountPaise, gatewayOrderId: order.gatewayOrderId },
    });
    await this.recordHistory({
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

    const order = await this.store.createOrder({
      userId: user.id,
      jobId,
      gateway: this.provider.name,
      gatewayOrderId: gateway.gatewayOrderId,
      amountPaise,
      currency: 'INR',
      product: 'job_post',
    });

    await this.recordHistory({
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
    const fail = async (reason: string, status: number = 403): Promise<never> => {
      const order = await this.store.findOrder(orderId);
      await this.recordHistory({
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
      await fail('Client payment confirm is disabled in production');
    }
    if (!this.site.paymentsEnabled()) {
      await fail('Payments are disabled in site settings');
    }
    if (!this.allowDevConfirm()) {
      await fail(
        'Client confirm only when PAYMENT_GATEWAY=stub or PAYMENT_UPI_ALLOW_DEV_CONFIRM=1',
      );
    }

    const order = await this.store.findOrder(orderId);
    if (!order) {
      await fail('Order not found', 404);
      return;
    }
    if (order.userId !== user.id) {
      await fail('Order belongs to another user');
      return;
    }

    await this.recordHistory({
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
        entitlement: await this.entitlementForPaidOrder(order),
      };
    }
    if (order.status !== 'created') {
      await fail(`Order status ${order.status} cannot be confirmed`, 400);
    }

    const ageMs = Date.now() - new Date(order.createdAt).getTime();
    if (ageMs > CLIENT_CONFIRM_TTL_MS || ageMs < 0) {
      await this.store.updateOrder(order.id, { status: 'failed' });
      await fail('Order expired — create a new checkout', 400);
    }

    const attempts = await this.store.bumpConfirmAttempt(order.id);
    if (attempts > MAX_CLIENT_CONFIRM_ATTEMPTS) {
      await this.store.updateOrder(order.id, { status: 'failed' });
      await fail('Too many confirm attempts — order locked', 400);
    }

    const paymentId = `pay_stub_${order.gatewayOrderId.slice(-8)}`;
    const result = await this.markPaid(
      order.gatewayOrderId,
      paymentId,
      `dev_${order.id}`,
    );
    await this.store.clearConfirmAttempts(order.id);
    return result;
  }

  async handleWebhook(
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

    if (!(await this.store.markWebhookProcessed(eventId))) {
      const order = await this.store.findOrderByGatewayId(parsed.gatewayOrderId);
      return {
        ok: true,
        duplicate: true,
        order: order ? this.toOrderDto(order) : null,
        entitlement: order ? await this.entitlementForPaidOrder(order) : null,
      };
    }

    if (parsed.status !== 'paid') {
      const order = await this.store.findOrderByGatewayId(parsed.gatewayOrderId);
      if (order && order.status === 'created') {
        await this.store.updateOrder(order.id, { status: 'failed' });
      }
      await this.recordHistory({
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
      ...(await this.markPaid(
        parsed.gatewayOrderId,
        parsed.gatewayPaymentId,
        eventId,
      )),
    };
  }

  async getContact(user: AuthUser, jobId: string) {
    const job = await this.jobs.findById(jobId);
    if (!job || job.status !== 'published') {
      throw new NotFoundException('Job not found');
    }

    const entitlement = await this.store.findContactAccess(user.id, jobId);
    if (!entitlement) {
      return {
        allowed: false as const,
        reason: 'entitlement_required' as const,
        message:
          'Contact details are private. A verified unlock or active subscription is required.',
        contact: null,
      };
    }

    await this.store.addAudit({
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

  async listEntitlements(user: AuthUser) {
    const items = await this.store.listEntitlements(user.id);
    const sub = await this.store.findActiveSubscription(user.id);
    return {
      items: items.map((item) => this.toEntitlementDto(item)),
      subscription: sub ? this.toEntitlementDto(sub) : null,
    };
  }

  async wipeUser(userId: string) {
    await this.store.revokeUserData(userId);
  }

  signWebhookBody(body: string): string {
    const secret = process.env.RAZORPAY_WEBHOOK_SECRET ?? 'dev_secret';
    return createHmac('sha256', secret).update(body).digest('hex');
  }

  private async markPaid(
    gatewayOrderId: string,
    gatewayPaymentId: string,
    eventId: string,
  ) {
    const order = await this.store.findOrderByGatewayId(gatewayOrderId);
    if (!order) {
      throw new NotFoundException('Payment order not found for webhook');
    }

    if (order.status === 'paid') {
      return {
        order: this.toOrderDto(order),
        entitlement: await this.entitlementForPaidOrder(order),
      };
    }

    if (order.status !== 'created' && order.status !== 'failed') {
      throw new BadRequestException(`Cannot mark order ${order.status} as paid`);
    }

    const updated = (await this.store.updateOrder(order.id, {
      status: 'paid',
      gatewayPaymentId,
    }))!;

    let entitlement: Entitlement | null = null;
    if (order.product === 'subscription' && order.planId) {
      const plan = await this.store.getPlan(order.planId);
      if (!plan) throw new NotFoundException('Subscription plan missing');
      entitlement = await this.store.grantSubscriptionEntitlement({
        userId: order.userId,
        planId: plan.id,
        paymentId: updated.id,
        durationDays: plan.durationDays,
      });
      await this.store.addAudit({
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
      entitlement = await this.store.grantJobContactEntitlement({
        userId: order.userId,
        jobId: order.jobId,
        paymentId: updated.id,
      });
      this.ops?.recordUnlock();
      await this.store.addAudit({
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
      await this.store.addAudit({
        actorId: order.userId,
        action: 'job_post_payment_captured',
        entityType: 'payment',
        entityId: updated.id,
        metadata: { jobId: order.jobId, gatewayPaymentId, eventId },
      });
    }

    await this.store.clearConfirmAttempts(order.id);
    await this.recordHistory({
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

  private async entitlementForPaidOrder(order: PaymentOrder) {
    if (order.product === 'subscription') {
      const sub = await this.store.findActiveSubscription(order.userId);
      return sub ? this.toEntitlementDto(sub) : null;
    }
    if (!order.jobId) return null;
    const ent = await this.store.findActiveJobEntitlement(
      order.userId,
      order.jobId,
    );
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

  private async recordHistory(
    event: Parameters<PaymentsStore['addHistory']>[0],
  ) {
    await this.store.addHistory(event);
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
