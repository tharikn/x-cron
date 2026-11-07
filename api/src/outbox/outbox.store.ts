import type { OutboxPayload, OutboxRecord, OutboxTopic } from './outbox.types';

export abstract class OutboxStore {
  abstract append(input: {
    topic: OutboxTopic | string;
    payload: OutboxPayload;
    availableAt?: Date;
  }): Promise<OutboxRecord>;

  abstract claimPending(limit: number): Promise<OutboxRecord[]>;

  abstract markProcessed(id: string): Promise<void>;

  abstract markFailed(id: string, error: string, retryAt: Date): Promise<void>;

  abstract countByStatus(): Promise<Record<string, number>>;
}
