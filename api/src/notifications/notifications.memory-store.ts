import { Injectable } from '@nestjs/common';
import { v4 as uuidv4 } from 'uuid';
import { NotificationsStore } from './notifications.store';
import {
  DeviceRegistration,
  NotificationDeliveryLog,
  NotificationDispatch,
  NotificationDispatchStatus,
  NotificationPreferences,
  NotificationRecord,
  NotificationStatus,
  NotificationTriggerType,
  PushPlatform,
} from './notifications.types';

@Injectable()
export class NotificationsMemoryStore extends NotificationsStore {
  private readonly devices = new Map<string, DeviceRegistration>();
  private readonly devicesByToken = new Map<string, string>();
  private readonly prefs = new Map<string, NotificationPreferences>();
  private readonly notifications = new Map<string, NotificationRecord>();
  private readonly dispatches = new Map<string, NotificationDispatch>();
  private readonly deliveries = new Map<string, NotificationDeliveryLog>();
  private readonly dedupe = new Set<string>();
  private readonly sendsToday = new Map<string, { day: string; count: number }>();

  async upsertDevice(input: {
    userId?: string;
    deviceId: string;
    fcmToken: string;
    platform: PushPlatform;
  }): Promise<DeviceRegistration> {
    const existingId = this.devicesByToken.get(input.fcmToken);
    const now = new Date().toISOString();
    if (existingId) {
      const current = this.devices.get(existingId)!;
      const next: DeviceRegistration = {
        ...current,
        userId: input.userId ?? current.userId,
        deviceId: input.deviceId,
        platform: input.platform,
        updatedAt: now,
        lastSeenAt: now,
      };
      this.devices.set(existingId, next);
      return next;
    }

    const byDevice = [...this.devices.values()].find(
      (d) => d.deviceId === input.deviceId && d.userId === input.userId,
    );
    if (byDevice) {
      this.devicesByToken.delete(byDevice.fcmToken);
      const next: DeviceRegistration = {
        ...byDevice,
        fcmToken: input.fcmToken,
        platform: input.platform,
        userId: input.userId ?? byDevice.userId,
        updatedAt: now,
        lastSeenAt: now,
      };
      this.devices.set(byDevice.id, next);
      this.devicesByToken.set(input.fcmToken, byDevice.id);
      return next;
    }

    const record: DeviceRegistration = {
      id: `dev_${uuidv4().slice(0, 8)}`,
      userId: input.userId,
      deviceId: input.deviceId,
      fcmToken: input.fcmToken,
      platform: input.platform,
      createdAt: now,
      updatedAt: now,
      lastSeenAt: now,
    };
    this.devices.set(record.id, record);
    this.devicesByToken.set(record.fcmToken, record.id);
    return record;
  }

  async listDevicesForUser(userId: string): Promise<DeviceRegistration[]> {
    return [...this.devices.values()].filter((d) => d.userId === userId);
  }

  async getNotificationPrefs(userId: string): Promise<NotificationPreferences> {
    return (
      this.prefs.get(userId) ?? {
        userId,
        jobAlertsEnabled: true,
        inAppEnabled: true,
        pushAlertsEnabled: true,
        emailAlertsEnabled: true,
        marketingEnabled: false,
        quietHoursStart: null,
        quietHoursEnd: null,
        dailyCap: 20,
        updatedAt: new Date(0).toISOString(),
      }
    );
  }

  async saveNotificationPrefs(
    userId: string,
    patch: Partial<Omit<NotificationPreferences, 'userId' | 'updatedAt'>>,
  ): Promise<NotificationPreferences> {
    const current = await this.getNotificationPrefs(userId);
    const next: NotificationPreferences = {
      ...current,
      ...patch,
      userId,
      updatedAt: new Date().toISOString(),
    };
    this.prefs.set(userId, next);
    return next;
  }

  async listNotificationPrefUserIds(): Promise<string[]> {
    return [...this.prefs.keys()];
  }

  async hasDedupe(key: string): Promise<boolean> {
    return this.dedupe.has(key);
  }

  async markDedupe(key: string): Promise<void> {
    this.dedupe.add(key);
  }

  async createNotification(
    input: Omit<NotificationRecord, 'id' | 'createdAt' | 'status'> & {
      status?: NotificationStatus;
    },
  ): Promise<NotificationRecord> {
    const record: NotificationRecord = {
      id: `ntf_${uuidv4().slice(0, 8)}`,
      createdAt: new Date().toISOString(),
      status: input.status ?? 'queued',
      userId: input.userId,
      channel: input.channel,
      template: input.template,
      title: input.title,
      body: input.body,
      data: input.data,
      dedupeKey: input.dedupeKey,
      jobId: input.jobId,
      dispatchId: input.dispatchId,
      provider: input.provider,
      providerMessageId: input.providerMessageId,
      error: input.error,
      readAt: input.readAt,
    };
    this.notifications.set(record.id, record);
    await this.markDedupe(input.dedupeKey);
    return record;
  }

