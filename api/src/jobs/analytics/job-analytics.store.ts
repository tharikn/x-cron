import type { JobAnalyticsSeriesPoint } from './job-analytics.types';

export abstract class JobAnalyticsStore {
  /**
   * Record a listing view. Deduped once per (jobId, viewerKey, UTC day).
   * @returns true when a new view was counted.
   */
  abstract recordView(input: {
    jobId: string;
    viewerKey: string;
    at?: Date;
  }): Promise<boolean>;

  /** Lifetime view counts keyed by jobId (missing keys = 0). */
  abstract countViewsByJobIds(jobIds: string[]): Promise<Map<string, number>>;

  /** Daily view series for one job (inclusive UTC day range). */
  abstract listViewSeries(
    jobId: string,
    fromDay: string,
    toDay: string,
  ): Promise<JobAnalyticsSeriesPoint[]>;
}
