import { Injectable } from '@nestjs/common';
import { AuthUser } from '../auth/auth.types';
import {
  MATCH_GOOD_THRESHOLD,
  computeMatchPercent,
} from './match-score.util';
import { ReputationStore } from './reputation.store';
import {
  REPUTATION_DELTAS,
  REPUTATION_EVENT_LABELS,
  ReputationBand,
  ReputationEventType,
  ReputationRole,
  clampReputation,
  reputationBand,
  reputationBandLabel,
} from './reputation.types';
import type { ApplyProfileSnapshot } from '../apply-profiles/apply-profiles.types';
import type { JobRecord } from '../jobs/job.types';

export interface ReputationPublicSummary {
  userId: string;
  role: ReputationRole;
  score: number;
  band: ReputationBand;
  bandLabel: string;
}

export interface ReputationMeDto extends ReputationPublicSummary {
  tips: string[];
  howItWorks: string[];
  events: Array<{
    id: string;
    type: ReputationEventType;
    typeLabel: string;
    delta: number;
    scoreAfter: number;
    applicationId: string | null;
    jobId: string | null;
    matchPercent: number | null;
    note: string | null;
    createdAt: string;
  }>;
}

@Injectable()
export class ReputationService {
  constructor(private readonly store: ReputationStore) {}

  async getMine(user: AuthUser, role?: ReputationRole): Promise<{
    items: ReputationMeDto[];
  }> {
    const roles = this.resolveRoles(user, role);
    const items: ReputationMeDto[] = [];
    for (const r of roles) {
      items.push(await this.buildMeDto(user.id, r));
    }
    return { items };
  }

  async getPublic(
    userId: string,
    role: ReputationRole,
  ): Promise<ReputationPublicSummary> {
    const row = await this.store.getScore(userId, role);
    const band = reputationBand(row.score);
    return {
      userId,
      role,
      score: row.score,
      band,
      bandLabel: reputationBandLabel(band),
    };
  }

  /** Summaries for list cards (employer sees seeker; seeker sees employer). */
  async summarize(
    userId: string,
    role: ReputationRole,
  ): Promise<ReputationPublicSummary> {
    return this.getPublic(userId, role);
  }

  computeMatch(
    snapshot: ApplyProfileSnapshot | undefined,
    job: JobRecord,
  ): number {
    return computeMatchPercent(snapshot, job);
  }

  async onSeekerApply(input: {
    seekerUserId: string;
    applicationId: string;
    jobId: string;
    matchPercent: number;
  }): Promise<void> {
    await this.recordEvent({
      userId: input.seekerUserId,
      role: 'seeker',
      type: 'apply_active',
      applicationId: input.applicationId,
      jobId: input.jobId,
      matchPercent: input.matchPercent,
      note: 'Applied to a role',
    });
    const good = input.matchPercent >= MATCH_GOOD_THRESHOLD;
    await this.recordEvent({
      userId: input.seekerUserId,
      role: 'seeker',
      type: good ? 'apply_good_match' : 'apply_poor_match',
      applicationId: input.applicationId,
      jobId: input.jobId,
      matchPercent: input.matchPercent,
      note: good
        ? `Fit ${input.matchPercent}% — skills/experience aligned`
        : `Fit ${input.matchPercent}% — apply closer matches to protect your score`,
    });
  }

  async onEmployerViewed(input: {
    employerUserId: string;
    applicationId: string;
    jobId: string;
  }): Promise<void> {
    await this.recordEvent({
      userId: input.employerUserId,
      role: 'employer',
      type: 'application_viewed',
      applicationId: input.applicationId,
      jobId: input.jobId,
      note: 'Opened an application',
    });
  }

  async onEmployerStatusAdvanced(input: {
    employerUserId: string;
    applicationId: string;
    jobId: string;
    fromStatus: string;
    toStatus: string;
  }): Promise<void> {
    const forward = [
      'under_review',
      'shortlisted',
      'interview',
      'offered',
      'hired',
      'rejected',
    ];
    if (!forward.includes(input.toStatus)) return;
    if (input.fromStatus === input.toStatus) return;
    await this.recordEvent({
      userId: input.employerUserId,
      role: 'employer',
      type: 'status_advanced',
      applicationId: input.applicationId,
      jobId: input.jobId,
      note: `Moved application to ${input.toStatus}`,
    });
  }

