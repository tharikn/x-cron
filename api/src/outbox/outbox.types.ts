export type OutboxStatus = 'pending' | 'processing' | 'processed' | 'failed';

export type OutboxTopic =
  | 'job.published'
  | 'application.event'
  | 'notification.fanout';

export interface OutboxPayload {
  jobId?: string;
  applicationId?: string;
  [key: string]: unknown;
}

export interface OutboxRecord {
  id: string;
  topic: OutboxTopic | string;
  payload: OutboxPayload;
  status: OutboxStatus;
  attempts: number;
  availableAt: string;
  processedAt?: string;
  lastError?: string;
  createdAt: string;
}
