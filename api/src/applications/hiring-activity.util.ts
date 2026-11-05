import { JobApplication } from './applications.types';

/**
 * Public hiring-activity signal for job opening lists.
 *
 * Industry anchors (seeker-facing, earned badges only):
 * - LinkedIn “Actively reviewing applicants”: ≥1 review in the past **14 days**
 * - LinkedIn review-time insight floor: ~**35%** of applications reviewed (30d)
 * - Indeed “Responsive Employer”: response rate **> 51%** over **30 days**
 *   (status updates / rejections count as responses)
 *
 * Product rule: never publish a “low / unresponsive” badge — omit when data
 * is thin or quiet (LinkedIn-style “no insights”), so recruiters are not shamed.
 */

export type HiringActivityLevel = 'high' | 'medium';

export interface HiringActivitySummary {
  level: HiringActivityLevel | null;
  /** Seeker-facing label; null when level is null. */
  badge: string | null;
}

export const HIRING_ACTIVITY_BADGES: Record<HiringActivityLevel, string> = {
  high: 'Actively reviewing',
  medium: 'Usually responds',
};

const DAY_MS = 86_400_000;
/** Indeed / LinkedIn response window. */
export const HIRING_ACTIVITY_RESPONSE_WINDOW_MS = 30 * DAY_MS;
/** LinkedIn “actively reviewing” window. */
export const HIRING_ACTIVITY_ACTIVE_WINDOW_MS = 14 * DAY_MS;
/** Indeed Responsive Employer floor. */
export const HIRING_ACTIVITY_RATE_HIGH = 0.51;
/** LinkedIn review coverage floor. */
export const HIRING_ACTIVITY_RATE_MEDIUM = 0.35;
/** Soft floor so a single application cannot mint a rate badge alone. */
export const HIRING_ACTIVITY_MIN_APPS_FOR_RATE = 2;

/** Employer has opened or moved the application (counts as a “response”). */
export function isEmployerResponse(app: JobApplication): boolean {
  if (app.viewedAt) return true;
  return app.status !== 'applied' && app.status !== 'withdrawn';
}

function hasRecentReview(app: JobApplication, sinceIso: string): boolean {
  if (app.viewedAt && app.viewedAt >= sinceIso) return true;
  if (
    app.status !== 'applied' &&
    app.status !== 'withdrawn' &&
    app.updatedAt >= sinceIso
  ) {
    return true;
  }
  return false;
}

/**
 * Summarize recruiter review activity for one job’s applications.
 * Withdrawn rows are excluded from the 30-day rate (seeker-driven).
 */
export function summarizeHiringActivity(
  apps: JobApplication[],
  nowMs = Date.now(),
): HiringActivitySummary {
  const since30 = new Date(
    nowMs - HIRING_ACTIVITY_RESPONSE_WINDOW_MS,
  ).toISOString();
  const since14 = new Date(
    nowMs - HIRING_ACTIVITY_ACTIVE_WINDOW_MS,
  ).toISOString();

  const windowApps = apps.filter(
    (a) => a.createdAt >= since30 && a.status !== 'withdrawn',
  );
  const reviewed = windowApps.filter(isEmployerResponse);
  const total = windowApps.length;
  const rate = total > 0 ? reviewed.length / total : null;
  const recent = apps.some((a) => hasRecentReview(a, since14));

  // High = LinkedIn active window + Indeed-class response rate
  if (
    recent &&
    rate != null &&
    total >= HIRING_ACTIVITY_MIN_APPS_FOR_RATE &&
    rate >= HIRING_ACTIVITY_RATE_HIGH
  ) {
    return { level: 'high', badge: HIRING_ACTIVITY_BADGES.high };
  }

  // Medium = recent review OR solid coverage (≥35%) with enough volume
  if (
    recent ||
    (rate != null &&
      total >= HIRING_ACTIVITY_MIN_APPS_FOR_RATE &&
      rate >= HIRING_ACTIVITY_RATE_MEDIUM)
  ) {
    return { level: 'medium', badge: HIRING_ACTIVITY_BADGES.medium };
  }

  return { level: null, badge: null };
}
