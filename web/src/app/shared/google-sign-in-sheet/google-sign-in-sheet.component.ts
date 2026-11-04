import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../core/services/auth.service';
import { ToastService } from '../../core/services/toast.service';
import { friendlyHttpMessage } from '../../core/utils/friendly-http-message';

export type GoogleSignInReason = 'unlock' | 'save' | 'share' | 'apply' | 'generic';

const REASON_COPY: Record<GoogleSignInReason, { title: string; body: string }> = {
  apply: {
    title: 'Sign in to apply',
    body: 'Create an account or sign in so the employer can review your application timeline.',
  },
  unlock: {
    title: 'Sign in to unlock',
    body: 'Create an account or sign in to unlock employer contact and sync your account.',
  },
  save: {
    title: 'Sign in to save',
    body: 'Create an account or sign in to save jobs and load them later.',
  },
  share: {
    title: 'Sign in to share',
    body: 'Create an account or sign in before sharing this role.',
  },
  generic: {
    title: 'Sign in',
    body: 'Create a username and password to sync preferences, saved jobs, and unlocks.',
  },
};

@Component({
  selector: 'app-google-sign-in-sheet',
  imports: [FormsModule],
  templateUrl: './google-sign-in-sheet.component.html',
  styleUrl: './google-sign-in-sheet.component.scss',
})
export class GoogleSignInSheetComponent {
  private readonly auth = inject(AuthService);
  private readonly toast = inject(ToastService);

  readonly open = input(false);
  readonly reason = input<GoogleSignInReason>('generic');
  readonly openChange = output<boolean>();
  readonly signedIn = output<void>();

  readonly busy = signal(false);
  readonly formMode = signal<'login' | 'register'>('login');

  username = '';
  password = '';
  confirmPassword = '';

  constructor() {
    effect(() => {
      if (this.open()) {
        this.busy.set(false);
        this.formMode.set('login');
        this.confirmPassword = '';
      }
    });
  }

  copy(): { title: string; body: string } {
    return REASON_COPY[this.reason()] ?? REASON_COPY.generic;
  }

  setFormMode(mode: 'login' | 'register'): void {
    this.formMode.set(mode);
    this.confirmPassword = '';
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

  async submit(): Promise<void> {
    if (this.formMode() === 'register') {
      await this.register();
      return;
    }
    await this.login();
  }

  private async register(): Promise<void> {
    const username = this.username.trim();
    if (!/^[a-zA-Z0-9_]{3,32}$/.test(username)) {
      this.toast.error('Username: 3–32 letters, numbers, or underscore.');
      return;
    }
    if (this.password.length < 8) {
      this.toast.error('Password must be at least 8 characters.');
      return;
    }
    if (this.password !== this.confirmPassword) {
      this.toast.error('Passwords do not match.');
      return;
    }
    this.busy.set(true);
    try {
      await this.auth.register({
        username,
        password: this.password,
        confirmPassword: this.confirmPassword,
      });
      this.openChange.emit(false);
      this.signedIn.emit();
    } catch (err: unknown) {
      this.toast.error(
        friendlyHttpMessage(err, 'Could not create account. Please try again.'),
      );
    } finally {
      this.busy.set(false);
    }
  }

  private async login(): Promise<void> {
    const username = this.username.trim();
    if (username.length < 3 || this.password.length < 8) {
      this.toast.error('Enter Username and password.');
      return;
    }
    this.busy.set(true);
    try {
      await this.auth.login({ username, password: this.password });
      this.openChange.emit(false);
      this.signedIn.emit();
    } catch (err: unknown) {
      this.toast.error(
        friendlyHttpMessage(err, "Couldn't sign in. Check your username and password."),
      );
    } finally {
      this.busy.set(false);
    }
  }
}
