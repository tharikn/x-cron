import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { DefaultWebViewOptions, InAppBrowser } from '@capacitor/inappbrowser';
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
        await this.openInApp(url);
      } else {
        window.location.assign(url);
      }
    } catch {
      this.failed.set(true);
    } finally {
      this.busy.set(false);
    }
  }

  /**
   * Android: full-screen in-app WebView so XCron CV behaves like a screen of this app
   * (close button + hardware back return to X Cron Jobs). If the WebView plugin
   * fails, fall back to a Chrome Custom Tab so the handoff still works.
   */
  private async openInApp(url: string): Promise<void> {
    try {
      await InAppBrowser.openInWebView({
        url,
        options: {
          ...DefaultWebViewOptions,
          showURL: false,
          showToolbar: true,
          showNavigationButtons: false,
          closeButtonText: 'Close',
          android: { ...DefaultWebViewOptions.android, hardwareBack: true, allowZoom: false },
        },
      });
    } catch {
      await Browser.open({ url, presentationStyle: 'fullscreen' });
    }
  }
}
