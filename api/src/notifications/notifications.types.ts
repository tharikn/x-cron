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
  marketingEnabled: boolean;
  quietHoursStart: number | null; // 0–23 local hour, null = off
  quietHoursEnd: number | null;
  dailyCap: number;
  updatedAt: string;
}

export type NotificationChannel = 'push' | 'in_app';

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
  createdAt: string;
  readAt?: string;
  error?: string;
}

export interface PushSendResult {
  ok: boolean;
  providerMessageId?: string;
  error?: string;
}
