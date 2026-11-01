import { Injectable } from '@nestjs/common';
import { Prisma } from '@prisma/client';
import { v4 as uuidv4 } from 'uuid';
import { PrismaService } from '../prisma/prisma.service';
import { NotificationsStore } from './notifications.store';
import {
  DeviceRegistration,
  NotificationChannel,
  NotificationDeliveryLog,
  NotificationDispatch,
  NotificationDispatchStatus,
  NotificationPreferences,
  NotificationRecord,
  NotificationStatus,
  NotificationTriggerType,
  PushPlatform,
} from './notifications.types';

function toIso(value: Date | string | null | undefined): string | undefined {
  if (value == null) return undefined;
  if (value instanceof Date) return value.toISOString();
  return value;
}

function asStringRecord(
  value: Prisma.JsonValue | null | undefined,
): Record<string, string> | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }
  const out: Record<string, string> = {};
  for (const [k, v] of Object.entries(value)) {
    if (v == null) continue;
    out[k] = String(v);
  }
  return Object.keys(out).length ? out : undefined;
}

function asMetaRecord(
  value: Prisma.JsonValue | null | undefined,
): NotificationDispatch['meta'] | undefined {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return undefined;
  }
  const out: NonNullable<NotificationDispatch['meta']> = {};
  for (const [k, v] of Object.entries(value)) {
    if (
      v === null ||
      typeof v === 'string' ||
      typeof v === 'number' ||
      typeof v === 'boolean'
    ) {
      out[k] = v;
    }
  }
  return Object.keys(out).length ? out : undefined;
}

function utcDayStart(): Date {
  const now = new Date();
  return new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate()),
  );
}

function baseDedupeKey(key: string): string {
  return key.replace(/:push:.*$/, '').replace(/:mail$/, '');
}

@Injectable()
export class NotificationsPrismaStore extends NotificationsStore {
  constructor(private readonly prisma: PrismaService) {
    super();
  }

  private async ensureUser(userId: string): Promise<void> {
    await this.prisma.user.upsert({
      where: { id: userId },
      create: { id: userId },
      update: {},
    });
  }

  private mapDevice(row: {
    id: string;
    userId: string | null;
    deviceId: string;
    fcmToken: string;
    platform: string;
    createdAt: Date;
    updatedAt: Date;
    lastSeenAt: Date;
  }): DeviceRegistration {
    return {
      id: row.id,
      userId: row.userId ?? undefined,
      deviceId: row.deviceId,
      fcmToken: row.fcmToken,
      platform: row.platform as PushPlatform,
      createdAt: row.createdAt.toISOString(),
      updatedAt: row.updatedAt.toISOString(),
      lastSeenAt: row.lastSeenAt.toISOString(),
    };
  }

  private mapPrefs(row: {
    userId: string;
    jobAlertsEnabled: boolean;
    inAppEnabled: boolean;
    pushAlertsEnabled: boolean;
    emailAlertsEnabled: boolean;
    marketingEnabled: boolean;
    quietHoursStart: number | null;
    quietHoursEnd: number | null;
    dailyCap: number;
    updatedAt: Date;
  }): NotificationPreferences {
    return {
      userId: row.userId,
      jobAlertsEnabled: row.jobAlertsEnabled,
      inAppEnabled: row.inAppEnabled,
      pushAlertsEnabled: row.pushAlertsEnabled,
      emailAlertsEnabled: row.emailAlertsEnabled,
      marketingEnabled: row.marketingEnabled,
      quietHoursStart: row.quietHoursStart,
      quietHoursEnd: row.quietHoursEnd,
      dailyCap: row.dailyCap,
      updatedAt: row.updatedAt.toISOString(),
    };
  }

  private mapNotification(row: {
    id: string;
    userId: string;
    channel: string;
    template: string;
    title: string;
    body: string;
    dataJson: Prisma.JsonValue | null;
    status: string;
    dedupeKey: string;
    jobId: string | null;
    dispatchId: string | null;
    provider: string | null;
    providerMessageId: string | null;
    error: string | null;
    createdAt: Date;
    readAt: Date | null;
  }): NotificationRecord {
    return {
      id: row.id,
      userId: row.userId,
      channel: row.channel as NotificationChannel,
      template: row.template,
      title: row.title,
      body: row.body,
      data: asStringRecord(row.dataJson),
      status: row.status as NotificationStatus,
      dedupeKey: row.dedupeKey,
      jobId: row.jobId ?? undefined,
      dispatchId: row.dispatchId ?? undefined,
      provider: row.provider ?? undefined,
      providerMessageId: row.providerMessageId ?? undefined,
      error: row.error ?? undefined,
      createdAt: row.createdAt.toISOString(),
      readAt: toIso(row.readAt),
    };
  }

