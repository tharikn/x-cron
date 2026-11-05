import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  Optional,
} from '@nestjs/common';
import { toSnapshot } from '../apply-profiles/apply-profiles.types';
import { ApplyProfilesService } from '../apply-profiles/apply-profiles.service';
import { AuthUser } from '../auth/auth.types';
import { toPublicJob } from '../jobs/jobs.mapper';
import { JobsStore } from '../jobs/jobs.store';
import { NotificationsService } from '../notifications/notifications.service';
import { OpsService } from '../ops/ops.service';
import { ReputationService } from '../reputation/reputation.service';
import { SeekerService } from '../seeker/seeker.service';
import { SiteService } from '../site/site.service';
import { ApplicationsStore } from './applications.store';
import {
  APPLICATION_SPAM_REASON_LABELS,
  APPLICATION_STATUS_LABELS,
  ApplicationStatus,
  EMPLOYER_TRANSITIONS,
  JobApplication,
  SEEKER_TRANSITIONS,
} from './applications.types';
import {
  AddApplicationNoteDto,
  ApplyJobDto,
  SendApplicationMessageDto,
  TransitionApplicationDto,
  WithdrawApplicationDto,
} from './dto/applications.dto';
import {
  HiringActivitySummary,
  summarizeHiringActivity,
} from './hiring-activity.util';

@Injectable()
export class ApplicationsService {
  constructor(
    private readonly store: ApplicationsStore,
    private readonly jobs: JobsStore,
    private readonly site: SiteService,
    private readonly notifications: NotificationsService,
    private readonly applyProfiles: ApplyProfilesService,
    private readonly reputation: ReputationService,
    private readonly seeker: SeekerService,
    @Optional() private readonly ops?: OpsService,
  ) {}

  /**
   * Public hiring-activity badges for job opening lists (Indeed / LinkedIn style).
   * Quiet or thin data → null (no “low” badge).
   */
  async summarizeHiringActivityForJobs(
    jobIds: string[],
  ): Promise<Map<string, HiringActivitySummary>> {
    const out = new Map<string, HiringActivitySummary>();
    const unique = [...new Set(jobIds.filter(Boolean))];
    await Promise.all(
      unique.map(async (jobId) => {
        const apps = await this.store.listForJob(jobId);
        out.set(jobId, summarizeHiringActivity(apps));
      }),
    );
    return out;
  }

  async apply(user: AuthUser, jobId: string, dto: ApplyJobDto) {
    const job = await this.jobs.findById(jobId);
    if (!job || job.status !== 'published') {
      throw new NotFoundException('Job not found');
    }
    if (!job.ownerUserId || !job.employerId) {
      throw new BadRequestException('Job has no employer owner');
    }
    const existing = await this.store.findBySeekerAndJob(user.id, jobId);
    if (existing && existing.status !== 'withdrawn') {
      throw new ConflictException('You already applied to this job');
    }
    if (existing?.status === 'withdrawn') {
      throw new ConflictException(
        'Application was withdrawn; contact the employer to re-apply',
      );
    }

    const contact = await this.requireApplyContact(user, dto);
    const screeningAnswer = this.requireScreeningAnswer(job.screeningQuestion, dto);
    const profile = await this.applyProfiles.requireOwnedProfile(
      user.id,
      dto.applyProfileId,
    );
    this.applyProfiles.assertReadyForApply(profile);
    const snapshot = toSnapshot(profile);
    const coverNote = dto.coverNote?.trim() || undefined;

    await this.assertApplyAntiSpam(user.id);
    await this.assertIdenticalCoverNote(user.id, coverNote);
    const spamRisk = await this.evaluateSpamRisk(user.id);
    const matchPercent = this.reputation.computeMatch(snapshot, job);

    const app = await this.store.createApplication({
      jobId,
      employerId: job.employerId,
      seekerUserId: user.id,
      ownerUserId: job.ownerUserId,
      coverNote,
      applyProfileId: profile.id,
      applyProfileSnapshot: snapshot,
      seekerName: contact.name,
      seekerPhone: contact.phone,
      seekerEmail: contact.email,
      screeningAnswer,
      likelySpam: spamRisk.likelySpam,
      spamReasons: spamRisk.spamReasons,
      matchPercent,
    });

    const event = await this.store.appendEvent({
      applicationId: app.id,
      type: 'applied',
      toStatus: 'applied',
      actorUserId: user.id,
      actorRole: 'seeker',
      note: coverNote,
      meta: {
        jobTitle: job.title,
        city: job.location.city,
        applyProfileId: profile.id,
        applyProfileName: snapshot.name,
        likelySpam: spamRisk.likelySpam,
        matchPercent,
      },
    });

    await this.notifications.onApplicationEvent({
      applicationId: app.id,
      jobId: job.id,
      jobTitle: job.title,
      jobSlug: job.slug,
      city: job.location.city,
      status: 'applied',
      recipientUserId: job.ownerUserId,
      recipientRole: 'employer',
      title: 'New job application',
      body: `${app.seekerName || 'A seeker'} applied for ${job.title} (${snapshot.name})`,
      eventType: 'applied',
    });

    await this.reputation.onSeekerApply({
      seekerUserId: user.id,
      applicationId: app.id,
      jobId: job.id,
      matchPercent,
    });

    this.ops?.recordApply();

    return this.toDetailDto(app, [event], job);
  }

