import { createHmac, timingSafeEqual } from 'crypto';
import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateGatewayOrderResult,
  GatewayWebhookPayload,
  PaymentGatewayId,
} from '../payments.types';
import {
  CreatePaymentOrderInput,
  PaymentProvider,
} from './payment-provider';

/**
 * Razorpay adapter stub.
 * Real SDK/keys can replace this later; webhook HMAC shape matches Razorpay docs.
 */
export class RazorpayStubProvider implements PaymentProvider {
  readonly name: PaymentGatewayId;

  constructor(
    private readonly keyId = process.env.RAZORPAY_KEY_ID ?? 'rzp_test_stub',
    private readonly webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET ?? 'dev_secret',
    private readonly mode: 'stub' | 'razorpay' = 'stub',
  ) {
    this.name = mode === 'razorpay' ? 'razorpay' : 'stub';
  }

  async createOrder(
    input: CreatePaymentOrderInput,
  ): Promise<CreateGatewayOrderResult> {
    const gatewayOrderId = `order_${uuidv4().replace(/-/g, '').slice(0, 14)}`;
    return {
      gatewayOrderId,
      amountPaise: input.amountPaise,
      currency: input.currency,
      keyId: this.keyId,
      checkoutMode: this.mode,
    };
  }

  parseWebhook(
    rawBody: string | Record<string, unknown>,
    signature?: string,
  ): GatewayWebhookPayload {
    const bodyString =
      typeof rawBody === 'string' ? rawBody : JSON.stringify(rawBody);
    this.verifySignature(bodyString, signature);

    const payload =
      typeof rawBody === 'string'
        ? (JSON.parse(rawBody) as Record<string, unknown>)
        : rawBody;

    const event = String(payload.event ?? '');
    const paymentEntity = this.extractPaymentEntity(payload);
    const gatewayOrderId = String(
      paymentEntity.order_id ?? payload.gatewayOrderId ?? '',
    );
    const gatewayPaymentId = String(
      paymentEntity.id ?? payload.gatewayPaymentId ?? '',
    );

    if (!gatewayOrderId || !gatewayPaymentId) {
      throw new BadRequestException('Webhook missing order/payment ids');
    }

    const paid =
      event === 'payment.captured' ||
      event === 'order.paid' ||
      payload.status === 'paid' ||
      paymentEntity.status === 'captured' ||
      paymentEntity.status === 'authorized';

    return {
      gatewayOrderId,
      gatewayPaymentId,
      status: paid ? 'paid' : 'failed',
      rawEventId: String(payload.id ?? payload.event_id ?? gatewayPaymentId),
    };
  }

  private verifySignature(body: string, signature?: string): void {
    if (!signature) {
      throw new UnauthorizedException('Missing Razorpay signature');
    }
    const expected = createHmac('sha256', this.webhookSecret)
      .update(body)
      .digest('hex');
    const a = Buffer.from(expected);
    const b = Buffer.from(signature);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new UnauthorizedException('Invalid Razorpay signature');
    }
  }

  private extractPaymentEntity(
    payload: Record<string, unknown>,
  ): Record<string, unknown> {
    const nested = payload.payload as
      | { payment?: { entity?: Record<string, unknown> } }
      | undefined;
    return nested?.payment?.entity ?? {};
  }
}
