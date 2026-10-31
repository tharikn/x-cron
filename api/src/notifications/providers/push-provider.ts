import { PushSendResult } from '../notifications.types';

export interface PushProvider {
  readonly name: string;
  send(input: {
    token: string;
    title: string;
    body: string;
    data?: Record<string, string>;
  }): Promise<PushSendResult>;
}
