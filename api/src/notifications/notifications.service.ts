import {
  ForbiddenException,
  Injectable,
  Logger,
  NotFoundException,
} from '@nestjs/common';
import { AuthStore } from '../auth/auth.store';
import { AuthUser } from '../auth/auth.types';
import { JobRecord } from '../jobs/job.types';
import { JobsStore } from '../jobs/jobs.store';
import { PreferencesService } from '../preferences/preferences.service';
import { PreferenceRecord } from '../preferences/preferences.types';
import {
  DevSendNotificationDto,
  NotificationPreferencesDto,
  RegisterDeviceDto,
} from './dto/notifications.dto';
import { NotificationsStore } from './notifications.store';
import {
  NotificationChannel,
  NotificationStatus,
} from './notifications.types';
import { createMailProvider } from './providers/mail-provider.factory';
import { createPushProvider } from './providers/push-provider.factory';

@Injectable()
export class NotificationsService {
  private readonly logger = new Logger(NotificationsService.name);
  private readonly push = createPushProvider();
  private readonly mail = createMailProvider();

  constructor(
    private readonly store: NotificationsStore,
    private readonly jobs: JobsStore,
    private readonly preferences: PreferencesService,
    private readonly auth: AuthStore,
  ) {}

  async registerDevice(dto: RegisterDeviceDto, user?: AuthUser) {
    const device = await this.store.upsertDevice({
      userId: user?.id,
      deviceId: dto.deviceId,
      fcmToken: dto.fcmToken,
      platform: dto.platform,
    });
    return {
      id: device.id,
      deviceId: device.deviceId,
      platform: device.platform,
      userId: device.userId ?? null,
      provider: this.push.name,
      updatedAt: device.updatedAt,
    };
  }

  getNotificationPreferences(user: AuthUser) {
    return this.store.getNotificationPrefs(user.id);
  }

  saveNotificationPreferences(user: AuthUser, dto: NotificationPreferencesDto) {
    return this.store.saveNotificationPrefs(user.id, dto);
  }

  async listInApp(user: AuthUser) {
    const items = await this.store.listForUser(user.id);
    return {
      items: items.map((n) => ({
        id: n.id,
        title: n.title,
        body: n.body,
        status: n.status,
        jobId: n.jobId ?? null,
        createdAt: n.createdAt,
        readAt: n.readAt ?? null,
        data: n.data ?? null,
      })),
    };
  }

  async markRead(user: AuthUser, id: string) {
    const n = await this.store.findNotification(id);
    if (!n || n.userId !== user.id) {
      throw new NotFoundException('Notification not found');
    }
    const updated = (await this.store.updateNotification(id, {
      status: 'read',
      readAt: new Date().toISOString(),
    }))!;
    return {
      id: updated.id,
      status: updated.status,
      readAt: updated.readAt,
    };
  }

  async listDispatches(limit = 50) {
    return {
      pushProvider: this.push.name,
      mailProvider: this.mail.name,
      items: await this.store.listDispatches(limit),
    };
  }

  async getDispatch(id: string) {
    const dispatch = await this.store.findDispatch(id);
    if (!dispatch) throw new NotFoundException('Dispatch not found');
    return {
      dispatch,
      deliveries: await this.store.listDeliveriesForDispatch(id),
    };
  }

