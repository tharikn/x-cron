import {
  CreateGatewayOrderResult,
  GatewayWebhookPayload,
  PaymentGatewayId,
} from '../payments.types';

export interface CreatePaymentOrderInput {
  amountPaise: number;
  currency: 'INR';
  receipt: string;
  notes?: Record<string, string>;
}

/**
 * Strategy/Adapter contract for all PSPs and the free UPI VPA path.
 * See `.cursor/skills/xcron-payments/SKILL.md`.
 */
export interface PaymentProvider {
  readonly name: PaymentGatewayId;
  createOrder(input: CreatePaymentOrderInput): Promise<CreateGatewayOrderResult>;
  parseWebhook(
    rawBody: string | Record<string, unknown>,
    signature?: string,
    headers?: Record<string, string | undefined>,
  ): GatewayWebhookPayload;
}
