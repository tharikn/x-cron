import { Logger } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { PushSendResult } from '../notifications.types';
import { PushProvider } from './push-provider';

/**
 * FCM adapter stub. Logs payloads; swaps for firebase-admin when credentials exist.
 */
export class FcmStubProvider implements PushProvider {
  readonly name = 'fcm-stub';
  private readonly logger = new Logger(FcmStubProvider.name);

  async send(input: {
    token: string;
    title: string;
    body: string;
    data?: Record<string, string>;
  }): Promise<PushSendResult> {
    if (!input.token?.trim()) {
      return { ok: false, error: 'missing_token' };
    }
    if (input.token.startsWith('invalid_')) {
      return { ok: false, error: 'invalid_token' };
    }
    const providerMessageId = `fcm_stub_${uuidv4().slice(0, 8)}`;
    this.logger.log(
      `FCM stub → token=${input.token.slice(0, 12)}… title="${input.title}" id=${providerMessageId}`,
    );
    return { ok: true, providerMessageId };
  }
}
