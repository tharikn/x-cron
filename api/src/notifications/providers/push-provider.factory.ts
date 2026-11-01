import { FcmStubProvider } from './fcm.stub';
import { PushProvider } from './push-provider';

export type PushProviderId = 'stub' | 'fcm';

/**
 * Resolve push adapter. Default stub = ₹0 (log-only). `fcm` reserved for firebase-admin.
 */
export function resolvePushProviderId(): PushProviderId {
  const raw = (
    process.env.PUSH_PROVIDER ||
    process.env.NOTIFICATION_MODE ||
    'stub'
  ).toLowerCase();
  if (raw === 'fcm') return 'fcm';
  return 'stub';
}

export function createPushProvider(
  id: PushProviderId = resolvePushProviderId(),
): PushProvider {
  switch (id) {
    case 'fcm':
      // Live Firebase wiring later — same stub interface until credentials exist.
      return new FcmStubProvider();
    case 'stub':
    default:
      return new FcmStubProvider();
  }
}
