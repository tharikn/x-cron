import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export type FeedbackAudience = 'seeker' | 'employer';
export type FeedbackCategory =
  | 'question'
  | 'bug'
  | 'suggestion'
  | 'account'
  | 'other';
export type FeedbackThreadStatus =
  | 'open'
  | 'awaiting_admin'
  | 'awaiting_user'
  | 'closed';

export interface FaqItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  sortOrder: number;
}

export interface FeedbackMessage {
  id: string;
  threadId: string;
  senderUserId: string;
  senderRole: 'seeker' | 'employer' | 'admin';
  body: string;
  createdAt: string;
}

/** Peer online / typing from thread detail (ephemeral). */
export interface FeedbackPresence {
  peerOnline: boolean;
  peerLastSeenAt: string | null;
  peerTyping: boolean;
  peerLabel: string;
}

export interface FeedbackThread {
  id: string;
  userId: string;
  audience: FeedbackAudience;
  audienceLabel: string;
  category: FeedbackCategory;
  categoryLabel: string;
  subject: string;
  status: FeedbackThreadStatus;
  statusLabel: string;
  lastMessageAt: string;
  lastSenderRole: string;
  createdAt: string;
  updatedAt: string;
  closedAt: string | null;
  userDisplayName?: string;
  messages?: FeedbackMessage[];
  presence?: FeedbackPresence | null;
}

export interface CreateFeedbackThreadInput {
  audience: FeedbackAudience;
  category: FeedbackCategory;
  subject: string;
  body: string;
}

@Injectable({ providedIn: 'root' })
export class FeedbackService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  readonly faq = signal<FaqItem[]>([]);
  readonly threads = signal<FeedbackThread[]>([]);
  readonly adminThreads = signal<FeedbackThread[]>([]);

  listFaq() {
    return firstValueFrom(
      this.http.get<{ provider: string; items: FaqItem[] }>(
        `${environment.apiUrl}/feedback/faq`,
      ),
    ).then((res) => {
      this.faq.set(res.items);
      return res.items;
    });
  }

  async listMine() {
    const res = await firstValueFrom(
      this.http.get<{ items: FeedbackThread[] }>(
        `${environment.apiUrl}/feedback/threads`,
        { headers: this.auth.authHeaders() },
      ),
    );
    this.threads.set(res.items);
    return res.items;
  }

  getMine(id: string) {
    return firstValueFrom(
      this.http.get<FeedbackThread>(
        `${environment.apiUrl}/feedback/threads/${id}`,
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  createThread(input: CreateFeedbackThreadInput) {
    return firstValueFrom(
      this.http.post<FeedbackThread>(
        `${environment.apiUrl}/feedback/threads`,
        input,
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  sendMessage(id: string, body: string) {
    return firstValueFrom(
      this.http.post<FeedbackMessage>(
        `${environment.apiUrl}/feedback/threads/${id}/messages`,
        { body },
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  setTyping(id: string, typing: boolean) {
    return firstValueFrom(
      this.http.post<{ ok: boolean; presence: FeedbackPresence }>(
        `${environment.apiUrl}/feedback/threads/${id}/typing`,
        { typing },
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  closeMine(id: string) {
    return firstValueFrom(
      this.http.post<FeedbackThread>(
        `${environment.apiUrl}/feedback/threads/${id}/close`,
        {},
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  async listAdmin(params?: { status?: string; audience?: string }) {
    const q = new URLSearchParams();
    if (params?.status) q.set('status', params.status);
    if (params?.audience) q.set('audience', params.audience);
    const qs = q.toString();
    const res = await firstValueFrom(
      this.http.get<{ items: FeedbackThread[] }>(
        `${environment.apiUrl}/admin/feedback/threads${qs ? `?${qs}` : ''}`,
        { headers: this.auth.authHeaders() },
      ),
    );
    this.adminThreads.set(res.items);
    return res.items;
  }

  getAdmin(id: string) {
    return firstValueFrom(
      this.http.get<FeedbackThread>(
        `${environment.apiUrl}/admin/feedback/threads/${id}`,
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  sendAdminMessage(id: string, body: string) {
    return firstValueFrom(
      this.http.post<{ message: FeedbackMessage; thread: FeedbackThread }>(
        `${environment.apiUrl}/admin/feedback/threads/${id}/messages`,
        { body },
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  setAdminTyping(id: string, typing: boolean) {
    return firstValueFrom(
      this.http.post<{ ok: boolean; presence: FeedbackPresence }>(
        `${environment.apiUrl}/admin/feedback/threads/${id}/typing`,
        { typing },
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  closeAdmin(id: string) {
    return firstValueFrom(
      this.http.post<FeedbackThread>(
        `${environment.apiUrl}/admin/feedback/threads/${id}/close`,
        {},
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  reopenAdmin(id: string) {
    return firstValueFrom(
      this.http.post<FeedbackThread>(
        `${environment.apiUrl}/admin/feedback/threads/${id}/reopen`,
        {},
        { headers: this.auth.authHeaders() },
      ),
    );
  }
}