  async updateNotification(
    id: string,
    patch: Partial<Pick<NotificationRecord, 'status' | 'error' | 'readAt'>>,
  ): Promise<NotificationRecord | undefined> {
    const current = this.notifications.get(id);
    if (!current) return undefined;
    const next = { ...current, ...patch };
    this.notifications.set(id, next);
    return next;
  }

  async listForUser(userId: string): Promise<NotificationRecord[]> {
    return [...this.notifications.values()]
      .filter(
        (n) =>
          n.userId === userId &&
          n.channel === 'in_app' &&
          n.status !== 'suppressed',
      )
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt));
  }

  async findNotification(id: string): Promise<NotificationRecord | undefined> {
    return this.notifications.get(id);
  }

  async startDispatch(input: {
    triggerType: NotificationTriggerType;
    jobId?: string;
    meta?: NotificationDispatch['meta'];
  }): Promise<NotificationDispatch> {
    const record: NotificationDispatch = {
      id: `dsp_${uuidv4().slice(0, 8)}`,
      triggerType: input.triggerType,
      jobId: input.jobId,
      status: 'running',
      matchedCount: 0,
      sentCount: 0,
      suppressedCount: 0,
      failedCount: 0,
      meta: input.meta,
      startedAt: new Date().toISOString(),
    };
    this.dispatches.set(record.id, record);
    return record;
  }

  async updateDispatch(
    id: string,
    patch: Partial<
      Pick<
        NotificationDispatch,
        | 'status'
        | 'matchedCount'
        | 'sentCount'
        | 'suppressedCount'
        | 'failedCount'
        | 'skippedReason'
        | 'finishedAt'
        | 'meta'
      >
    >,
  ): Promise<NotificationDispatch | undefined> {
    const current = this.dispatches.get(id);
    if (!current) return undefined;
    const next = { ...current, ...patch };
    this.dispatches.set(id, next);
    return next;
  }

  async finishDispatch(
    id: string,
    status: NotificationDispatchStatus = 'completed',
  ): Promise<NotificationDispatch | undefined> {
    return this.updateDispatch(id, {
      status,
      finishedAt: new Date().toISOString(),
    });
  }

  async createDeliveryLog(
    input: Omit<NotificationDeliveryLog, 'id' | 'createdAt'>,
  ): Promise<NotificationDeliveryLog> {
    const record: NotificationDeliveryLog = {
      id: `ndl_${uuidv4().slice(0, 8)}`,
      createdAt: new Date().toISOString(),
      ...input,
    };
    this.deliveries.set(record.id, record);
    return record;
  }

  async listDispatches(limit = 50): Promise<NotificationDispatch[]> {
    return [...this.dispatches.values()]
      .sort((a, b) => b.startedAt.localeCompare(a.startedAt))
      .slice(0, limit);
  }

  async findDispatch(id: string): Promise<NotificationDispatch | undefined> {
    return this.dispatches.get(id);
  }

  async listDeliveriesForDispatch(
    dispatchId: string,
  ): Promise<NotificationDeliveryLog[]> {
    return [...this.deliveries.values()]
      .filter((d) => d.dispatchId === dispatchId)
      .sort((a, b) => a.createdAt.localeCompare(b.createdAt));
  }

  async incrementDailySend(userId: string): Promise<number> {
    const day = new Date().toISOString().slice(0, 10);
    const current = this.sendsToday.get(userId);
    if (!current || current.day !== day) {
      this.sendsToday.set(userId, { day, count: 1 });
      return 1;
    }
    current.count += 1;
    return current.count;
  }

  async getDailySendCount(userId: string): Promise<number> {
    const day = new Date().toISOString().slice(0, 10);
    const current = this.sendsToday.get(userId);
    if (!current || current.day !== day) return 0;
    return current.count;
  }

  async clearForUser(userId: string): Promise<void> {
    this.prefs.delete(userId);
    this.sendsToday.delete(userId);
    for (const [id, n] of this.notifications) {
      if (n.userId === userId) this.notifications.delete(id);
    }
    for (const [id, d] of this.devices) {
      if (d.userId === userId) {
        this.devicesByToken.delete(d.fcmToken);
        this.devices.delete(id);
      }
    }
  }
}
