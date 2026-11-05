import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface JobEnrichPayload {
  title?: string;
  employerName?: string;
  locationCity?: string;
  jobType?: string;
  salaryText?: string;
  vacancies?: number;
  contactWebsite?: string;
  description?: string;
  contentLanguage?: string;
  rawText?: string;
  instruction?: string;
}

export interface JobEnrichResult {
  title?: string;
  employerName?: string;
  locationCity?: string;
  jobType?: string;
  salaryText?: string;
  vacancies?: number;
  contactWebsite?: string;
  description: string;
  contentLanguage?: string;
  cleaned: boolean;
  provider: string;
  notes?: string[];
}

@Injectable({ providedIn: 'root' })
export class AiService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  status(): Promise<{ enabled: boolean; provider: string }> {
    return firstValueFrom(
      this.http.get<{ enabled: boolean; provider: string }>(
        `${environment.apiUrl}/ai/status`,
      ),
    );
  }

  enrichJob(payload: JobEnrichPayload): Promise<JobEnrichResult> {
    return firstValueFrom(
      this.http.post<JobEnrichResult>(
        `${environment.apiUrl}/ai/job-enrich`,
        payload,
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  helpStatus(): Promise<HelpChatStatus> {
    return firstValueFrom(
      this.http.get<HelpChatStatus>(`${environment.apiUrl}/ai/help/status`, {
        headers: this.auth.authHeaders(),
      }),
    );
  }

  helpChat(
    message: string,
    history: HelpChatTurn[] = [],
  ): Promise<HelpChatResult> {
    return firstValueFrom(
      this.http.post<HelpChatResult>(
        `${environment.apiUrl}/ai/help/chat`,
        { message, history },
        { headers: this.auth.authHeaders() },
      ),
    );
  }
}

export interface HelpChatStatus {
  enabled: boolean;
  provider: string;
  model: string | null;
  remainingTokens: number;
  dailyTokenBudget: number;
  usedTokens: number;
  cooldownSecondsRemaining: number;
  coolDownUntil: string | null;
  maxMessageChars: number;
  maxHistoryTurns: number;
  welcome: string;
}

export interface HelpChatTurn {
  role: 'user' | 'assistant';
  content: string;
}

export interface HelpChatResult {
  reply: string;
  provider: string;
  tokensUsed: number;
  remainingTokens: number;
  dailyTokenBudget: number;
  cooldownSecondsRemaining: number;
  coolDownUntil: string | null;
}