  async listMine(user: AuthUser) {
    const rows = await this.store.listForSeeker(user.id);
    const items = [];
    for (const row of rows) {
      const job = await this.jobs.findById(row.jobId);
      if (!job || job.status === 'removed') continue;
      items.push({
        ...(await this.toListDto(row, false)),
        job: toPublicJob(job, null, this.site.getUnlockPricePaise()),
      });
    }
    return { items };
  }

  async getMine(user: AuthUser, id: string) {
    const app = await this.requireSeekerApp(user, id);
    const job = await this.jobs.findById(app.jobId);
    if (!job) throw new NotFoundException('Job not found');
    const timeline = await this.store.listEvents(app.id);
    const messages = await this.store.listMessages(app.id);
    return this.toDetailDto(app, timeline, job, false, messages);
  }

  async withdraw(
    user: AuthUser,
    id: string,
    dto: WithdrawApplicationDto,
  ) {
    const app = await this.requireSeekerApp(user, id);
    const allowed = SEEKER_TRANSITIONS[app.status] ?? [];
    if (!allowed.includes('withdrawn')) {
      throw new BadRequestException(
        `Cannot withdraw from status “${APPLICATION_STATUS_LABELS[app.status]}”`,
      );
    }
    return this.transitionInternal({
      app,
      toStatus: 'withdrawn',
      actor: user,
      actorRole: 'seeker',
      note: dto.note,
      eventType: 'withdrawn',
      notifyUserId: app.ownerUserId,
      notifyRole: 'employer',
      title: 'Application withdrawn',
      body: `${app.seekerName || 'A seeker'} withdrew their application`,
    });
  }

  async listForJob(user: AuthUser, jobId: string) {
    const job = await this.requireOwnedJob(user, jobId);
    const rows = await this.store.listForJob(jobId);
    const items = [];
    for (const row of rows) {
      items.push(await this.toListDto(row, true));
    }
    return {
      job: toPublicJob(job, null, this.site.getUnlockPricePaise()),
      items,
    };
  }

  async listForEmployer(user: AuthUser) {
    const rows = await this.store.listForOwner(user.id);
    const items = [];
    for (const row of rows) {
      const job = await this.jobs.findById(row.jobId);
      if (!job || job.status === 'removed') continue;
      items.push({
        ...(await this.toListDto(row, true)),
        job: toPublicJob(job, null, this.site.getUnlockPricePaise()),
      });
    }
    return { items };
  }