  private mapDispatch(row: {
    id: string;
    triggerType: string;
    jobId: string | null;
    status: string;
    matchedCount: number;
    sentCount: number;
    suppressedCount: number;
    failedCount: number;
    skippedReason: string | null;
    metaJson: Prisma.JsonValue | null;
    startedAt: Date;
    finishedAt: Date | null;
  }): NotificationDispatch {
    return {
      id: row.id,
      triggerType: row.triggerType as NotificationTriggerType,
      jobId: row.jobId ?? undefined,
      status: row.status as NotificationDispatchStatus,
      matchedCount: row.matchedCount,
      sentCount: row.sentCount,
      suppressedCount: row.suppressedCount,
      failedCount: row.failedCount,
      skippedReason: row.skippedReason ?? undefined,
      meta: asMetaRecord(row.metaJson),
      startedAt: row.startedAt.toISOString(),
      finishedAt: toIso(row.finishedAt),
    };
  }

  private mapDelivery(row: {
    id: string;
    dispatchId: string;
    userId: string;
    channel: string;
    status: string;
    provider: string | null;
    providerMessageId: string | null;
    title: string;
    body: string;
    dedupeKey: string;
    jobId: string | null;
    error: string | null;
    createdAt: Date;
  }): NotificationDeliveryLog {
    return {
      id: row.id,
      dispatchId: row.dispatchId,
      userId: row.userId,
      channel: row.channel as NotificationChannel,
      status: row.status as NotificationStatus,
      provider: row.provider ?? undefined,
      providerMessageId: row.providerMessageId ?? undefined,
      title: row.title,
      body: row.body,
      dedupeKey: row.dedupeKey,
      jobId: row.jobId ?? undefined,
      error: row.error ?? undefined,
      createdAt: row.createdAt.toISOString(),
    };
  }

  async upsertDevice(input: {
    userId?: string;
    deviceId: string;
    fcmToken: string;
    platform: PushPlatform;
  }): Promise<DeviceRegistration> {
    if (input.userId) {
      await this.ensureUser(input.userId);
    }

    const byToken = await this.prisma.deviceRegistration.findUnique({
      where: { fcmToken: input.fcmToken },
    });
    if (byToken) {
      const updated = await this.prisma.deviceRegistration.update({
        where: { id: byToken.id },
        data: {
          userId: input.userId ?? byToken.userId,
          deviceId: input.deviceId,
          platform: input.platform,
          lastSeenAt: new Date(),
        },
      });
      return this.mapDevice(updated);
    }

    const byDevice = await this.prisma.deviceRegistration.findFirst({
      where: {
        deviceId: input.deviceId,
        userId: input.userId ?? null,
      },
    });
    if (byDevice) {
      const updated = await this.prisma.deviceRegistration.update({
        where: { id: byDevice.id },
        data: {
          fcmToken: input.fcmToken,
          platform: input.platform,
          userId: input.userId ?? byDevice.userId,
          lastSeenAt: new Date(),
        },
      });
      return this.mapDevice(updated);
    }

    const created = await this.prisma.deviceRegistration.create({
      data: {
        id: `dev_${uuidv4().slice(0, 8)}`,
        userId: input.userId,
        deviceId: input.deviceId,
        fcmToken: input.fcmToken,
        platform: input.platform,
      },
    });
    return this.mapDevice(created);
  }

  async listDevicesForUser(userId: string): Promise<DeviceRegistration[]> {
    const rows = await this.prisma.deviceRegistration.findMany({
      where: { userId },
      orderBy: { updatedAt: 'desc' },
    });
    return rows.map((r) => this.mapDevice(r));
  }

  async getNotificationPrefs(userId: string): Promise<NotificationPreferences> {
    const row = await this.prisma.notificationPreference.findUnique({
      where: { userId },
    });
    if (!row) {
      return {
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
      };
    }
    return this.mapPrefs(row);
  }

