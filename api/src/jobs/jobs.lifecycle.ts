import { BadRequestException, Injectable } from '@nestjs/common';
import { JobStatus } from './job.types';

/**
 * Job lifecycle (X Cron MVP).
 *
 * Blueprint (`05-JOB-LIFECYCLE`) → X Cron statuses:
 * - DRAFT → `draft` (also used when employer deactivates / “pauses”)
 * - PENDING_REVIEW → `needs-review` (Blog Approval / import path)
 * - PUBLISHED → `published`
 * - PAUSED → `draft` via deactivate (no separate `paused` status in MVP)
 * - CLOSED → `removed` via hide (no separate `closed` status in MVP)
 * - EXPIRED / REJECTED / REMOVED → same names
 *
 * Transitions are enforced server-side here; activate / deactivate / approve /
 * reject / hide / auto-expire must call `assertTransition` before mutating.
 */
export type JobLifecycleActor = 'employer' | 'admin' | 'system';

const ALLOWED: Record<JobLifecycleActor, ReadonlyArray<readonly [JobStatus, JobStatus]>> =
  {
    employer: [
      ['draft', 'published'],
      ['expired', 'published'],
      ['published', 'draft'],
      ['published', 'removed'],
      ['draft', 'removed'],
      ['expired', 'removed'],
      ['needs-review', 'removed'],
      ['rejected', 'removed'],
    ],
    admin: [
      ['needs-review', 'published'],
      ['needs-review', 'rejected'],
    ],
    system: [
      ['published', 'expired'],
      ['needs-review', 'rejected'],
    ],
  };

@Injectable()
export class JobsLifecycleService {
  assertTransition(
    from: JobStatus,
    to: JobStatus,
    actor: JobLifecycleActor,
  ): void {
    if (from === to) return;
    const ok = ALLOWED[actor].some(([a, b]) => a === from && b === to);
    if (!ok) {
      throw new BadRequestException(
        `Cannot transition job from ${from} to ${to} (${actor})`,
      );
    }
  }

  /** True when `now` is past `expiresAt` (invalid dates → not past). */
  isPastExpiry(
    job: { expiresAt: string },
    now = Date.now(),
  ): boolean {
    const until = Date.parse(job.expiresAt);
    return Number.isFinite(until) && now > until;
  }

  /** Public listing / apply window (effectiveFrom → expiresAt). */
  isListingWindowOpen(job: {
    effectiveFrom?: string;
    publishedAt: string;
    expiresAt: string;
  }, now = Date.now()): boolean {
    const from = Date.parse(job.effectiveFrom || job.publishedAt);
    const until = Date.parse(job.expiresAt);
    if (Number.isFinite(from) && now < from) return false;
    if (Number.isFinite(until) && now > until) return false;
    return true;
  }
}