  /**
   * Fan-out job alerts to preference-matched subscribers (in-app + push + mail).
   * Zero-cost providers by default; writes dispatch + delivery history.
   */
  async onJobPublished(jobId: string) {
    const job = await this.jobs.findById(jobId);
    const dispatch = await this.store.startDispatch({
      triggerType: 'job_published',
      jobId,
      meta: {
        pushProvider: this.push.name,
        mailProvider: this.mail.name,
      },
    });

    if (!job || job.status !== 'published') {
      await this.store.finishDispatch(dispatch.id, 'skipped');
      await this.store.updateDispatch(dispatch.id, {
        skippedReason: !job ? 'job_not_found' : 'not_published',
      });
      return {
        dispatchId: dispatch.id,
        matched: 0,
        sent: 0,
        suppressed: 0,
        failed: 0,
        skipped: true,
      };
    }

    const candidates = await this.collectSubscriberCandidates();
    let matched = 0;
    let sent = 0;
    let suppressed = 0;
    let failed = 0;

    const batchSize = Math.max(
      1,
      Number(process.env.NOTIFICATION_FANOUT_BATCH || 25) || 25,
    );

    for (let i = 0; i < candidates.length; i += batchSize) {
      const slice = candidates.slice(i, i + batchSize);
      for (const { userId, preferences } of slice) {
        if (!this.matchesJob(preferences, job)) continue;
        matched += 1;
        const result = await this.deliverJobAlert(userId, job, {
          dispatchId: dispatch.id,
        });
        if (result.sent) sent += 1;
        else if (result.reason === 'failed') failed += 1;
        else suppressed += 1;
      }
      if (i + batchSize < candidates.length) {
        await new Promise((r) => setImmediate(r));
      }
    }

    await this.store.updateDispatch(dispatch.id, {
      matchedCount: matched,
      sentCount: sent,
      suppressedCount: suppressed,
      failedCount: failed,
    });
    await this.store.finishDispatch(dispatch.id, 'completed');
    this.logger.log(
      `Dispatch ${dispatch.id} job=${jobId} matched=${matched} sent=${sent} suppressed=${suppressed} failed=${failed}`,
    );

    return {
      dispatchId: dispatch.id,
      matched,
      sent,
      suppressed,
      failed,
      jobId,
    };
  }

  async devSend(dto: DevSendNotificationDto) {
    const mode = (
      process.env.PUSH_PROVIDER ||
      process.env.NOTIFICATION_MODE ||
      'stub'
    ).toLowerCase();
    if (mode !== 'stub' && mode !== 'fcm') {
      throw new ForbiddenException('Dev send only in stub/fcm mode');
    }
    const title = dto.title || 'X Cron Jobs';
    const body = dto.body || 'Test notification from stub providers.';
    const job = dto.jobId ? await this.jobs.findById(dto.jobId) : undefined;
    if (job) {
      const dispatch = await this.store.startDispatch({
        triggerType: 'dev_test',
        jobId: job.id,
      });
      const result = await this.deliverJobAlert(dto.userId, job, {
        force: true,
        dispatchId: dispatch.id,
      });
      await this.store.updateDispatch(dispatch.id, {
        matchedCount: 1,
        sentCount: result.sent ? 1 : 0,
        suppressedCount: result.sent ? 0 : 1,
      });
      await this.store.finishDispatch(dispatch.id, 'completed');
      return { ...result, dispatchId: dispatch.id };
    }
    return this.deliverCustom(dto.userId, title, body);
  }

  async clearForUser(user: AuthUser) {
    await this.store.clearForUser(user.id);
  }

  /**
   * Subscribers = users with job prefs and/or explicit notification prefs.
   * Empty job filters + jobAlertsEnabled ⇒ subscribed to all new jobs (capped).
   */
  private async collectSubscriberCandidates(): Promise<
    Array<{
      userId: string;
      preferences: PreferenceRecord;
    }>
  > {
    const byUser = new Map<string, PreferenceRecord>();
    for (const row of this.preferences.listUserPreferences()) {
      byUser.set(row.userId, row.preferences);
    }
    for (const userId of await this.store.listNotificationPrefUserIds()) {
      if (!byUser.has(userId)) {
        byUser.set(
          userId,
          this.preferences.getForUser({
            id: userId,
          } as AuthUser),
        );
      }
    }
    for (const user of this.auth.listUsers()) {
      if (user.status !== 'active') continue;
      if (!byUser.has(user.id)) {
        const prefs = await this.store.getNotificationPrefs(user.id);
        if (!prefs.jobAlertsEnabled) continue;
        byUser.set(user.id, this.preferences.getForUser(user));
      }
    }
    return [...byUser.entries()].map(([userId, preferences]) => ({
      userId,
      preferences,
    }));
  }

