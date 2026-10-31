import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonLabel,
  IonModal,
} from '@ionic/angular';
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
  templateUrl: './google-sign-in-sheet.component.html',
  styleUrls: ['./google-sign-in-sheet.component.scss'],
  imports: [
    FormsModule,
    IonModal,
    IonContent,
    IonButton,
    IonItem,
    IonInput,
  ],
})
export class GoogleSignInSheetComponent {
  private readonly auth = inject(AuthService);
  private readonly googleIdentity = inject(GoogleIdentityService);

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
      }
    });
  }

  copy(): { title: string; body: string } {
    return REASON_COPY[this.reason()] ?? REASON_COPY.generic;
  }

  dismiss(): void {
    if (this.busy()) return;
    this.openChange.emit(false);
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
}
