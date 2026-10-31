import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { AuthUser } from '../auth/auth.types';
import { JobRecord } from '../jobs/job.types';
import { JobsMemoryStore } from '../jobs/jobs.memory-store';
import { PreferencesService } from '../preferences/preferences.service';
import {
  DevSendNotificationDto,
  NotificationPreferencesDto,
  RegisterDeviceDto,
} from './dto/notifications.dto';
import { NotificationsStore } from './notifications.store';
import { FcmStubProvider } from './providers/fcm.stub';

@Injectable()
export class NotificationsService {
  private readonly push = new FcmStubProvider();

  constructor(
    private readonly store: NotificationsStore,
    private readonly jobs: JobsMemoryStore,
    private readonly preferences: PreferencesService,
  ) {}

  registerDevice(dto: RegisterDeviceDto, user?: AuthUser) {
    const device = this.store.upsertDevice({
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

  listInApp(user: AuthUser) {
    return {
      items: this.store.listForUser(user.id).map((n) => ({
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

  markRead(user: AuthUser, id: string) {
    const n = this.store.findNotification(id);
    if (!n || n.userId !== user.id) {
      throw new NotFoundException('Notification not found');
    }
    const updated = this.store.updateNotification(id, {
      status: 'read',
      readAt: new Date().toISOString(),
    })!;
    return {
      id: updated.id,
      status: updated.status,
      readAt: updated.readAt,
    };
  }

  async onJobPublished(jobId: string) {
    const job = this.jobs.findById(jobId);
    if (!job || job.status !== 'published') {
      return { matched: 0, sent: 0 };
    }

    let matched = 0;
    let sent = 0;
    for (const { userId, preferences } of this.preferences.listUserPreferences()) {
      if (!this.matchesJob(preferences, job)) continue;
      matched += 1;
      const result = await this.deliverJobAlert(userId, job);
      if (result.sent) sent += 1;
    }
    return { matched, sent, jobId };
  }

  async devSend(dto: DevSendNotificationDto) {
    if ((process.env.NOTIFICATION_MODE || 'stub') !== 'stub') {
      throw new ForbiddenException('Dev send only in stub mode');
    }
    const title = dto.title || 'X Cron Jobs';
    const body = dto.body || 'Test notification from stub FCM provider.';
    const job = dto.jobId ? this.jobs.findById(dto.jobId) : undefined;
    if (job) {
      return this.deliverJobAlert(dto.userId, job, { force: true });
    }
    return this.deliverCustom(dto.userId, title, body);
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
    if (!hasAnyFilter) return false;

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
      // soft: still allow if language filter not exclusive — require match when set
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
    opts?: { force?: boolean },
  ) {
    const dedupeKey = `job_published:${job.id}:${userId}`;
    if (!opts?.force && this.store.hasDedupe(dedupeKey)) {
      return { sent: false, reason: 'duplicate' as const };
    }

    const prefs = this.store.getNotificationPrefs(userId);
    if (!prefs.jobAlertsEnabled) {
      this.store.createNotification({
        userId,
        channel: 'in_app',
        template: 'job_published',
        title: job.title,
        body: `${job.employerName} · ${job.location.city}`,
        data: { jobId: job.id },
        jobId: job.id,
        dedupeKey,
        status: 'suppressed',
        error: 'job_alerts_disabled',
      });
      return { sent: false, reason: 'disabled' as const };
    }

    if (this.inQuietHours(prefs.quietHoursStart, prefs.quietHoursEnd)) {
      this.store.createNotification({
        userId,
        channel: 'in_app',
        template: 'job_published',
        title: job.title,
        body: `${job.employerName} · ${job.location.city} (quiet hours — in-app only)`,
        data: { jobId: job.id },
        jobId: job.id,
        dedupeKey,
        status: 'sent',
      });
      return { sent: true, reason: 'quiet_hours_in_app' as const };
    }

    if (this.store.getDailySendCount(userId) >= prefs.dailyCap) {
      this.store.createNotification({
        userId,
        channel: 'in_app',
        template: 'job_published',
        title: job.title,
        body: `${job.employerName} · ${job.location.city}`,
        data: { jobId: job.id },
        jobId: job.id,
        dedupeKey,
        status: 'suppressed',
        error: 'daily_cap',
      });
      return { sent: false, reason: 'daily_cap' as const };
    }

    const inApp = this.store.createNotification({
      userId,
      channel: 'in_app',
      template: 'job_published',
      title: `New job: ${job.title}`,
      body: `${job.employerName} · ${job.location.city}`,
      data: { jobId: job.id, slug: job.slug },
      jobId: job.id,
      dedupeKey,
      status: 'sent',
    });

    const devices = this.store.listDevicesForUser(userId);
    let pushOk = 0;
    for (const device of devices) {
      const pushDedupe = `${dedupeKey}:push:${device.id}`;
      if (this.store.hasDedupe(pushDedupe)) continue;
      const result = await this.push.send({
        token: device.fcmToken,
        title: inApp.title,
        body: inApp.body,
        data: inApp.data,
      });
      this.store.createNotification({
        userId,
        channel: 'push',
        template: 'job_published',
        title: inApp.title,
        body: inApp.body,
        data: inApp.data,
        jobId: job.id,
        dedupeKey: pushDedupe,
        status: result.ok ? 'sent' : 'failed',
        error: result.error,
      });
      if (result.ok) pushOk += 1;
    }
    if (pushOk > 0 || devices.length === 0) {
      this.store.incrementDailySend(userId);
    }
    return {
      sent: true,
      reason: 'delivered' as const,
      inAppId: inApp.id,
      pushOk,
    };
  }

  private async deliverCustom(userId: string, title: string, body: string) {
    const dedupeKey = `dev:${userId}:${Date.now()}`;
    const inApp = this.store.createNotification({
      userId,
      channel: 'in_app',
      template: 'dev_test',
      title,
      body,
      dedupeKey,
      status: 'sent',
    });
    const devices = this.store.listDevicesForUser(userId);
    const results = [];
    for (const device of devices) {
      const result = await this.push.send({
        token: device.fcmToken,
        title,
        body,
      });
      results.push({ deviceId: device.deviceId, ...result });
    }
    return { inAppId: inApp.id, push: results };
  }

  private inQuietHours(start: number | null, end: number | null): boolean {
    if (start == null || end == null) return false;
    const hour = new Date().getHours();
    if (start === end) return true;
    if (start < end) return hour >= start && hour < end;
    return hour >= start || hour < end;
  }
}
