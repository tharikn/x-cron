import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';

export interface ImportBatch {
  id: string;
  status: string;
  sourceType: string;
  filename: string;
  totalRecords: number;
  processedRecords: number;
  errorCount: number;
  warnings: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ImportRecord {
  id: string;
  batchId: string;
  sourceLocator: string;
  confidence: number;
  dedupeStatus: string;
  reviewStatus: string;
  jobId?: string;
  error?: string;
  extraction: {
    title?: string;
    employerName?: string;
    locationCity?: string;
    jobType?: string;
    salaryText?: string;
    vacancies?: number;
    description?: string;
    contentLanguage?: string;
    hasPhone?: boolean;
    hasEmail?: boolean;
    hasWebsite?: boolean;
    contactWebsite?: string;
    notes?: string[];
    aiCleaned?: boolean;
  };
}

@Injectable({ providedIn: 'root' })
export class IngestionService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  createBatch(sourceType?: string): Promise<ImportBatch> {
    return firstValueFrom(
      this.http.post<ImportBatch>(
        `${environment.apiUrl}/import-batches`,
        { sourceType },
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  getBatch(id: string): Promise<ImportBatch> {
    return firstValueFrom(
      this.http.get<ImportBatch>(`${environment.apiUrl}/import-batches/${id}`, {
        headers: this.auth.authHeaders(),
      }),
    );
  }

  getRecords(id: string): Promise<ImportRecord[]> {
    return firstValueFrom(
      this.http.get<{ items: ImportRecord[] }>(
        `${environment.apiUrl}/import-batches/${id}/records`,
        { headers: this.auth.authHeaders() },
      ),
    ).then((res) => res.items);
  }

  uploadText(
    batchId: string,
    text: string,
    sourceType: 'text' | 'whatsapp' | 'telegram' = 'whatsapp',
  ): Promise<ImportBatch> {
    return firstValueFrom(
      this.http.post<ImportBatch>(
        `${environment.apiUrl}/import-batches/${batchId}/uploads/text`,
        { text, sourceType, filename: 'paste.txt' },
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  uploadFile(batchId: string, file: File, sourceType?: string): Promise<ImportBatch> {
    const body = new FormData();
    body.append('file', file, file.name);
    const query = sourceType ? `?sourceType=${encodeURIComponent(sourceType)}` : '';
    return firstValueFrom(
      this.http.post<ImportBatch>(
        `${environment.apiUrl}/import-batches/${batchId}/uploads${query}`,
        body,
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  approve(
    batchId: string,
    recordIds: string[],
  ): Promise<{ published: number; failed: number }> {
    return firstValueFrom(
      this.http.post<{ published: number; failed: number }>(
        `${environment.apiUrl}/import-batches/${batchId}/approve`,
        { recordIds },
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  enrichRecord(
    batchId: string,
    recordId: string,
    instruction?: string,
  ): Promise<{ cleaned: boolean; provider: string; record: ImportRecord }> {
    return firstValueFrom(
      this.http.post<{ cleaned: boolean; provider: string; record: ImportRecord }>(
        `${environment.apiUrl}/import-batches/${batchId}/records/${recordId}/enrich`,
        instruction ? { instruction } : {},
        { headers: this.auth.authHeaders() },
      ),
    );
  }

  updateRecord(
    batchId: string,
    recordId: string,
    patch: {
      title?: string;
      employerName?: string;
      locationCity?: string;
      jobType?: string;
      salaryText?: string;
      vacancies?: number;
      description?: string;
      contentLanguage?: string;
      contactWebsite?: string;
    },
  ): Promise<ImportRecord> {
    return firstValueFrom(
      this.http.patch<ImportRecord>(
        `${environment.apiUrl}/import-batches/${batchId}/records/${recordId}`,
        patch,
        { headers: this.auth.authHeaders() },
      ),
    );
  }
}