  async getForEmployer(user: AuthUser, id: string) {
    const app = await this.requireEmployerApp(user, id);
    const job = await this.jobs.findById(app.jobId);
    if (!job) throw new NotFoundException('Job not found');

    let current = app;
    if (!app.viewedAt) {
      const now = new Date().toISOString();
      current =
        (await this.store.updateApplication(app.id, { viewedAt: now })) ?? app;
      await this.store.appendEvent({
        applicationId: app.id,
        type: 'viewed_by_employer',
        actorUserId: user.id,
        actorRole: user.roles.includes('admin') ? 'admin' : 'employer',
        meta: { firstView: true },
      });
      await this.notifications.onApplicationEvent({
        applicationId: app.id,
        jobId: job.id,
        jobTitle: job.title,
        jobSlug: job.slug,
        city: job.location.city,
        status: current.status,
        recipientUserId: app.seekerUserId,
        recipientRole: 'seeker',
        title: 'Employer viewed your application',
        body: `Your application for ${job.title} was opened`,
        eventType: 'viewed_by_employer',
      });
      await this.reputation.onEmployerViewed({
        employerUserId: user.id,
        applicationId: app.id,
        jobId: job.id,
      });
    }

    const timeline = await this.store.listEvents(current.id);
    const messages = await this.store.listMessages(current.id);
    return this.toDetailDto(current, timeline, job, true, messages);
  }

  async transition(
    user: AuthUser,
    id: string,
    dto: TransitionApplicationDto,
  ) {
    const app = await this.requireEmployerApp(user, id);
    const toStatus = dto.status as ApplicationStatus;
    const allowed = EMPLOYER_TRANSITIONS[app.status] ?? [];
    if (!allowed.includes(toStatus)) {
      throw new BadRequestException(
        `Cannot move from “${APPLICATION_STATUS_LABELS[app.status]}” to “${APPLICATION_STATUS_LABELS[toStatus]}”`,
      );
    }
    if (toStatus === 'offered' && !dto.offerLetterText?.trim() && !app.offerLetterText) {
      throw new BadRequestException(
        'Offer / job letter text is required when issuing an offer',
      );
    }

    return this.transitionInternal({
      app,
      toStatus,
      actor: user,
      actorRole: user.roles.includes('admin') ? 'admin' : 'employer',
      note: dto.note,
      offerLetterText: dto.offerLetterText?.trim(),
      eventType: toStatus === 'offered' ? 'offer_issued' : 'status_changed',
      notifyUserId: app.seekerUserId,
      notifyRole: 'seeker',
      title: this.statusNotifyTitle(toStatus),
      body: this.statusNotifyBody(toStatus),
    });
  }

  async addNote(user: AuthUser, id: string, dto: AddApplicationNoteDto) {
    const app = await this.requireEmployerApp(user, id);
    const job = await this.jobs.findById(app.jobId);
    if (!job) throw new NotFoundException('Job not found');

    await this.store.appendEvent({
      applicationId: app.id,
      type: 'note_added',
      actorUserId: user.id,
      actorRole: user.roles.includes('admin') ? 'admin' : 'employer',
      note: dto.note.trim(),
    });

    await this.notifications.onApplicationEvent({
      applicationId: app.id,
      jobId: job.id,
      jobTitle: job.title,
      jobSlug: job.slug,
      city: job.location.city,
      status: app.status,
      recipientUserId: app.seekerUserId,
      recipientRole: 'seeker',
      title: 'Update on your application',
      body: `Employer added a note on ${job.title}`,
      eventType: 'note_added',
    });

    const timeline = await this.store.listEvents(app.id);
    const messages = await this.store.listMessages(app.id);
    return this.toDetailDto(app, timeline, job, true, messages);
  }

  async listMessages(user: AuthUser, id: string) {
    const app = await this.requireParticipant(user, id);
    const items = await this.store.listMessages(app.id);
    return { items };
  }

