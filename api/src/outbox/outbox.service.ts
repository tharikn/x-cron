import { Injectable, Logger } from '@nestjs/common';
import { isOutboxEnabled } from '../config/env.validation';
import { OutboxStore } from './outbox.store';
import type { OutboxPayload, OutboxRecord, OutboxTopic } from './outbox.types';

@Injectable()
export class OutboxService {
  private readonly logger = new Logger(OutboxService.name);

  constructor(private readonly store: OutboxStore) {}

  get enabled(): boolean {
    return isOutboxEnabled();
  }

  /**
   * Persist an event for reliable async delivery. Callers should prefer this
   * over direct queue enqueue when durability matters (same TX as domain write
   * when the store is Prisma and the caller wraps a transaction).
   */
  async record(
    topic: OutboxTopic | string,
    payload: OutboxPayload,
  ): Promise<OutboxRecord | null> {
    if (!this.enabled) return null;
    const row = await this.store.append({ topic, payload });
    this.logger.debug(`outbox append topic=${topic} id=${row.id}`);
    return row;
  }

  claimPending(limit = 25) {
    return this.store.claimPending(limit);
  }

  markProcessed(id: string) {
    return this.store.markProcessed(id);
  }

  markFailed(id: string, error: string, attempts: number) {
    const delayMs = Math.min(60_000, 2_000 * Math.pow(2, Math.max(0, attempts - 1)));
    const retryAt = new Date(Date.now() + delayMs);
    return this.store.markFailed(id, error, retryAt);
  }

  counts() {
    return this.store.countByStatus();
  }
}
