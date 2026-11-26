import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { UploadedAsset, UploadPurpose } from '../models/upload.model';
import { AuthService } from './auth.service';

/**
 * Isolated transport for the storage API. Feature services (portfolio, jobs)
 * call this instead of knowing about multipart or object storage.
 */
@Injectable({ providedIn: 'root' })
export class UploadApiService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly base = `${environment.apiUrl}/storage`;

  upload(file: File, purpose: UploadPurpose): Promise<UploadedAsset> {
    const body = new FormData();
    body.append('file', file, file.name);
    body.append('purpose', purpose);
    return firstValueFrom(
      this.http.post<UploadedAsset>(`${this.base}/uploads`, body, {
        headers: this.auth.authHeaders(),
        withCredentials: true,
      }),
    );
  }

  deleteAsset(assetId: string): Promise<{ ok: boolean }> {
    return firstValueFrom(
      this.http.delete<{ ok: boolean }>(
        `${this.base}/assets/${encodeURIComponent(assetId)}`,
        { headers: this.auth.authHeaders(), withCredentials: true },
      ),
    );
  }
}
