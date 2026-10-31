import {
  AfterViewInit,
  Component,
  ElementRef,
  ViewChild,
  effect,
  inject,
  input,
  output,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { GoogleIdentityService } from '../../core/services/google-identity.service';

export type GoogleSignInReason = 'unlock' | 'save' | 'share' | 'generic';

const REASON_COPY: Record<GoogleSignInReason, { title: string; body: string }> = {
  unlock: {
    title: 'Sign in to unlock',
    body: 'Continue with Google to unlock employer contact and sync your account.',
  },
  save: {
    title: 'Sign in to save',
    body: 'Continue with Google to save jobs and load them later.',
  },
  share: {
    title: 'Sign in to share',
    body: 'Continue with Google before sharing this role.',
  },
  generic: {
    title: 'Sign in with Google',
    body: 'Continue with Google to sync preferences, saved jobs, and unlocks.',
  },
};

@Component({
  selector: 'app-google-sign-in-sheet',
  imports: [FormsModule],
  templateUrl: './google-sign-in-sheet.component.html',
  styleUrl: './google-sign-in-sheet.component.scss',
})
export class GoogleSignInSheetComponent implements AfterViewInit {
  private readonly auth = inject(AuthService);
  private readonly googleIdentity = inject(GoogleIdentityService);

  @ViewChild('googleBtnHost') private googleBtnHost?: ElementRef<HTMLElement>;

  readonly open = input(false);
  readonly reason = input<GoogleSignInReason>('generic');
  readonly openChange = output<boolean>();
  readonly signedIn = output<void>();

  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly googleReady = this.googleIdentity.isConfigured;

  email = '';
  displayName = '';

  constructor() {
    effect(() => {
      if (this.open()) {
        this.error.set(null);
        this.busy.set(false);
        if (this.googleReady) {
          queueMicrotask(() => void this.mountGoogleButton());
        }
      }
    });
  }

  ngAfterViewInit(): void {
    if (this.open() && this.googleReady) {
      void this.mountGoogleButton();
    }
  }

  copy(): { title: string; body: string } {
    return REASON_COPY[this.reason()] ?? REASON_COPY.generic;
  }

  dismiss(): void {
    if (this.busy()) return;
    this.openChange.emit(false);
  }

  onBackdrop(event: Event): void {
    if (event.target === event.currentTarget) {
      this.dismiss();
    }
  }

  async continueWithGoogle(): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    try {
      if (this.googleReady) {
        const idToken = await this.googleIdentity.requestIdToken();
        await this.auth.signInWithGoogle({ idToken });
      } else {
        if (!this.email.trim().includes('@')) {
          this.error.set('Enter a valid Google account email.');
          return;
        }
        await this.auth.signInWithGoogle({
          email: this.email.trim(),
          displayName: this.displayName.trim() || undefined,
        });
      }
      this.openChange.emit(false);
      this.signedIn.emit();
    } catch (err) {
      this.error.set(
        err instanceof Error && err.message
          ? err.message
          : 'Google sign-in failed.',
      );
    } finally {
      this.busy.set(false);
    }
  }

  private async mountGoogleButton(): Promise<void> {
    const host = this.googleBtnHost?.nativeElement;
    if (!host || !this.googleReady) return;
    try {
      await this.googleIdentity.renderButton(host, (idToken) => {
        void this.completeToken(idToken);
      });
    } catch {
      // Custom Continue button still works.
    }
  }

  private async completeToken(idToken: string): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    try {
      await this.auth.signInWithGoogle({ idToken });
      this.openChange.emit(false);
      this.signedIn.emit();
    } catch {
      this.error.set('Google sign-in failed. Is the API running?');
    } finally {
      this.busy.set(false);
    }
  }
}
