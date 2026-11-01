export type ChannelProviderKind = 'telegram' | 'whatsapp_manual';

export type ChannelSourceStatus = 'active' | 'paused' | 'error';

export type ChannelMessageStatus =
  | 'pending'
  | 'pulled'
  | 'skipped'
  | 'failed';

export type PullTrigger = 'manual' | 'morning' | 'evening' | 'schedule';

export type PullRunStatus =
  | 'queued'
  | 'running'
  | 'needs_review'
  | 'completed'
  | 'empty'
  | 'failed';

export interface ChannelSource {
  id: string;
  provider: ChannelProviderKind;
  label: string;
  /** Telegram chat id (stringified) or WA group label key */
  externalId: string;
  status: ChannelSourceStatus;
  notes?: string;
  lastMessageAt?: string;
  lastError?: string;
  createdAt: string;
  updatedAt: string;
}

export interface ChannelMessage {
  id: string;
  sourceId: string;
  provider: ChannelProviderKind;
  externalMessageId: string;
  text: string;
  authorName?: string;
  receivedAt: string;
  status: ChannelMessageStatus;
  pullRunId?: string;
  importBatchId?: string;
  error?: string;
  createdAt: string;
}

export interface PullSchedule {
  timezone: string;
  morningEnabled: boolean;
  morningTime: string; // HH:mm
  eveningEnabled: boolean;
  eveningTime: string; // HH:mm
  /** Admin user who owns digest import batches */
  ownerUserId?: string;
  updatedAt: string;
  updatedByUserId?: string;
}

export interface PullRun {
  id: string;
  trigger: PullTrigger;
  status: PullRunStatus;
  sourceIds: string[];
  messageIds: string[];
  messageCount: number;
  recordCount: number;
  importBatchId?: string;
  error?: string;
  startedAt: string;
  finishedAt?: string;
  createdByUserId?: string;
}

export interface WorkflowStageCount {
  key: 'inbox' | 'pulling' | 'review' | 'published' | 'failed';
  label: string;
  count: number;
}

export interface ChannelWorkflowSnapshot {
  stages: WorkflowStageCount[];
  pendingMessages: number;
  activeSources: number;
  lastPull?: PullRun;
  nextPullHint?: string;
  schedule: PullSchedule;
  telegramConfigured: boolean;
}
