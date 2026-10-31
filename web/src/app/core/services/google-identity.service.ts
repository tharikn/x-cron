import { isPlatformBrowser } from '@angular/common';
import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { environment } from '../../../environments/environment';

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: {
            client_id: string;
            callback: (response: { credential?: string }) => void;
            auto_select?: boolean;
            cancel_on_tap_outside?: boolean;
            ux_mode?: 'popup' | 'redirect';
          }) => void;
          prompt: (
            momentListener?: (notification: {
              isNotDisplayed: () => boolean;
              isSkippedMoment: () => boolean;
              isDismissedMoment: () => boolean;
            }) => void,
          ) => void;
          renderButton: (
            parent: HTMLElement,
            options: {
              theme?: 'outline' | 'filled_blue' | 'filled_black';
              size?: 'large' | 'medium' | 'small';
              text?: 'signin_with' | 'signup_with' | 'continue_with' | 'signin';
              shape?: 'rectangular' | 'pill' | 'circle' | 'square';
              width?: number;
              logo_alignment?: 'left' | 'center';
            },
          ) => void;
          cancel: () => void;
        };
      };
    };
  }
}

const GIS_SRC = 'https://accounts.google.com/gsi/client';

@Injectable({ providedIn: 'root' })
export class GoogleIdentityService {
  private readonly platformId = inject(PLATFORM_ID);
  private loadPromise: Promise<void> | null = null;

  get clientId(): string {
    return (environment.googleClientId || '').trim();
  }

  get isConfigured(): boolean {
    return !!this.clientId;
  }

  /** Opens Google account picker and resolves with an ID token (JWT). */
  async requestIdToken(): Promise<string> {
    if (!isPlatformBrowser(this.platformId)) {
      throw new Error('Google sign-in is only available in the browser.');
    }
    if (!this.clientId) {
      throw new Error('Google client ID is not configured.');
    }

    await this.ensureScript();

    return new Promise<string>((resolve, reject) => {
      let settled = false;
      const finish = (err?: Error, token?: string) => {
        if (settled) return;
        settled = true;
        window.google?.accounts.id.cancel();
        if (err) reject(err);
        else if (token) resolve(token);
        else reject(new Error('Google sign-in failed.'));
      };

      window.google!.accounts.id.initialize({
        client_id: this.clientId,
        ux_mode: 'popup',
        cancel_on_tap_outside: true,
        callback: (response) => {
          if (response.credential) finish(undefined, response.credential);
          else finish(new Error('Google did not return a credential.'));
        },
      });

      window.google!.accounts.id.prompt((notification) => {
        if (
          notification.isNotDisplayed() ||
          notification.isSkippedMoment() ||
          notification.isDismissedMoment()
        ) {
          // One Tap unavailable — fall back to rendered button click via temporary host.
          this.promptViaButton()
            .then((token) => finish(undefined, token))
            .catch((err: unknown) =>
              finish(
                err instanceof Error ? err : new Error('Google sign-in cancelled.'),
              ),
            );
        }
      });
    });
  }

  /** Renders the official Google button into a host element. */
  async renderButton(
    host: HTMLElement,
    onCredential: (idToken: string) => void,
  ): Promise<void> {
    if (!isPlatformBrowser(this.platformId) || !this.clientId) return;
    await this.ensureScript();
    host.replaceChildren();
    window.google!.accounts.id.initialize({
      client_id: this.clientId,
      callback: (response) => {
        if (response.credential) onCredential(response.credential);
      },
    });
    const width = Math.min(360, Math.max(240, host.clientWidth || 320));
    window.google!.accounts.id.renderButton(host, {
      theme: 'filled_black',
      size: 'large',
      text: 'continue_with',
      shape: 'rectangular',
      width,
      logo_alignment: 'left',
    });
  }

  private promptViaButton(): Promise<string> {
    return new Promise((resolve, reject) => {
      const host = document.createElement('div');
      host.setAttribute('aria-hidden', 'true');
      host.style.cssText =
        'position:fixed;left:-9999px;top:0;width:1px;height:1px;overflow:hidden;';
      document.body.appendChild(host);

      const cleanup = () => {
        host.remove();
      };

      window.google!.accounts.id.initialize({
        client_id: this.clientId,
        callback: (response) => {
          cleanup();
          if (response.credential) resolve(response.credential);
          else reject(new Error('Google did not return a credential.'));
        },
      });

      window.google!.accounts.id.renderButton(host, {
        theme: 'filled_black',
        size: 'large',
        text: 'continue_with',
        shape: 'rectangular',
        width: 280,
      });

      const btn = host.querySelector('div[role="button"]') as HTMLElement | null;
      if (!btn) {
        cleanup();
        reject(
          new Error(
            'Google sign-in UI could not open. Allow popups or try again.',
          ),
        );
        return;
      }
      btn.click();

      window.setTimeout(() => {
        cleanup();
        reject(new Error('Google sign-in timed out or was cancelled.'));
      }, 120_000);
    });
  }

  private ensureScript(): Promise<void> {
    if (window.google?.accounts?.id) {
      return Promise.resolve();
    }
    if (this.loadPromise) return this.loadPromise;

    this.loadPromise = new Promise<void>((resolve, reject) => {
      const existing = document.querySelector<HTMLScriptElement>(
        `script[src="${GIS_SRC}"]`,
      );
      if (existing) {
        existing.addEventListener('load', () => resolve(), { once: true });
        existing.addEventListener(
          'error',
          () => reject(new Error('Failed to load Google Identity')),
          { once: true },
        );
        return;
      }
      const script = document.createElement('script');
      script.src = GIS_SRC;
      script.async = true;
      script.defer = true;
      script.onload = () => resolve();
      script.onerror = () => {
        this.loadPromise = null;
        reject(new Error('Failed to load Google Identity'));
      };
      document.head.appendChild(script);
    });

    return this.loadPromise;
  }
}