  async sendMessage(
    user: AuthUser,
    id: string,
    dto: SendApplicationMessageDto,
  ) {
    const app = await this.requireParticipant(user, id);
    if (app.status === 'withdrawn') {
      throw new BadRequestException('Cannot chat on a withdrawn application');
    }
    const body = dto.body.trim();
    if (!body) throw new BadRequestException('Message body is required');

    const isSeeker = app.seekerUserId === user.id;
    const senderRole: 'seeker' | 'employer' | 'admin' = user.roles.includes(
      'admin',
    )
      ? 'admin'
      : isSeeker
        ? 'seeker'
        : 'employer';

    const prior = await this.store.listMessages(app.id);
    const last = prior.length ? prior[prior.length - 1] : undefined;

    const message = await this.store.appendMessage({
      applicationId: app.id,
      senderUserId: user.id,
      senderRole,
      body,
    });

    await this.store.appendEvent({
      applicationId: app.id,
      type: 'chat_message',
      actorUserId: user.id,
      actorRole: senderRole,
      note: body.slice(0, 200),
      meta: { messageId: message.id },
    });

    const job = await this.jobs.findById(app.jobId);
    if (job) {
      const recipientUserId = isSeeker ? app.ownerUserId : app.seekerUserId;
      const recipientRole = isSeeker ? 'employer' : 'seeker';
      await this.notifications.onApplicationEvent({
        applicationId: app.id,
        jobId: job.id,
        jobTitle: job.title,
        jobSlug: job.slug,
        city: job.location.city,
        status: app.status,
        recipientUserId,
        recipientRole,
        title: 'New application message',
        body: `${isSeeker ? app.seekerName || 'Seeker' : 'Recruiter'}: ${body.slice(0, 120)}`,
        eventType: 'chat_message',
      });
      await this.reputation.onChatReply({
        senderUserId: user.id,
        senderRole,
        applicationId: app.id,
        jobId: job.id,
        priorSenderRole: last?.senderRole ?? null,
      });
    }

    return message;
  }

  clearForUser(userId: string) {
    return this.store.clearForUser(userId);
  }

  private async transitionInternal(input: {
    app: JobApplication;
    toStatus: ApplicationStatus;
    actor: AuthUser;
    actorRole: 'seeker' | 'employer' | 'admin';
    note?: string;
    offerLetterText?: string;
    eventType: 'status_changed' | 'offer_issued' | 'withdrawn';
    notifyUserId: string;
    notifyRole: 'seeker' | 'employer';
    title: string;
    body: string;
  }) {
    const job = await this.jobs.findById(input.app.jobId);
    if (!job) throw new NotFoundException('Job not found');

    const patch: Parameters<ApplicationsStore['updateApplication']>[1] = {
      status: input.toStatus,
    };
    if (input.offerLetterText) {
      patch.offerLetterText = input.offerLetterText;
    }

    const updated =
      (await this.store.updateApplication(input.app.id, patch)) ?? input.app;

    await this.store.appendEvent({
      applicationId: input.app.id,
      type: input.eventType,
      fromStatus: input.app.status,
      toStatus: input.toStatus,
      actorUserId: input.actor.id,
      actorRole: input.actorRole,
      note: input.note?.trim() || undefined,
      meta: input.offerLetterText
        ? { hasOfferLetter: true }
        : undefined,
    });

    await this.notifications.onApplicationEvent({
      applicationId: updated.id,
      jobId: job.id,
      jobTitle: job.title,
      jobSlug: job.slug,
      city: job.location.city,
      status: input.toStatus,
      recipientUserId: input.notifyUserId,
      recipientRole: input.notifyRole,
      title: input.title,
      body: input.body,
      eventType: input.eventType,
    });

    if (input.actorRole === 'employer' || input.actorRole === 'admin') {
      await this.reputation.onEmployerStatusAdvanced({
        employerUserId: input.actor.id,
        applicationId: updated.id,
        jobId: job.id,
        fromStatus: input.app.status,
        toStatus: input.toStatus,
      });
    }

    const timeline = await this.store.listEvents(updated.id);
    const messages = await this.store.listMessages(updated.id);
    const asEmployer = input.actorRole !== 'seeker';
    return this.toDetailDto(updated, timeline, job, asEmployer, messages);
  }