  async saveNotificationPrefs(
    userId: string,
    patch: Partial<Omit<NotificationPreferences, 'userId' | 'updatedAt'>>,
  ): Promise<NotificationPreferences> {
    await this.ensureUser(userId);
    const current = await this.getNotificationPrefs(userId);
    const next = {
      jobAlertsEnabled: patch.jobAlertsEnabled ?? current.jobAlertsEnabled,
      inAppEnabled: patch.inAppEnabled ?? current.inAppEnabled,
      pushAlertsEnabled: patch.pushAlertsEnabled ?? current.pushAlertsEnabled,
      emailAlertsEnabled:
        patch.emailAlertsEnabled ?? current.emailAlertsEnabled,
      marketingEnabled: patch.marketingEnabled ?? current.marketingEnabled,
      quietHoursStart:
        patch.quietHoursStart !== undefined
          ? patch.quietHoursStart
          : current.quietHoursStart,
      quietHoursEnd:
        patch.quietHoursEnd !== undefined
          ? patch.quietHoursEnd
          : current.quietHoursEnd,
      dailyCap: patch.dailyCap ?? current.dailyCap,
    };
    const row = await this.prisma.notificationPreference.upsert({
      where: { userId },
      create: {
        id: `npr_${uuidv4().slice(0, 8)}`,
        userId,
        ...next,
      },
      update: next,
    });
    return this.mapPrefs(row);
  }

  async listNotificationPrefUserIds(): Promise<string[]> {
    const rows = await this.prisma.notificationPreference.findMany({
      select: { userId: true },
    });
    return rows.map((r) => r.userId);
  }

  async hasDedupe(key: string): Promise<boolean> {
    const row = await this.prisma.notificationRecord.findUnique({
      where: { dedupeKey: key },
      select: { id: true },
    });
    return !!row;
  }

  async markDedupe(_key: string): Promise<void> {
    // Unique NotificationRecord.dedupeKey is the durable dedupe marker.
  }

  async createNotification(
    input: Omit<NotificationRecord, 'id' | 'createdAt' | 'status'> & {
      status?: NotificationStatus;
    },
  ): Promise<NotificationRecord> {
    await this.ensureUser(input.userId);
    const existing = await this.prisma.notificationRecord.findUnique({
      where: { dedupeKey: input.dedupeKey },
    });
    if (existing) {
      return this.mapNotification(existing);
    }

    if (input.dispatchId) {
      const dispatch = await this.prisma.notificationDispatch.findUnique({
        where: { id: input.dispatchId },
        select: { id: true },
      });
      if (!dispatch) {
        // Avoid FK failure if dispatch was skipped/raced; drop the link.
        input = { ...input, dispatchId: undefined };
      }
    }

    const created = await this.prisma.notificationRecord.create({
      data: {
        id: `ntf_${uuidv4().slice(0, 8)}`,
        userId: input.userId,
        channel: input.channel,
        template: input.template,
        title: input.title,
        body: input.body,
        dataJson: input.data
          ? (input.data as Prisma.InputJsonValue)
          : undefined,
        status: input.status ?? 'queued',
        dedupeKey: input.dedupeKey,
        jobId: input.jobId,
        dispatchId: input.dispatchId,
        provider: input.provider,
        providerMessageId: input.providerMessageId,
        error: input.error,
        readAt: input.readAt ? new Date(input.readAt) : undefined,
      },
    });
    return this.mapNotification(created);
  }