  async onChatReply(input: {
    senderUserId: string;
    senderRole: 'seeker' | 'employer' | 'admin';
    applicationId: string;
    jobId: string;
    priorSenderRole?: 'seeker' | 'employer' | 'admin' | null;
  }): Promise<void> {
    if (input.senderRole === 'admin') return;
    if (!input.priorSenderRole || input.priorSenderRole === input.senderRole) {
      return;
    }
    const role: ReputationRole =
      input.senderRole === 'seeker' ? 'seeker' : 'employer';
    await this.recordEvent({
      userId: input.senderUserId,
      role,
      type: 'message_reply',
      applicationId: input.applicationId,
      jobId: input.jobId,
      note: 'Replied in application chat',
    });
  }

  clearForUser(userId: string) {
    return this.store.clearForUser(userId);
  }

  private async recordEvent(input: {
    userId: string;
    role: ReputationRole;
    type: ReputationEventType;
    applicationId?: string;
    jobId?: string;
    matchPercent?: number;
    note?: string;
  }): Promise<void> {
    const rules = REPUTATION_DELTAS[input.type];
    if (rules.dailyCap != null) {
      const count = await this.store.countEventsToday(
        input.userId,
        input.role,
        input.type,
      );
      if (count >= rules.dailyCap) return;
    }

    const current = await this.store.getScore(input.userId, input.role);
    const nextScore = clampReputation(current.score + rules.delta);
    await this.store.setScore({
      userId: input.userId,
      role: input.role,
      score: nextScore,
      updatedAt: new Date().toISOString(),
    });
    await this.store.appendEvent({
      userId: input.userId,
      role: input.role,
      type: input.type,
      delta: rules.delta,
      scoreAfter: nextScore,
      applicationId: input.applicationId,
      jobId: input.jobId,
      matchPercent: input.matchPercent,
      note: input.note,
    });
  }

  private resolveRoles(
    user: AuthUser,
    role?: ReputationRole,
  ): ReputationRole[] {
    if (role === 'seeker' || role === 'employer') return [role];
    const out: ReputationRole[] = ['seeker'];
    if (user.roles.includes('employer') || user.roles.includes('admin')) {
      out.push('employer');
    }
    return out;
  }

  private async buildMeDto(
    userId: string,
    role: ReputationRole,
  ): Promise<ReputationMeDto> {
    const row = await this.store.getScore(userId, role);
    const band = reputationBand(row.score);
    const events = await this.store.listEvents(userId, role, 40);
    return {
      userId,
      role,
      score: row.score,
      band,
      bandLabel: reputationBandLabel(band),
      tips: this.tipsFor(role, band),
      howItWorks: this.howItWorks(role),
      events: events.map((e) => ({
        id: e.id,
        type: e.type,
        typeLabel: REPUTATION_EVENT_LABELS[e.type],
        delta: e.delta,
        scoreAfter: e.scoreAfter,
        applicationId: e.applicationId ?? null,
        jobId: e.jobId ?? null,
        matchPercent: e.matchPercent ?? null,
        note: e.note ?? null,
        createdAt: e.createdAt,
      })),
    };
  }

  private howItWorks(role: ReputationRole): string[] {
    if (role === 'seeker') {
      return [
        'Everyone starts at 50 (Steady). Score stays between 0 and 100.',
        'Applying to roles builds points when you stay active.',
        'Fit ≥50% (skills + experience vs the job) adds points; fit under 50% lowers your score.',
        'Replying when a recruiter messages you shows discipline and raises your score.',
        'Recruiters see your Performance Score on applications — apply thoughtfully.',
      ];
    }
    return [
      'Everyone starts at 50 (Steady). Score stays between 0 and 100.',
      'Opening applications promptly earns points.',
      'Moving candidates forward (review, shortlist, interview, decide) raises your score.',
      'Replying when a seeker messages you shows professionalism.',
      'Seekers see your Performance Score so responsive employers stand out.',
    ];
  }

  private tipsFor(role: ReputationRole, band: ReputationBand): string[] {
    if (role === 'seeker') {
      const base = [
        'Match your apply-profile skills to the job before you apply.',
        'Answer screening questions and reply in chat within a day.',
      ];
      if (band === 'needs_care') {
        return [
          'Pause spray-applying — low-fit applies hurt your score.',
          ...base,
        ];
      }
      if (band === 'rising') {
        return [
          'Keep applying to strong fits — recruiters already see a strong signal.',
          ...base,
        ];
      }
      return base;
    }
    const base = [
      'Open new applications the same day when you can.',
      'Update status so seekers are not left guessing.',
    ];
    if (band === 'needs_care') {
      return [
        'Clear your inbox: view and advance or politely reject pending applies.',
        ...base,
      ];
    }
    return base;
  }
}
