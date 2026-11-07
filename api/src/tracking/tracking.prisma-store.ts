import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TrackingStore } from './tracking.store';
import type { TrackingEvent, TrackingEventType } from './tracking.types';

@Injectable()
export class TrackingPrismaStore extends TrackingStore {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async record(event: TrackingEvent): Promise<TrackingEvent> {
    await this.prisma.trackingEvent.create({
      data: {
        id: event.id,
        type: event.type,
        userId: event.userId ?? null,
        visitorKey: event.visitorKey ?? null,
        jobId: event.jobId ?? null,
        path: event.path ?? null,
        ip: event.ip ?? null,
        userAgent: event.userAgent ?? null,
        durationMs: event.durationMs ?? null,
        metaJson: (event.meta as object | undefined) ?? undefined,
        createdAt: new Date(event.createdAt),
      },
    });
    return event;
  }

  async listEvents(filter?: {
    userId?: string;
    visitorKey?: string;
    type?: TrackingEventType;
    from?: string;
    to?: string;
    limit?: number;
  }): Promise<TrackingEvent[]> {
    const limit = Math.min(Math.max(filter?.limit ?? 20_000, 1), 50_000);
    const rows = await this.prisma.trackingEvent.findMany({
      where: {
        userId: filter?.userId,
        visitorKey: filter?.visitorKey,
        type: filter?.type,
        createdAt: {
          gte: filter?.from ? new Date(filter.from) : undefined,
          lte: filter?.to ? new Date(filter.to) : undefined,
        },
      },
      orderBy: { createdAt: 'asc' },
      take: limit,
    });
    return rows.map((row) => this.map(row));
  }

  async clearForUser(userId: string): Promise<void> {
    await this.prisma.trackingEvent.deleteMany({ where: { userId } });
  }

  private map(row: {
    id: string;
    type: string;
    userId: string | null;
    visitorKey: string | null;
    jobId: string | null;
    path: string | null;
    ip: string | null;
    userAgent: string | null;
    durationMs: number | null;
    metaJson: unknown;
    createdAt: Date;
  }): TrackingEvent {
    return {
      id: row.id,
      type: row.type as TrackingEventType,
      userId: row.userId ?? undefined,
      visitorKey: row.visitorKey ?? undefined,
      jobId: row.jobId ?? undefined,
      path: row.path ?? undefined,
      ip: row.ip ?? undefined,
      userAgent: row.userAgent ?? undefined,
      durationMs: row.durationMs ?? undefined,
      meta:
        row.metaJson && typeof row.metaJson === 'object'
          ? (row.metaJson as Record<string, unknown>)
          : undefined,
      createdAt: row.createdAt.toISOString(),
    };
  }
}