  private async requireSeekerApp(user: AuthUser, id: string) {
    const app = await this.store.findById(id);
    if (!app) throw new NotFoundException('Application not found');
    if (app.seekerUserId !== user.id) {
      throw new ForbiddenException('Not your application');
    }
    return app;
  }

  private async requireEmployerApp(user: AuthUser, id: string) {
    const app = await this.store.findById(id);
    if (!app) throw new NotFoundException('Application not found');
    const isAdmin = user.roles.includes('admin');
    if (!isAdmin && app.ownerUserId !== user.id) {
      throw new ForbiddenException('Not your job application');
    }
    return app;
  }

  private async requireParticipant(user: AuthUser, id: string) {
    const app = await this.store.findById(id);
    if (!app) throw new NotFoundException('Application not found');
    const isAdmin = user.roles.includes('admin');
    if (
      !isAdmin &&
      app.seekerUserId !== user.id &&
      app.ownerUserId !== user.id
    ) {
      throw new ForbiddenException('Not a participant on this application');
    }
    return app;
  }

  private async requireOwnedJob(user: AuthUser, jobId: string) {
    const job = await this.jobs.findById(jobId);
    if (!job) throw new NotFoundException('Job not found');
    const isAdmin = user.roles.includes('admin');
    if (!isAdmin && job.ownerUserId !== user.id) {
      throw new ForbiddenException('Not your job');
    }
    return job;
  }

  private async toListDto(app: JobApplication, forEmployer = false) {
    const counterpart = forEmployer
      ? await this.reputation.summarize(app.seekerUserId, 'seeker')
      : await this.reputation.summarize(app.ownerUserId, 'employer');
    const base = {
      id: app.id,
      jobId: app.jobId,
      employerId: app.employerId,
      seekerUserId: app.seekerUserId,
      ownerUserId: app.ownerUserId,
      status: app.status,
      statusLabel: APPLICATION_STATUS_LABELS[app.status],
      seekerName: app.seekerName ?? null,
      seekerPhone: app.seekerPhone ?? null,
      seekerEmail: app.seekerEmail ?? null,
      coverNote: app.coverNote ?? null,
      applyProfileId: app.applyProfileId ?? null,
      applyProfileSnapshot: app.applyProfileSnapshot ?? null,
      screeningAnswer: app.screeningAnswer ?? null,
      offerLetterText: app.offerLetterText ?? null,
      viewedAt: app.viewedAt ?? null,
      matchPercent:
        typeof app.matchPercent === 'number' ? app.matchPercent : null,
      reputation: counterpart,
      createdAt: app.createdAt,
      updatedAt: app.updatedAt,
    };
    if (!forEmployer) return base;
    const likelySpam = !!app.likelySpam;
    const reasons = app.spamReasons ?? [];
    return {
      ...base,
      likelySpam,
      spamBadge: likelySpam ? 'Likely spam' : null,
      spamReasons: reasons,
      spamReasonLabels: reasons.map(
        (code) => APPLICATION_SPAM_REASON_LABELS[code] ?? code,
      ),
    };
  }

  /** When the job sets a screening question, require a non-empty answer. */
  private requireScreeningAnswer(
    question: string | undefined,
    dto: ApplyJobDto,
  ): string | undefined {
    const q = question?.trim();
    if (!q) return undefined;
    const answer = dto.screeningAnswer?.trim() || '';
    if (answer.length < 2) {
      throw new BadRequestException(
        'This job requires an answer to the screening question',
      );
    }
    return answer;
  }

