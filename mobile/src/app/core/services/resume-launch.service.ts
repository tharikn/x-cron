import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { AppLauncher } from '@capacitor/app-launcher';
import { Browser } from '@capacitor/browser';
import { Capacitor } from '@capacitor/core';
import { DefaultWebViewOptions, InAppBrowser } from '@capacitor/inappbrowser';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { useApiCredentials } from '../utils/api-credentials';
import { csrfHeaders } from '../utils/csrf';
import { AuthService } from './auth.service';

/** Must match the intent filter in the standalone XCron CV APK (com.xcron.cv). */
const NATIVE_CV_REDIRECT = 'xcroncv://auth/callback';

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
      if (Capacitor.isNativePlatform()) {
        // When the standalone CV APK is installed, hand the session to it directly.
        // The in-app WebView remains the fallback (CV app not installed / intent rejected).
        if (await this.canOpenCvApp()) {
          try {
            const url = await this.handoffUrl(NATIVE_CV_REDIRECT);
            await AppLauncher.openUrl({ url });
            return;
          } catch {
            // Fall through to the hosted WebView flow below.
          }
        }
        await this.openInApp(await this.handoffUrl(this.webRedirect()));
      } else {
        window.location.assign(await this.handoffUrl(this.webRedirect()));
      }
    } catch {
      this.failed.set(true);
    } finally {
      this.busy.set(false);
    }
  }

  private webRedirect(): string {
    const base = environment.resumeUrl.replace(/\/+$/, '');
    return `${base}/auth/callback`;
  }

  /** Mints a single-use code bound to the redirect URI + nonce. */
  private async handoffUrl(redirectUri: string): Promise<string> {
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
    return `${redirectUri}?code=${encodeURIComponent(code)}&nonce=${nonce}`;
  }

  /** Android 11+ needs the `<queries>` entry in the host manifest for this to answer true. */
  private async canOpenCvApp(): Promise<boolean> {
    try {
      const { value } = await AppLauncher.canOpenUrl({ url: NATIVE_CV_REDIRECT });
      return value;
    } catch {
      return false;
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
