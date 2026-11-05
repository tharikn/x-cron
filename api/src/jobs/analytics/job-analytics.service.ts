import {
  Inject,
  Injectable,
  NotFoundException,
  Optional,
  forwardRef,
} from '@nestjs/common';
import { ApplicationsStore } from '../../applications/applications.store';
import { SeekerStore } from '../../seeker/seeker.store';
import { JobsStore } from '../jobs.store';
import { JobAnalyticsStore } from './job-analytics.store';
import type {
  JobAnalyticsDashboard,
  JobAnalyticsSeriesPoint,
  JobAnalyticsTotals,
} from './job-analytics.types';

function utcDay(d: Date): string {
  return d.toISOString().slice(0, 10);
}

function addUtcDays(day: string, delta: number): string {
  const d = new Date(`${day}T00:00:00.000Z`);
  d.setUTCDate(d.getUTCDate() + delta);
  return utcDay(d);
}

function daysBetween(fromIso: string, to = new Date()): number {
  const start = new Date(fromIso);
  if (Number.isNaN(start.getTime())) return 0;
  const ms = to.getTime() - start.getTime();
  return Math.max(0, Math.floor(ms / (24 * 60 * 60 * 1000)));
}

function ratePct(num: number, den: number): number | null {
  if (den <= 0) return null;
  return Math.round((num / den) * 1000) / 10;
}

function emptyBuckets(fromDay: string, toDay: string): string[] {
  const out: string[] = [];
  let cur = fromDay;
  while (cur <= toDay) {
    out.push(cur);
    cur = addUtcDays(cur, 1);
  }
  return out;
}

@Injectable()
export class JobAnalyticsService {
  constructor(
    private readonly analyticsStore: JobAnalyticsStore,
    private readonly jobsStore: JobsStore,
    @Optional()
    @Inject(forwardRef(() => ApplicationsStore))
    private readonly applications?: ApplicationsStore,
    @Optional()
    @Inject(forwardRef(() => SeekerStore))
    private readonly seeker?: SeekerStore,
  ) {}

  async recordJobView(
    jobId: string,
    viewerKey: string,
  ): Promise<{ ok: true; counted: boolean }> {
    const job = await this.jobsStore.findById(jobId);
    if (!job || job.status === 'removed') {
      throw new NotFoundException('Job not found');
    }
    const key = (viewerKey || 'anon').trim().slice(0, 128) || 'anon';
    const counted = await this.analyticsStore.recordView({
      jobId,
      viewerKey: key,
    });
    return { ok: true, counted };
  }

  async summarizeForJobs(
    jobs: Array<{
      id: string;
      publishedAt?: string;
      effectiveFrom?: string;
      reportCount?: number;
    }>,
  ): Promise<Map<string, JobAnalyticsTotals>> {
    const ids = jobs.map((j) => j.id);
    const views = await this.analyticsStore.countViewsByJobIds(ids);
    const applied = await this.countAppliedByJobIds(ids);
    const contacted = await this.countContactedByJobIds(ids);
    const out = new Map<string, JobAnalyticsTotals>();
    for (const job of jobs) {
      const v = views.get(job.id) ?? 0;
      const a = applied.get(job.id) ?? { total: 0, active: 0 };
      const c = contacted.get(job.id) ?? 0;
      const start = job.effectiveFrom || job.publishedAt || new Date().toISOString();
      out.set(job.id, {
        views: v,
        applied: a.total,
        appliedActive: a.active,
        contacted: c,
        daysLive: daysBetween(start),
        reportCount: job.reportCount ?? 0,
        applyRatePct: ratePct(a.total, v),
        contactRatePct: ratePct(c, v),
      });
    }
    return out;
  }

  async dashboardForOwner(
    ownerUserId: string,
    jobId: string,
    days = 30,
  ): Promise<JobAnalyticsDashboard> {
    const job = await this.jobsStore.findById(jobId);
    if (!job || job.ownerUserId !== ownerUserId) {
      throw new NotFoundException('Job not found');
    }
    const window = Math.min(90, Math.max(1, days));
    const toDay = utcDay(new Date());
    const fromDay = addUtcDays(toDay, -(window - 1));

    const totalsMap = await this.summarizeForJobs([job]);
    const totals = totalsMap.get(job.id)!;

    const viewSeries = await this.analyticsStore.listViewSeries(
      jobId,
      fromDay,
      toDay,
    );
    const viewByDay = new Map(viewSeries.map((p) => [p.date, p.views]));
    const appliedByDay = await this.appliedSeries(jobId, fromDay, toDay);
    const contactedByDay = await this.contactedSeries(jobId, fromDay, toDay);

    const series: JobAnalyticsSeriesPoint[] = emptyBuckets(fromDay, toDay).map(
      (date) => ({
        date,
        views: viewByDay.get(date) ?? 0,
        applied: appliedByDay.get(date) ?? 0,
        contacted: contactedByDay.get(date) ?? 0,
      }),
    );

    return {
      jobId,
      from: fromDay,
      to: toDay,
      totals,
      series,
    };
  }

  private async countAppliedByJobIds(
    jobIds: string[],
  ): Promise<Map<string, { total: number; active: number }>> {
    const out = new Map<string, { total: number; active: number }>();
    for (const id of jobIds) out.set(id, { total: 0, active: 0 });
    if (!this.applications || jobIds.length === 0) return out;
    for (const jobId of jobIds) {
      const rows = await this.applications.listForJob(jobId);
      let total = 0;
      let active = 0;
      for (const row of rows) {
        total += 1;
        if (row.status !== 'withdrawn') active += 1;
      }
      out.set(jobId, { total, active });
    }
    return out;
  }

  private async countContactedByJobIds(
    jobIds: string[],
  ): Promise<Map<string, number>> {
    const out = new Map<string, number>();
    for (const id of jobIds) out.set(id, 0);
    if (!this.seeker || jobIds.length === 0) return out;
    const wanted = new Set(jobIds);
    const rows = await this.seeker.listApplicationsForJobIds(jobIds);
    for (const row of rows) {
      if (!wanted.has(row.jobId)) continue;
      out.set(row.jobId, (out.get(row.jobId) ?? 0) + 1);
    }
    return out;
  }

  private async appliedSeries(
    jobId: string,
    fromDay: string,
    toDay: string,
  ): Promise<Map<string, number>> {
    const out = new Map<string, number>();
    if (!this.applications) return out;
    const rows = await this.applications.listForJob(jobId);
    for (const row of rows) {
      const day = utcDay(new Date(row.createdAt));
      if (day < fromDay || day > toDay) continue;
      out.set(day, (out.get(day) ?? 0) + 1);
    }
    return out;
  }

  private async contactedSeries(
    jobId: string,
    fromDay: string,
    toDay: string,
  ): Promise<Map<string, number>> {
    const out = new Map<string, number>();
    if (!this.seeker) return out;
    const rows = await this.seeker.listApplicationsForJobIds([jobId]);
    for (const row of rows) {
      const day = utcDay(new Date(row.createdAt));
      if (day < fromDay || day > toDay) continue;
      out.set(day, (out.get(day) ?? 0) + 1);
    }
    return out;
  }
}