  /**
   * Name + phone or email required so bots cannot apply as anonymous shells.
   * Prefer apply DTO → auth identity → Account seeker profile (mobile/email/name).
   */
  private async requireApplyContact(
    user: AuthUser,
    dto: ApplyJobDto,
  ): Promise<{ name: string; phone?: string; email?: string }> {
    const profile = await this.seeker.getProfile(user);
    const name = (
      dto.seekerName?.trim() ||
      user.displayName?.trim() ||
      profile.displayName?.trim() ||
      user.username?.trim() ||
      ''
    ).trim();
    const phone = (
      dto.seekerPhone?.trim() ||
      user.phone?.trim() ||
      profile.mobile?.trim() ||
      ''
    ).trim();
    const email = (
      dto.seekerEmail?.trim() ||
      user.email?.trim() ||
      profile.email?.trim() ||
      ''
    ).trim();
    if (!name) {
      throw new BadRequestException(
        'Complete your profile: add a display name before applying',
      );
    }
    if (!phone && !email) {
      throw new BadRequestException(
        'Complete your profile: add a phone or email before applying',
      );
    }
    return {
      name,
      phone: phone || undefined,
      email: email || undefined,
    };
  }

  private async toDetailDto(
    app: JobApplication,
    timeline: Awaited<ReturnType<ApplicationsStore['listEvents']>>,
    job: Awaited<ReturnType<JobsStore['findById']>>,
    includeSeekerContact = false,
    messages: Awaited<ReturnType<ApplicationsStore['listMessages']>> = [],
  ) {
    const list = await this.toListDto(app, includeSeekerContact);
    return {
      ...list,
      seekerPhone: includeSeekerContact ? app.seekerPhone ?? null : null,
      seekerEmail: includeSeekerContact ? app.seekerEmail ?? null : null,
      job: job
        ? toPublicJob(job, null, this.site.getUnlockPricePaise())
        : null,
      timeline: timeline.map((e) => ({
        id: e.id,
        type: e.type,
        fromStatus: e.fromStatus ?? null,
        toStatus: e.toStatus ?? null,
        fromStatusLabel: e.fromStatus
          ? APPLICATION_STATUS_LABELS[e.fromStatus]
          : null,
        toStatusLabel: e.toStatus
          ? APPLICATION_STATUS_LABELS[e.toStatus]
          : null,
        actorRole: e.actorRole,
        note: e.note ?? null,
        meta: e.meta ?? null,
        at: e.at,
      })),
      messages: messages.map((m) => ({
        id: m.id,
        senderUserId: m.senderUserId,
        senderRole: m.senderRole,
        body: m.body,
        createdAt: m.createdAt,
      })),
    };
  }

  private statusNotifyTitle(status: ApplicationStatus): string {
    switch (status) {
      case 'under_review':
        return 'Application under review';
      case 'shortlisted':
        return 'You were shortlisted';
      case 'interview':
        return 'Interview update';
      case 'offered':
        return 'Job offer / letter received';
      case 'hired':
        return 'You were hired';
      case 'rejected':
        return 'Application update';
      default:
        return 'Application status updated';
    }
  }

  private statusNotifyBody(status: ApplicationStatus): string {
    return `Your application is now: ${APPLICATION_STATUS_LABELS[status]}`;
  }

  /**
   * Soft velocity signal for employers (does not block apply).
   * Thresholds sit below hard hourly/daily caps so badge appears before 403.
   */
  private async evaluateSpamRisk(
    seekerUserId: string,
  ): Promise<{ likelySpam: boolean; spamReasons: string[] }> {
    const reasons: string[] = [];
    const hourlyRaw = Number(process.env.APPLY_VELOCITY_FLAG_HOURLY ?? 5);
    const hourly =
      Number.isFinite(hourlyRaw) && hourlyRaw > 0 ? hourlyRaw : 5;
    const dailyRaw = Number(process.env.APPLY_VELOCITY_FLAG_DAILY ?? 12);
    const daily =
      Number.isFinite(dailyRaw) && dailyRaw > 0 ? dailyRaw : 12;

    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const hourUsed = await this.store.countCreatedBySeekerSince(
      seekerUserId,
      hourAgo,
    );
    if (hourUsed + 1 >= hourly) {
      reasons.push('high_velocity_1h');
    }

    const dayStart = new Date();
    dayStart.setUTCHours(0, 0, 0, 0);
    const dayUsed = await this.store.countCreatedBySeekerSince(
      seekerUserId,
      dayStart.toISOString(),
    );
    if (dayUsed + 1 >= daily) {
      reasons.push('high_velocity_day');
    }

    return { likelySpam: reasons.length > 0, spamReasons: reasons };
  }

