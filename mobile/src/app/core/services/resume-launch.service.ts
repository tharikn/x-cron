import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { useApiCredentials } from '../utils/api-credentials';
import { csrfHeaders } from '../utils/csrf';
import { AuthService } from './auth.service';

/**
 * Opens XCron CV (standalone microservice) for the signed-in user via a one-time
 * handoff code. No token is placed in the URL. Contract: xcroncv docs/INTEGRATION.md.
 */
@Injectable({ providedIn: 'root' })
export class ResumeLaunchService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);

  readonly busy = signal(false);
  readonly failed = signal(false);

  async launch(): Promise<void> {
    if (this.busy()) return;
    if (!this.auth.isSignedIn()) {
      await this.router.navigateByUrl('/tabs/account');
      return;
    }
    this.busy.set(true);
    this.failed.set(false);
    try {
      const base = environment.resumeUrl.replace(/\/+$/, '');
      const redirectUri = `${base}/auth/callback`;
      const nonce = crypto.randomUUID().replace(/-/g, '');
      const { code } = await firstValueFrom(
        this.http.post<{ code: string }>(
          `${environment.apiUrl}/handoff/resume`,
          { redirectUri, nonce },
          {
            withCredentials: useApiCredentials(),
            headers: { ...this.auth.authHeaders(), ...csrfHeaders() },
          },
        ),
      );
      const url = `${redirectUri}?code=${encodeURIComponent(code)}&nonce=${nonce}`;
      if (Capacitor.isNativePlatform()) {
        await Browser.open({ url, presentationStyle: 'fullscreen' });
      } else {
        window.location.assign(url);
      }
    } catch {
      this.failed.set(true);
    } finally {
      this.busy.set(false);
    }
  }
}