  private matchesJob(
    preferences: {
      locations: string[];
      jobTypes: string[];
      categories: string[];
      languages: string[];
      salaryMin: number | null;
      remotePreferred: boolean;
    },
    job: JobRecord,
  ): boolean {
    const hasAnyFilter =
      preferences.locations.length > 0 ||
      preferences.jobTypes.length > 0 ||
      preferences.categories.length > 0 ||
      preferences.salaryMin != null ||
      preferences.remotePreferred;

    if (!hasAnyFilter) return true;

    if (preferences.locations.length) {
      const hay = [
        job.location.city,
        job.location.district,
        job.location.state,
        job.location.locality,
      ]
        .filter(Boolean)
        .join(' ')
        .toLowerCase();
      const ok = preferences.locations.some((loc) =>
        hay.includes(loc.trim().toLowerCase()),
      );
      if (!ok) return false;
    }
    if (
      preferences.jobTypes.length &&
      !preferences.jobTypes.includes(job.jobType)
    ) {
      return false;
    }
    if (
      preferences.categories.length &&
      !preferences.categories.includes(job.category)
    ) {
      return false;
    }
    if (
      preferences.languages.length &&
      !preferences.languages.includes(job.contentLanguage)
    ) {
      return false;
    }
    if (preferences.salaryMin != null) {
      const max = job.salary?.max ?? job.salary?.min;
      if (max == null || max < preferences.salaryMin) return false;
    }
    if (preferences.remotePreferred && !job.location.remote) {
      return false;
    }
    return true;
  }

  private async deliverJobAlert(
    userId: string,
    job: JobRecord,
    opts?: { force?: boolean; dispatchId?: string },
  ) {
    const dedupeKey = `job_published:${job.id}:${userId}`;
    if (!opts?.force && (await this.store.hasDedupe(dedupeKey))) {
      await this.logDelivery(opts?.dispatchId, {
        userId,
        channel: 'in_app',
        status: 'suppressed',
        title: job.title,
        body: 'duplicate',
        dedupeKey,
        jobId: job.id,
        error: 'duplicate',
      });
      return { sent: false, reason: 'duplicate' as const };
    }

    const prefs = await this.store.getNotificationPrefs(userId);
    const title = `New job: ${job.title}`;
    const body = `${job.employerName} · ${job.location.city}`;
    const data = { jobId: job.id, slug: job.slug };

    if (!prefs.jobAlertsEnabled) {
      await this.recordChannel({
        userId,
        channel: 'in_app',
        template: 'job_published',
        title,
        body,
        data,
        jobId: job.id,
        dedupeKey,
        dispatchId: opts?.dispatchId,
        status: 'suppressed',
        error: 'job_alerts_disabled',
      });
      return { sent: false, reason: 'disabled' as const };
    }

    if ((await this.store.getDailySendCount(userId)) >= prefs.dailyCap) {
      await this.recordChannel({
        userId,
        channel: 'in_app',
        template: 'job_published',
        title,
        body,
        data,
        jobId: job.id,
        dedupeKey,
        dispatchId: opts?.dispatchId,
        status: 'suppressed',
        error: 'daily_cap',
      });
      return { sent: false, reason: 'daily_cap' as const };
    }

    const quiet = this.inQuietHours(prefs.quietHoursStart, prefs.quietHoursEnd);
    let anySent = false;
    let anyFailed = false;

    if (prefs.inAppEnabled !== false) {
      await this.recordChannel({
        userId,
        channel: 'in_app',
        template: 'job_published',
        title: quiet ? `${title} (quiet hours)` : title,
        body,
        data,
        jobId: job.id,
        dedupeKey,
        dispatchId: opts?.dispatchId,
        status: 'sent',
        provider: 'in_app',
      });
      anySent = true;
    }

    if (!quiet) {
      if (prefs.pushAlertsEnabled !== false) {
        const pushResult = await this.deliverPush({
          userId,
          title,
          body,
          data,
          jobId: job.id,
          baseDedupe: dedupeKey,
          dispatchId: opts?.dispatchId,
        });
        if (pushResult.sent) anySent = true;
        if (pushResult.failed) anyFailed = true;
      }

      if (prefs.emailAlertsEnabled !== false) {
        const mailResult = await this.deliverMail({
          userId,
          title,
          body,
          data,
          jobId: job.id,
          baseDedupe: dedupeKey,
          dispatchId: opts?.dispatchId,
        });
        if (mailResult.sent) anySent = true;
        if (mailResult.failed) anyFailed = true;
      }
    } else {
      await this.logDelivery(opts?.dispatchId, {
        userId,
        channel: 'push',
        status: 'suppressed',
        title,
        body,
        dedupeKey: `${dedupeKey}:push:quiet`,
        jobId: job.id,
        error: 'quiet_hours',
      });
      await this.logDelivery(opts?.dispatchId, {
        userId,
        channel: 'mail',
        status: 'suppressed',
        title,
        body,
        dedupeKey: `${dedupeKey}:mail:quiet`,
        jobId: job.id,
        error: 'quiet_hours',
      });
    }

    if (anySent) {
      await this.store.incrementDailySend(userId);
    }

    if (anySent) {
      return {
        sent: true,
        reason: quiet
          ? ('quiet_hours_in_app' as const)
          : ('delivered' as const),
      };
    }
    if (anyFailed) {
      return { sent: false, reason: 'failed' as const };
    }
    return { sent: false, reason: 'suppressed' as const };
  }

