import {
  CreateGatewayOrderResult,
  GatewayWebhookPayload,
} from '../payments.types';

export interface PaymentProvider {
  readonly name: 'razorpay';
  createOrder(input: {
    amountPaise: number;
    currency: 'INR';
    receipt: string;
    notes?: Record<string, string>;
  }): Promise<CreateGatewayOrderResult>;
  parseWebhook(
    rawBody: string | Record<string, unknown>,
    signature?: string,
  ): GatewayWebhookPayload;
}
