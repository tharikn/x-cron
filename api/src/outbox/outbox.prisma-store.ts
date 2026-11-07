import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { OutboxStore } from './outbox.store';
import type {
  OutboxPayload,
  OutboxRecord,
  OutboxTopic,
} from './outbox.types';

@Injectable()
export class OutboxPrismaStore extends OutboxStore {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async append(input: {
    topic: OutboxTopic | string;
    payload: OutboxPayload;
    availableAt?: Date;
  }): Promise<OutboxRecord> {
    const row = await this.prisma.outboxEvent.create({
      data: {
        topic: input.topic,
        payloadJson: input.payload as object,
        status: 'pending',
        availableAt: input.availableAt ?? new Date(),
      },
    });
    return this.map(row);
  }

  async claimPending(limit: number): Promise<OutboxRecord[]> {
    const now = new Date();
    const pending = await this.prisma.outboxEvent.findMany({
      where: {
        status: { in: ['pending', 'failed'] },
        availableAt: { lte: now },
      },
      orderBy: { createdAt: 'asc' },
      take: Math.max(1, Math.min(limit, 100)),
    });

    const claimed: OutboxRecord[] = [];
    for (const row of pending) {
      const updated = await this.prisma.outboxEvent.updateMany({
        where: {
          id: row.id,
          status: { in: ['pending', 'failed'] },
        },
        data: {
          status: 'processing',
          attempts: { increment: 1 },
        },
      });
      if (updated.count !== 1) continue;
      const fresh = await this.prisma.outboxEvent.findUnique({
        where: { id: row.id },
      });
      if (fresh) claimed.push(this.map(fresh));
    }
    return claimed;
  }

  async markProcessed(id: string): Promise<void> {
    await this.prisma.outboxEvent.update({
      where: { id },
      data: {
        status: 'processed',
        processedAt: new Date(),
        lastError: null,
      },
    });
  }

  async markFailed(
    id: string,
    error: string,
    retryAt: Date,
  ): Promise<void> {
    await this.prisma.outboxEvent.update({
      where: { id },
      data: {
        status: 'failed',
        lastError: error.slice(0, 2000),
        availableAt: retryAt,
      },
    });
  }

  async countByStatus(): Promise<Record<string, number>> {
    const groups = await this.prisma.outboxEvent.groupBy({
      by: ['status'],
      _count: { _all: true },
    });
    const out: Record<string, number> = {};
    for (const g of groups) out[g.status] = g._count._all;
    return out;
  }

  private map(row: {
    id: string;
    topic: string;
    payloadJson: unknown;
    status: string;
    attempts: number;
    availableAt: Date;
    processedAt: Date | null;
    lastError: string | null;
    createdAt: Date;
  }): OutboxRecord {
    return {
      id: row.id,
      topic: row.topic,
      payload: (row.payloadJson ?? {}) as OutboxPayload,
      status: row.status as OutboxRecord['status'],
      attempts: row.attempts,
      availableAt: row.availableAt.toISOString(),
      processedAt: row.processedAt?.toISOString(),
      lastError: row.lastError ?? undefined,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
