import { PaymentGatewayId } from '../payments.types';
import { PaymentProvider } from './payment-provider';
import { RazorpayStubProvider } from './razorpay.stub';
import { UpiProvider } from './upi.provider';

/**
 * Resolve active PSP from env. Prefer PAYMENT_GATEWAY; PAYMENT_MODE is legacy.
 */
export function resolvePaymentGatewayId(): PaymentGatewayId {
  const raw = (
    process.env.PAYMENT_GATEWAY ||
    process.env.PAYMENT_MODE ||
    'stub'
  ).toLowerCase();

  if (raw === 'upi') return 'upi';
  if (raw === 'razorpay') return 'razorpay';
  if (raw === 'stub') return 'stub';
  // Unknown → safe local stub
  return 'stub';
}

export function createPaymentProvider(
  gateway: PaymentGatewayId = resolvePaymentGatewayId(),
): PaymentProvider {
  switch (gateway) {
    case 'upi':
      return new UpiProvider();
    case 'razorpay':
      return new RazorpayStubProvider(
        process.env.RAZORPAY_KEY_ID,
        process.env.RAZORPAY_WEBHOOK_SECRET,
        'razorpay',
      );
    case 'stub':
    default:
      return new RazorpayStubProvider(
        process.env.RAZORPAY_KEY_ID,
        process.env.RAZORPAY_WEBHOOK_SECRET,
        'stub',
      );
  }
}
