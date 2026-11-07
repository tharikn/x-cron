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

/**
 * Notifications persistence contract. Memory and Prisma implementations share this surface.
 * All methods are async so Prisma can be the live path under NOTIFICATIONS_STORE=prisma.
 */
export abstract class NotificationsStore {
  abstract upsertDevice(input: {
    userId?: string;
    deviceId: string;
    fcmToken: string;
    platform: PushPlatform;
  }): Promise<DeviceRegistration>;

  /**
   * Detach this device from any user so job pushes stop after logout / session death.
   * Matches on deviceId + fcmToken (proof the caller holds the device credentials).
   */
  abstract unlinkDevice(input: {
    deviceId: string;
    fcmToken: string;
  }): Promise<boolean>;

  /** Detach any device holding this FCM token (invalid/unregistered cleanup). */
  abstract detachDeviceByToken(fcmToken: string): Promise<boolean>;

  abstract listDevicesForUser(userId: string): Promise<DeviceRegistration[]>;

  abstract getNotificationPrefs(
    userId: string,
  ): Promise<NotificationPreferences>;

  abstract saveNotificationPrefs(
    userId: string,
    patch: Partial<Omit<NotificationPreferences, 'userId' | 'updatedAt'>>,
  ): Promise<NotificationPreferences>;

  /** User ids that have saved notification prefs (explicit subscribers / toggles). */
  abstract listNotificationPrefUserIds(): Promise<string[]>;

  abstract hasDedupe(key: string): Promise<boolean>;

  abstract markDedupe(key: string): Promise<void>;

  abstract createNotification(
    input: Omit<NotificationRecord, 'id' | 'createdAt' | 'status'> & {
      status?: NotificationStatus;
    },
  ): Promise<NotificationRecord>;

  abstract updateNotification(
    id: string,
    patch: Partial<Pick<NotificationRecord, 'status' | 'error' | 'readAt'>>,
  ): Promise<NotificationRecord | undefined>;

  abstract listForUser(userId: string): Promise<NotificationRecord[]>;

  abstract findNotification(
    id: string,
  ): Promise<NotificationRecord | undefined>;

  abstract startDispatch(input: {
    triggerType: NotificationTriggerType;
    jobId?: string;
    meta?: NotificationDispatch['meta'];
  }): Promise<NotificationDispatch>;

  abstract updateDispatch(
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
  ): Promise<NotificationDispatch | undefined>;

  abstract finishDispatch(
    id: string,
    status?: NotificationDispatchStatus,
  ): Promise<NotificationDispatch | undefined>;

  abstract createDeliveryLog(
    input: Omit<NotificationDeliveryLog, 'id' | 'createdAt'>,
  ): Promise<NotificationDeliveryLog>;

  abstract listDispatches(opts?: {
    limit?: number;
    offset?: number;
  }): Promise<{ items: NotificationDispatch[]; total: number }>;

  abstract findDispatch(id: string): Promise<NotificationDispatch | undefined>;

  abstract listDeliveriesForDispatch(
    dispatchId: string,
  ): Promise<NotificationDeliveryLog[]>;

  abstract incrementDailySend(userId: string): Promise<number>;

  abstract getDailySendCount(userId: string): Promise<number>;

  abstract clearForUser(userId: string): Promise<void>;
}
