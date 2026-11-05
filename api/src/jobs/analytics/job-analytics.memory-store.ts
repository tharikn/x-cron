import { Injectable } from '@nestjs/common';
import { JobAnalyticsStore } from './job-analytics.store';
import type { JobAnalyticsSeriesPoint } from './job-analytics.types';

function utcDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

@Injectable()
export class JobAnalyticsMemoryStore extends JobAnalyticsStore {
  /** key = `${jobId}|${viewerKey}|${day}` */
  private readonly views = new Map<
    string,
    { jobId: string; day: string; at: string }
  >();

  async recordView(input: {
    jobId: string;
    viewerKey: string;
    at?: Date;
  }): Promise<boolean> {
    const at = input.at ?? new Date();
    const day = utcDay(at);
    const key = `${input.jobId}|${input.viewerKey}|${day}`;
    if (this.views.has(key)) return false;
    this.views.set(key, {
      jobId: input.jobId,
      day,
      at: at.toISOString(),
    });
    return true;
  }

  async countViewsByJobIds(jobIds: string[]): Promise<Map<string, number>> {
    const wanted = new Set(jobIds);
    const out = new Map<string, number>();
    for (const id of jobIds) out.set(id, 0);
    for (const row of this.views.values()) {
      if (!wanted.has(row.jobId)) continue;
      out.set(row.jobId, (out.get(row.jobId) ?? 0) + 1);
    }
    return out;
  }

  async listViewSeries(
    jobId: string,
    fromDay: string,
    toDay: string,
  ): Promise<JobAnalyticsSeriesPoint[]> {
    const counts = new Map<string, number>();
    for (const row of this.views.values()) {
      if (row.jobId !== jobId) continue;
      if (row.day < fromDay || row.day > toDay) continue;
      counts.set(row.day, (counts.get(row.day) ?? 0) + 1);
    }
    return [...counts.entries()]
      .sort(([a], [b]) => a.localeCompare(b))
      .map(([date, views]) => ({
        date,
        views,
        applied: 0,
        contacted: 0,
      }));
  }
}