  private async deliverPush(input: {
    userId: string;
    title: string;
    body: string;
    data: Record<string, string>;
    jobId: string;
    baseDedupe: string;
    dispatchId?: string;
  }) {
    const devices = await this.store.listDevicesForUser(input.userId);
    if (!devices.length) {
      await this.logDelivery(input.dispatchId, {
        userId: input.userId,
        channel: 'push',
        status: 'suppressed',
        title: input.title,
        body: input.body,
        dedupeKey: `${input.baseDedupe}:push:none`,
        jobId: input.jobId,
        error: 'no_device',
        provider: this.push.name,
      });
      return { sent: false, failed: false };
    }

    let sent = false;
    let failed = false;
    for (const device of devices) {
      const pushDedupe = `${input.baseDedupe}:push:${device.id}`;
      if (await this.store.hasDedupe(pushDedupe)) continue;
      const result = await this.push.send({
        token: device.fcmToken,
        title: input.title,
        body: input.body,
        data: input.data,
      });
      await this.recordChannel({
        userId: input.userId,
        channel: 'push',
        template: 'job_published',
        title: input.title,
        body: input.body,
        data: input.data,
        jobId: input.jobId,
        dedupeKey: pushDedupe,
        dispatchId: input.dispatchId,
        status: result.ok ? 'sent' : 'failed',
        error: result.error,
        provider: this.push.name,
        providerMessageId: result.providerMessageId,
      });
      if (result.ok) sent = true;
      else failed = true;
    }
    return { sent, failed };
  }

  private async deliverMail(input: {
    userId: string;
    title: string;
    body: string;
    data: Record<string, string>;
    jobId: string;
    baseDedupe: string;
    dispatchId?: string;
  }) {
    const mailDedupe = `${input.baseDedupe}:mail`;
    if (await this.store.hasDedupe(mailDedupe)) {
      return { sent: false, failed: false };
    }

    const user = this.auth.getUser(input.userId);
    const to = user?.email?.trim();
    if (!to) {
      await this.recordChannel({
        userId: input.userId,
        channel: 'mail',
        template: 'job_published',
        title: input.title,
        body: input.body,
        data: input.data,
        jobId: input.jobId,
        dedupeKey: mailDedupe,
        dispatchId: input.dispatchId,
        status: 'suppressed',
        error: 'no_email',
        provider: this.mail.name,
      });
      return { sent: false, failed: false };
    }

    const result = await this.mail.send({
      to,
      subject: input.title,
      text: `${input.body}\n\nJob: ${input.data.jobId}`,
      data: input.data,
    });
    await this.recordChannel({
      userId: input.userId,
      channel: 'mail',
      template: 'job_published',
      title: input.title,
      body: input.body,
      data: input.data,
      jobId: input.jobId,
      dedupeKey: mailDedupe,
      dispatchId: input.dispatchId,
      status: result.ok ? 'sent' : 'failed',
      error: result.error,
      provider: this.mail.name,
      providerMessageId: result.providerMessageId,
    });
    return { sent: result.ok, failed: !result.ok };
  }

