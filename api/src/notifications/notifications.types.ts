export type PushPlatform = 'android' | 'ios' | 'web';

export interface DeviceRegistration {
  id: string;
  userId?: string;
  deviceId: string;
  fcmToken: string;
  platform: PushPlatform;
  createdAt: string;
  updatedAt: string;
  lastSeenAt: string;
}

export interface NotificationPreferences {
  userId: string;
  jobAlertsEnabled: boolean;
  /** In-app inbox (always free). */
  inAppEnabled: boolean;
  /** Device push via PUSH_PROVIDER (stub/fcm). */
  pushAlertsEnabled: boolean;
  /** Email via MAIL_PROVIDER (stub/console/smtp). */
  emailAlertsEnabled: boolean;
  marketingEnabled: boolean;
  quietHoursStart: number | null; // 0–23 local hour, null = off
  quietHoursEnd: number | null;
  dailyCap: number;
  updatedAt: string;
}

export type NotificationChannel = 'push' | 'in_app' | 'mail';

export type NotificationStatus =
  | 'queued'
  | 'sent'
  | 'failed'
  | 'suppressed'
  | 'read';

export interface NotificationRecord {
  id: string;
  userId: string;
  channel: NotificationChannel;
  template: string;
  title: string;
  body: string;
  data?: Record<string, string>;
  status: NotificationStatus;
  dedupeKey: string;
  jobId?: string;
  dispatchId?: string;
  provider?: string;
  providerMessageId?: string;
  createdAt: string;
  readAt?: string;
  error?: string;
}

export type NotificationTriggerType =
  | 'job_published'
  | 'application_event'
  | 'user_welcome'
  | 'profile_complete'
  | 'dev_test';

export type NotificationDispatchStatus =
  | 'running'
  | 'completed'
  | 'failed'
  | 'skipped';

/** One fan-out run (e.g. job published → match subscribers). */
export interface NotificationDispatch {
  id: string;
  triggerType: NotificationTriggerType;
  jobId?: string;
  status: NotificationDispatchStatus;
  matchedCount: number;
  sentCount: number;
  suppressedCount: number;
  failedCount: number;
  skippedReason?: string;
  meta?: Record<string, string | number | boolean | null>;
  startedAt: string;
  finishedAt?: string;
}

/** Per user × channel attempt under a dispatch. */
export interface NotificationDeliveryLog {
  id: string;
  dispatchId: string;
  userId: string;
  channel: NotificationChannel;
  status: NotificationStatus;
  provider?: string;
  providerMessageId?: string;
  title: string;
  body: string;
  dedupeKey: string;
  jobId?: string;
  error?: string;
  createdAt: string;
}

export interface PushSendResult {
  ok: boolean;
  providerMessageId?: string;
  error?: string;
}
