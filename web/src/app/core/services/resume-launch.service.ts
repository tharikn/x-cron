import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
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
  /** True once the browser navigation to CV has started (kept until unload). */
  readonly redirecting = signal(false);

  async launch(): Promise<void> {
    if (this.busy()) return;
    if (!this.auth.isSignedIn()) {
      await this.router.navigateByUrl('/sign-in');
      return;
    }
    this.busy.set(true);
    this.failed.set(false);
    try {
      let code: string | null = null;
      const base = environment.resumeUrl.replace(/\/+$/, '');
      const redirectUri = `${base}/auth/callback`;
      for (let attempt = 0; attempt < 3; attempt++) {
        try {
          const nonce = crypto.randomUUID().replace(/-/g, '');
          const response = await firstValueFrom(
            this.http.post<{ code: string }>(
              `${environment.apiUrl}/handoff/resume`,
              { redirectUri, nonce },
              { withCredentials: true, headers: this.auth.authHeaders() },
            ),
          );
          code = response.code;
          window.location.assign(
            `${redirectUri}?code=${encodeURIComponent(code)}&nonce=${nonce}`,
          );
          this.redirecting.set(true);
          setTimeout(() => this.redirecting.set(false), 10_000);
          return;
        } catch {
          if (attempt < 2) {
            await new Promise((resolve) => setTimeout(resolve, 300));
          }
        }
      }
      this.failed.set(true);
    } finally {
      this.busy.set(false);
    }
  }
}