  private async deliverCustom(userId: string, title: string, body: string) {
    const dispatch = await this.store.startDispatch({ triggerType: 'dev_test' });
    const dedupeKey = `dev:${userId}:${Date.now()}`;
    const inApp = await this.recordChannel({
      userId,
      channel: 'in_app',
      template: 'dev_test',
      title,
      body,
      dedupeKey,
      dispatchId: dispatch.id,
      status: 'sent',
      provider: 'in_app',
    });
    const devices = await this.store.listDevicesForUser(userId);
    const pushResults = [];
    for (const device of devices) {
      const result = await this.push.send({
        token: device.fcmToken,
        title,
        body,
      });
      await this.recordChannel({
        userId,
        channel: 'push',
        template: 'dev_test',
        title,
        body,
        dedupeKey: `${dedupeKey}:push:${device.id}`,
        dispatchId: dispatch.id,
        status: result.ok ? 'sent' : 'failed',
        error: result.error,
        provider: this.push.name,
        providerMessageId: result.providerMessageId,
      });
      pushResults.push({ deviceId: device.deviceId, ...result });
    }

    const user = this.auth.getUser(userId);
    let mailResult = null;
    if (user?.email) {
      const result = await this.mail.send({
        to: user.email,
        subject: title,
        text: body,
      });
      await this.recordChannel({
        userId,
        channel: 'mail',
        template: 'dev_test',
        title,
        body,
        dedupeKey: `${dedupeKey}:mail`,
        dispatchId: dispatch.id,
        status: result.ok ? 'sent' : 'failed',
        error: result.error,
        provider: this.mail.name,
        providerMessageId: result.providerMessageId,
      });
      mailResult = result;
    }

    await this.store.updateDispatch(dispatch.id, {
      matchedCount: 1,
      sentCount: 1,
    });
    await this.store.finishDispatch(dispatch.id, 'completed');
    return {
      dispatchId: dispatch.id,
      inAppId: inApp.id,
      push: pushResults,
      mail: mailResult,
    };
  }

  private async recordChannel(input: {
    userId: string;
    channel: NotificationChannel;
    template: string;
    title: string;
    body: string;
    data?: Record<string, string>;
    jobId?: string;
    dedupeKey: string;
    dispatchId?: string;
    status: NotificationStatus;
    error?: string;
    provider?: string;
    providerMessageId?: string;
  }) {
    const record = await this.store.createNotification({
      userId: input.userId,
      channel: input.channel,
      template: input.template,
      title: input.title,
      body: input.body,
      data: input.data,
      jobId: input.jobId,
      dedupeKey: input.dedupeKey,
      dispatchId: input.dispatchId,
      status: input.status,
      error: input.error,
      provider: input.provider,
      providerMessageId: input.providerMessageId,
    });
    await this.logDelivery(input.dispatchId, {
      userId: input.userId,
      channel: input.channel,
      status: input.status,
      title: input.title,
      body: input.body,
      dedupeKey: input.dedupeKey,
      jobId: input.jobId,
      error: input.error,
      provider: input.provider,
      providerMessageId: input.providerMessageId,
    });
    return record;
  }

  private async logDelivery(
    dispatchId: string | undefined,
    input: {
      userId: string;
      channel: NotificationChannel;
      status: NotificationStatus;
      title: string;
      body: string;
      dedupeKey: string;
      jobId?: string;
      error?: string;
      provider?: string;
      providerMessageId?: string;
    },
  ) {
    if (!dispatchId) return;
    await this.store.createDeliveryLog({
      dispatchId,
      userId: input.userId,
      channel: input.channel,
      status: input.status,
      title: input.title,
      body: input.body,
      dedupeKey: input.dedupeKey,
      jobId: input.jobId,
      error: input.error,
      provider: input.provider,
      providerMessageId: input.providerMessageId,
    });
  }

  private inQuietHours(start: number | null, end: number | null): boolean {
    if (start == null || end == null) return false;
    const hour = new Date().getHours();
    if (start === end) return true;
    if (start < end) return hour >= start && hour < end;
    return hour >= start || hour < end;
  }
}
