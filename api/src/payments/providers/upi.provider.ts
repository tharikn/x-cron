import { BadRequestException, UnauthorizedException } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import {
  CreateGatewayOrderResult,
  GatewayWebhookPayload,
} from '../payments.types';
import {
  CreatePaymentOrderInput,
  PaymentProvider,
} from './payment-provider';

/**
 * Free UPI collect via merchant VPA (QR payload = intent URI).
 * No PSP fees; production verification needs a real webhook/PSP later.
 */
export class UpiProvider implements PaymentProvider {
  readonly name = 'upi' as const;

  constructor(
    private readonly vpa = process.env.PAYMENT_UPI_VPA ?? '',
    private readonly payeeName = process.env.PAYMENT_UPI_PAYEE_NAME ?? 'X Cron',
  ) {}

  async createOrder(
    input: CreatePaymentOrderInput,
  ): Promise<CreateGatewayOrderResult> {
    if (!this.vpa || !this.vpa.includes('@')) {
      throw new BadRequestException(
        'PAYMENT_UPI_VPA must be set to a valid UPI ID (e.g. merchant@oksbi)',
      );
    }

    const gatewayOrderId = `upi_${uuidv4().replace(/-/g, '').slice(0, 16)}`;
    const amountRupees = (input.amountPaise / 100).toFixed(2);
    const note =
      input.notes?.product === 'subscription'
        ? 'X Cron subscription'
        : 'X Cron contact unlock';
    const intentUri = this.buildIntentUri({
      vpa: this.vpa,
      payeeName: this.payeeName,
      amountRupees,
      note,
      transactionRef: gatewayOrderId,
    });

    return {
      gatewayOrderId,
      amountPaise: input.amountPaise,
      currency: input.currency,
      checkoutMode: 'upi',
      upi: {
        vpa: this.vpa,
        payeeName: this.payeeName,
        intentUri,
        qrPayload: intentUri,
      },
    };
  }

  parseWebhook(
    _rawBody: string | Record<string, unknown>,
    _signature?: string,
  ): GatewayWebhookPayload {
    // Free VPA collect has no bank-signed webhook. Never accept forged callbacks.
    // Use a real PSP adapter (razorpay/cashfree/…) or gated client confirm in non-prod.
    throw new UnauthorizedException(
      'UPI VPA provider rejects webhooks; use a PSP adapter or PAYMENT_UPI_ALLOW_DEV_CONFIRM',
    );
  }

  private buildIntentUri(input: {
    vpa: string;
    payeeName: string;
    amountRupees: string;
    note: string;
    transactionRef: string;
  }): string {
    const q = new URLSearchParams({
      pa: input.vpa,
      pn: input.payeeName,
      am: input.amountRupees,
      cu: 'INR',
      tn: input.note,
      tr: input.transactionRef,
    });
    return `upi://pay?${q.toString()}`;
  }
}
