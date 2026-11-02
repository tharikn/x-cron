import { FcmProvider } from './fcm.provider';
import { FcmStubProvider } from './fcm.stub';
import { PushProvider } from './push-provider';

export type PushProviderId = 'stub' | 'fcm';

/**
 * Resolve push adapter. Default stub = ₹0 (log-only).
 * `fcm` uses firebase-admin when FIREBASE_SERVICE_ACCOUNT_* is set;
 * otherwise falls back to stub so boot never crashes.
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

function hasFirebaseCredentials(): boolean {
  return Boolean(
    process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim() ||
      process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim(),
  );
}

export function createPushProvider(
  id: PushProviderId = resolvePushProviderId(),
): PushProvider {
  switch (id) {
    case 'fcm':
      if (!hasFirebaseCredentials()) {
        return new FcmStubProvider();
      }
      return new FcmProvider();
    case 'stub':
    default:
      return new FcmStubProvider();
  }
}
