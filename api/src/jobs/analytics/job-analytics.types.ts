/** Lifetime + optional window totals for a posted job. */
export interface JobAnalyticsTotals {
  views: number;
  applied: number;
  contacted: number;
  /** Days since effectiveFrom / publishedAt (floor, min 0). */
  daysLive: number;
  reportCount: number;
  /** Active formal applications that are not withdrawn. */
  appliedActive: number;
  /** Apply → contact conversion (contacted / views), 0–100 or null if no views. */
  contactRatePct: number | null;
  /** Apply conversion (applied / views), 0–100 or null if no views. */
  applyRatePct: number | null;
}

export interface JobAnalyticsSeriesPoint {
  /** UTC calendar day YYYY-MM-DD */
  date: string;
  views: number;
  applied: number;
  contacted: number;
}

export interface JobAnalyticsDashboard {
  jobId: string;
  from: string;
  to: string;
  totals: JobAnalyticsTotals;
  series: JobAnalyticsSeriesPoint[];
}

export interface JobViewRecordInput {
  jobId: string;
  /** Stable anonymous key (device / tab / user) for once-per-day dedupe. */
  viewerKey: string;
  at?: Date;
}