  async updateNotification(
    id: string,
    patch: Partial<Pick<NotificationRecord, 'status' | 'error' | 'readAt'>>,
  ): Promise<NotificationRecord | undefined> {
    try {
      const updated = await this.prisma.notificationRecord.update({
        where: { id },
        data: {
          status: patch.status,
          error: patch.error,
          readAt:
            patch.readAt === undefined
              ? undefined
              : patch.readAt
                ? new Date(patch.readAt)
                : null,
        },
      });
      return this.mapNotification(updated);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        return undefined;
      }
      throw err;
    }
  }

  async listForUser(userId: string): Promise<NotificationRecord[]> {
    const rows = await this.prisma.notificationRecord.findMany({
      where: {
        userId,
        channel: 'in_app',
        status: { not: 'suppressed' },
      },
      orderBy: { createdAt: 'desc' },
    });
    return rows.map((r) => this.mapNotification(r));
  }

  async findNotification(id: string): Promise<NotificationRecord | undefined> {
    const row = await this.prisma.notificationRecord.findUnique({
      where: { id },
    });
    return row ? this.mapNotification(row) : undefined;
  }

  async startDispatch(input: {
    triggerType: NotificationTriggerType;
    jobId?: string;
    meta?: NotificationDispatch['meta'];
  }): Promise<NotificationDispatch> {
    const created = await this.prisma.notificationDispatch.create({
      data: {
        id: `dsp_${uuidv4().slice(0, 8)}`,
        triggerType: input.triggerType,
        jobId: input.jobId,
        status: 'running',
        metaJson: input.meta
          ? (input.meta as Prisma.InputJsonValue)
          : undefined,
      },
    });
    return this.mapDispatch(created);
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
    try {
      const updated = await this.prisma.notificationDispatch.update({
        where: { id },
        data: {
          status: patch.status,
          matchedCount: patch.matchedCount,
          sentCount: patch.sentCount,
          suppressedCount: patch.suppressedCount,
          failedCount: patch.failedCount,
          skippedReason: patch.skippedReason,
          finishedAt:
            patch.finishedAt === undefined
              ? undefined
              : patch.finishedAt
                ? new Date(patch.finishedAt)
                : null,
          metaJson:
            patch.meta === undefined
              ? undefined
              : patch.meta
                ? (patch.meta as Prisma.InputJsonValue)
                : Prisma.JsonNull,
        },
      });
      return this.mapDispatch(updated);
    } catch (err) {
      if (
        err instanceof Prisma.PrismaClientKnownRequestError &&
        err.code === 'P2025'
      ) {
        return undefined;
      }
      throw err;
    }
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
    await this.ensureUser(input.userId);
    const created = await this.prisma.notificationDelivery.create({
      data: {
        id: `ndl_${uuidv4().slice(0, 8)}`,
        dispatchId: input.dispatchId,
        userId: input.userId,
        channel: input.channel,
        status: input.status,
        provider: input.provider,
        providerMessageId: input.providerMessageId,
        title: input.title,
        body: input.body,
        dedupeKey: input.dedupeKey,
        jobId: input.jobId,
        error: input.error,
      },
    });
    return this.mapDelivery(created);
  }

  async listDispatches(limit = 50): Promise<NotificationDispatch[]> {
    const rows = await this.prisma.notificationDispatch.findMany({
      orderBy: { startedAt: 'desc' },
      take: Math.min(Math.max(limit, 1), 200),
    });
    return rows.map((r) => this.mapDispatch(r));
  }

  async findDispatch(id: string): Promise<NotificationDispatch | undefined> {
    const row = await this.prisma.notificationDispatch.findUnique({
      where: { id },
    });
    return row ? this.mapDispatch(row) : undefined;
  }

  async listDeliveriesForDispatch(
    dispatchId: string,
  ): Promise<NotificationDeliveryLog[]> {
    const rows = await this.prisma.notificationDelivery.findMany({
      where: { dispatchId },
      orderBy: { createdAt: 'asc' },
    });
    return rows.map((r) => this.mapDelivery(r));
  }

  async getDailySendCount(userId: string): Promise<number> {
    const rows = await this.prisma.notificationRecord.findMany({
      where: {
        userId,
        createdAt: { gte: utcDayStart() },
        status: { in: ['sent', 'read'] },
      },
      select: { dedupeKey: true },
    });
    const unique = new Set(rows.map((r) => baseDedupeKey(r.dedupeKey)));
    return unique.size;
  }

  async incrementDailySend(userId: string): Promise<number> {
    // Cap is derived from persisted sent/read records (already written).
    return this.getDailySendCount(userId);
  }

  async clearForUser(userId: string): Promise<void> {
    await this.prisma.notificationDelivery.deleteMany({ where: { userId } });
    await this.prisma.notificationRecord.deleteMany({ where: { userId } });
    await this.prisma.notificationPreference.deleteMany({ where: { userId } });
    await this.prisma.deviceRegistration.deleteMany({ where: { userId } });
  }
}
