import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { OutboxStore } from './outbox.store';
import type {
  OutboxPayload,
  OutboxRecord,
  OutboxTopic,
} from './outbox.types';

@Injectable()
export class OutboxMemoryStore extends OutboxStore {
  private readonly rows = new Map<string, OutboxRecord>();

  async append(input: {
    topic: OutboxTopic | string;
    payload: OutboxPayload;
    availableAt?: Date;
  }): Promise<OutboxRecord> {
    const now = new Date().toISOString();
    const row: OutboxRecord = {
      id: `outbox_${randomUUID().slice(0, 12)}`,
      topic: input.topic,
      payload: input.payload,
      status: 'pending',
      attempts: 0,
      availableAt: (input.availableAt ?? new Date()).toISOString(),
      createdAt: now,
    };
    this.rows.set(row.id, row);
    return row;
  }

  async claimPending(limit: number): Promise<OutboxRecord[]> {
    const now = Date.now();
    const pending = [...this.rows.values()]
      .filter(
        (r) =>
          (r.status === 'pending' || r.status === 'failed') &&
          Date.parse(r.availableAt) <= now,
      )
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt))
      .slice(0, Math.max(1, Math.min(limit, 100)));

    const claimed: OutboxRecord[] = [];
    for (const row of pending) {
      const next: OutboxRecord = {
        ...row,
        status: 'processing',
        attempts: row.attempts + 1,
      };
      this.rows.set(row.id, next);
      claimed.push(next);
    }
    return claimed;
  }

  async markProcessed(id: string): Promise<void> {
    const row = this.rows.get(id);
    if (!row) return;
    this.rows.set(id, {
      ...row,
      status: 'processed',
      processedAt: new Date().toISOString(),
      lastError: undefined,
    });
  }

  async markFailed(
    id: string,
    error: string,
    retryAt: Date,
  ): Promise<void> {
    const row = this.rows.get(id);
    if (!row) return;
    this.rows.set(id, {
      ...row,
      status: 'failed',
      lastError: error.slice(0, 2000),
      availableAt: retryAt.toISOString(),
    });
  }

  async countByStatus(): Promise<Record<string, number>> {
    const out: Record<string, number> = {};
    for (const row of this.rows.values()) {
      out[row.status] = (out[row.status] ?? 0) + 1;
    }
    return out;
  }
}
