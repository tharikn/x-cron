import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export type ChannelProviderKind = 'telegram' | 'whatsapp_manual';

export interface ChannelSource {
  id: string;
  provider: ChannelProviderKind;
  label: string;
  externalId: string;
  status: 'active' | 'paused' | 'error';
  notes?: string;
  lastMessageAt?: string;
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
  status: 'pending' | 'pulled' | 'skipped' | 'failed';
  pullRunId?: string;
  importBatchId?: string;
  error?: string;
}

export interface PullSchedule {
  timezone: string;
  morningEnabled: boolean;
  morningTime: string;
  eveningEnabled: boolean;
  eveningTime: string;
  ownerUserId?: string;
  updatedAt: string;
}

export interface PullRun {
  id: string;
  trigger: 'manual' | 'morning' | 'evening' | 'schedule';
  status: 'queued' | 'running' | 'needs_review' | 'completed' | 'empty' | 'failed';
  sourceIds: string[];
  messageIds: string[];
  messageCount: number;
  recordCount: number;
  importBatchId?: string;
  error?: string;
  startedAt: string;
  finishedAt?: string;
}

export interface WorkflowStage {
  key: 'inbox' | 'pulling' | 'review' | 'published' | 'failed';
  label: string;
  count: number;
}

export interface ChannelWorkflow {
  stages: WorkflowStage[];
  pendingMessages: number;
  activeSources: number;
  lastPull?: PullRun;
  nextPullHint?: string;
  schedule: PullSchedule;
  telegramConfigured: boolean;
}

@Injectable({ providedIn: 'root' })
export class ChannelsService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  private headers() {
    return this.auth.authHeaders();
  }

  workflow() {
    return firstValueFrom(
      this.http.get<ChannelWorkflow>(`${environment.apiUrl}/channels/workflow`, {
        headers: this.headers(),
      }),
    );
  }

  listSources() {
    return firstValueFrom(
      this.http.get<{ items: ChannelSource[] }>(
        `${environment.apiUrl}/channels/sources`,
        { headers: this.headers() },
      ),
    );
  }

  createSource(body: {
    provider: ChannelProviderKind;
    label: string;
    externalId: string;
    notes?: string;
  }) {
    return firstValueFrom(
      this.http.post<ChannelSource>(`${environment.apiUrl}/channels/sources`, body, {
        headers: this.headers(),
      }),
    );
  }

  updateSource(
    id: string,
    body: Partial<{ label: string; status: ChannelSource['status']; notes: string; externalId: string }>,
  ) {
    return firstValueFrom(
      this.http.patch<ChannelSource>(
        `${environment.apiUrl}/channels/sources/${id}`,
        body,
        { headers: this.headers() },
      ),
    );
  }

  listMessages(status: ChannelMessage['status'] = 'pending') {
    return firstValueFrom(
      this.http.get<{ items: ChannelMessage[] }>(
        `${environment.apiUrl}/channels/messages`,
        { headers: this.headers(), params: { status } },
      ),
    );
  }

  addManual(body: { text: string; sourceId?: string; authorName?: string; label?: string }) {
    return firstValueFrom(
      this.http.post<ChannelMessage>(
        `${environment.apiUrl}/channels/messages/manual`,
        body,
        { headers: this.headers() },
      ),
    );
  }

  skipMessages(messageIds: string[]) {
    return firstValueFrom(
      this.http.post<{ skipped: number }>(
        `${environment.apiUrl}/channels/messages/skip`,
        { messageIds },
        { headers: this.headers() },
      ),
    );
  }

  pullNow(opts?: {
    sourceIds?: string[];
    messageIds?: string[];
    maxMessages?: number;
  }) {
    return firstValueFrom(
      this.http.post<PullRun>(
        `${environment.apiUrl}/channels/pull`,
        opts ?? {},
        { headers: this.headers() },
      ),
    );
  }

  listPulls() {
    return firstValueFrom(
      this.http.get<{ items: PullRun[] }>(`${environment.apiUrl}/channels/pulls`, {
        headers: this.headers(),
      }),
    );
  }

  getSchedule() {
    return firstValueFrom(
      this.http.get<PullSchedule>(`${environment.apiUrl}/channels/schedule`, {
        headers: this.headers(),
      }),
    );
  }

  updateSchedule(body: Partial<PullSchedule>) {
    return firstValueFrom(
      this.http.put<PullSchedule>(`${environment.apiUrl}/channels/schedule`, body, {
        headers: this.headers(),
      }),
    );
  }
}
