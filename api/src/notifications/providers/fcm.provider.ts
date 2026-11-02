import { Logger } from '@nestjs/common';
import { readFileSync } from 'fs';
import { PushSendResult } from '../notifications.types';
import { PushProvider } from './push-provider';

type FirebaseMessaging = {
  send: (message: Record<string, unknown>) => Promise<string>;
};

type FirebaseAdminCompat = {
  getApps: () => unknown[];
  initializeApp: (options: { credential: unknown }) => unknown;
  cert: (serviceAccount: object) => unknown;
};

/**
 * Live FCM via firebase-admin (modular exports: getApps / cert / getMessaging).
 * Requires PUSH_PROVIDER=fcm and FIREBASE_SERVICE_ACCOUNT_JSON or _PATH.
 * Sends a `notification` + `data` message so Android shows the system tray
 * when the app is backgrounded or killed.
 */
export class FcmProvider implements PushProvider {
  readonly name = 'fcm';
  private readonly logger = new Logger(FcmProvider.name);
  private readonly channelId =
    process.env.FCM_ANDROID_CHANNEL_ID || 'xcron-job-alerts-v2';
  private messaging: FirebaseMessaging | null = null;
  private initError: string | null = null;

  private ensureMessaging(): FirebaseMessaging {
    if (this.initError) {
      throw new Error(this.initError);
    }
    if (this.messaging) return this.messaging;

    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const admin = require('firebase-admin') as FirebaseAdminCompat;
    // eslint-disable-next-line @typescript-eslint/no-require-imports
    const { getMessaging } = require('firebase-admin/messaging') as {
      getMessaging: () => FirebaseMessaging;
    };

    if (!admin.getApps().length) {
      const serviceAccount = this.loadServiceAccount();
      if (!serviceAccount) {
        this.initError =
          'missing_firebase_credentials (set FIREBASE_SERVICE_ACCOUNT_JSON or FIREBASE_SERVICE_ACCOUNT_PATH)';
        throw new Error(this.initError);
      }
      admin.initializeApp({
        credential: admin.cert(serviceAccount),
      });
      this.logger.log('Firebase Admin initialized for FCM');
    }

    this.messaging = getMessaging();
    return this.messaging;
  }

  private loadServiceAccount(): object | null {
    const inline = process.env.FIREBASE_SERVICE_ACCOUNT_JSON?.trim();
    if (inline) {
      try {
        return JSON.parse(inline) as object;
      } catch {
        this.logger.error('FIREBASE_SERVICE_ACCOUNT_JSON is not valid JSON');
        return null;
      }
    }
    const path = process.env.FIREBASE_SERVICE_ACCOUNT_PATH?.trim();
    if (path) {
      try {
        return JSON.parse(readFileSync(path, 'utf8')) as object;
      } catch (err) {
        this.logger.error(
          `Failed to read FIREBASE_SERVICE_ACCOUNT_PATH=${path}: ${
            err instanceof Error ? err.message : String(err)
          }`,
        );
        return null;
      }
    }
    return null;
  }

  async send(input: {
    token: string;
    title: string;
    body: string;
    data?: Record<string, string>;
  }): Promise<PushSendResult> {
    if (!input.token?.trim()) {
      return { ok: false, error: 'missing_token' };
    }
    if (input.token.startsWith('stub_fcm_') || input.token.startsWith('invalid_')) {
      return { ok: false, error: 'stub_or_invalid_token' };
    }

    try {
      const messaging = this.ensureMessaging();
      const data: Record<string, string> = {};
      for (const [key, value] of Object.entries(input.data || {})) {
        if (value != null) data[key] = String(value);
      }

      const messageId = await messaging.send({
        token: input.token,
        notification: {
          title: input.title,
          body: input.body,
        },
        data,
        android: {
          priority: 'high',
          notification: {
            channelId: this.channelId,
            sound: 'default',
            priority: 'high',
            defaultVibrateTimings: true,
          },
        },
      });

      return { ok: true, providerMessageId: messageId };
    } catch (err) {
      const message = err instanceof Error ? err.message : String(err);
      this.logger.warn(`FCM send failed: ${message}`);
      return { ok: false, error: message.slice(0, 200) };
    }
  }
}