  /**
   * Reject copy-paste cover notes reused across many jobs in a short window.
   * Empty notes skip this check (volume caps still apply).
   */
  private async assertIdenticalCoverNote(
    seekerUserId: string,
    coverNote: string | undefined,
  ): Promise<void> {
    if (!coverNote) return;
    const normalized = this.normalizeCoverNote(coverNote);
    if (!normalized) return;

    const windowMs = Math.max(
      60_000,
      Number(process.env.APPLY_IDENTICAL_NOTE_WINDOW_MS ?? 86_400_000) ||
        86_400_000,
    );
    const maxRaw = Number(process.env.APPLY_IDENTICAL_NOTE_MAX ?? 2);
    const max =
      Number.isFinite(maxRaw) && maxRaw > 0 ? maxRaw : 2;

    const since = new Date(Date.now() - windowMs).toISOString();
    const recent = await this.store.listCoverNotesBySeekerSince(
      seekerUserId,
      since,
    );
    const same = recent.filter(
      (n) => this.normalizeCoverNote(n) === normalized,
    ).length;
    if (same >= max) {
      throw new ForbiddenException(
        `This cover note was already used on ${same} recent applications. Write a role-specific note.`,
      );
    }
  }

  private normalizeCoverNote(raw: string): string {
    return raw.trim().toLowerCase().replace(/\s+/g, ' ');
  }

  /**
   * Anti-spam: cooldown between applies + UTC daily cap + rolling hourly cap.
   * Burst throttle is `@ApplyThrottle` on the controller.
   */
  private async assertApplyAntiSpam(seekerUserId: string): Promise<void> {
    const cooldownMs = Math.max(
      0,
      Number(process.env.APPLY_COOLDOWN_MS ?? 30_000) || 30_000,
    );
    if (cooldownMs > 0) {
      const latest = await this.store.latestCreatedAtForSeeker(seekerUserId);
      if (latest) {
        const elapsed = Date.now() - new Date(latest).getTime();
        if (elapsed < cooldownMs) {
          const waitSec = Math.ceil((cooldownMs - elapsed) / 1000);
          throw new ForbiddenException(
            `Please wait ${waitSec}s before applying to another job.`,
          );
        }
      }
    }

    const hourlyRaw = Number(process.env.APPLY_HOURLY_CAP ?? 8);
    const hourly =
      Number.isFinite(hourlyRaw) && hourlyRaw > 0 ? hourlyRaw : 8;
    const hourAgo = new Date(Date.now() - 60 * 60 * 1000).toISOString();
    const hourUsed = await this.store.countCreatedBySeekerSince(
      seekerUserId,
      hourAgo,
    );
    if (hourUsed >= hourly) {
      throw new ForbiddenException(
        `Hourly application limit reached (${hourly}). Slow down to avoid spam.`,
      );
    }

    const raw = Number(process.env.APPLY_DAILY_CAP ?? 20);
    const limit = Number.isFinite(raw) && raw > 0 ? raw : 20;
    const start = new Date();
    start.setUTCHours(0, 0, 0, 0);
    const used = await this.store.countCreatedBySeekerSince(
      seekerUserId,
      start.toISOString(),
    );
    if (used >= limit) {
      throw new ForbiddenException(
        `Daily application limit reached (${limit}). Try again tomorrow.`,
      );
    }
  }
}
