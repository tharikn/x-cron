import { Injectable } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { PrismaService } from '../../prisma/prisma.service';
import { JobAnalyticsStore } from './job-analytics.store';
import type { JobAnalyticsSeriesPoint } from './job-analytics.types';

function utcDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

@Injectable()
export class JobAnalyticsPrismaStore extends JobAnalyticsStore {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  async recordView(input: {
    jobId: string;
    viewerKey: string;
    at?: Date;
  }): Promise<boolean> {
    const at = input.at ?? new Date();
    const day = utcDay(at);
    try {
      await this.prisma.jobViewEvent.create({
        data: {
          id: randomUUID(),
          jobId: input.jobId,
          viewerKey: input.viewerKey.slice(0, 128),
          day,
          createdAt: at,
        },
      });
      return true;
    } catch {
      // Unique (jobId, viewerKey, day) — already counted today.
      return false;
    }
  }

  async countViewsByJobIds(jobIds: string[]): Promise<Map<string, number>> {
    const out = new Map<string, number>();
    for (const id of jobIds) out.set(id, 0);
    if (jobIds.length === 0) return out;
    const rows = await this.prisma.jobViewEvent.groupBy({
      by: ['jobId'],
      where: { jobId: { in: jobIds } },
      _count: { _all: true },
    });
    for (const row of rows) {
      out.set(row.jobId, row._count._all);
    }
    return out;
  }

  async listViewSeries(
    jobId: string,
    fromDay: string,
    toDay: string,
  ): Promise<JobAnalyticsSeriesPoint[]> {
    const rows = await this.prisma.jobViewEvent.groupBy({
      by: ['day'],
      where: {
        jobId,
        day: { gte: fromDay, lte: toDay },
      },
      _count: { _all: true },
      orderBy: { day: 'asc' },
    });
    return rows.map((row) => ({
      date: row.day,
      views: row._count._all,
      applied: 0,
      contacted: 0,
    }));
  }
}
