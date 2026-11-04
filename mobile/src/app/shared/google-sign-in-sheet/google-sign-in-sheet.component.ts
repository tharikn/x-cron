import { Component, effect, inject, input, output, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonModal,
  ToastController,
} from '@ionic/angular';
import { AuthService } from '../../core/services/auth.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { friendlyHttpMessage } from '../../core/utils/friendly-http-message';

export type GoogleSignInReason = 'unlock' | 'save' | 'share' | 'apply' | 'generic';

const REASON_COPY: Record<GoogleSignInReason, { title: string; body: string }> = {
  unlock: {
    title: 'Sign in to unlock',
    body: 'Create an account or sign in to unlock employer contact and sync your account.',
  },
  apply: {
    title: 'Sign in to apply',
    body: 'Create an account or sign in so the employer can review your application timeline.',
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
  private readonly notifications = inject(NotificationsService);
  private readonly toastController = inject(ToastController);

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
      await this.showError('Username: 3–32 letters, numbers, or underscore.');
      return;
    }
    if (this.password.length < 8) {
      await this.showError('Password must be at least 8 characters.');
      return;
    }
    if (this.password !== this.confirmPassword) {
      await this.showError('Passwords do not match.');
      return;
    }
    this.busy.set(true);
    try {
      await this.auth.register({
        username,
        password: this.password,
        confirmPassword: this.confirmPassword,
      });
      await this.afterSignedIn();
    } catch (err: unknown) {
      await this.showError(
        friendlyHttpMessage(err, 'Could not create account. Please try again.'),
      );
    } finally {
      this.busy.set(false);
    }
  }

  private async login(): Promise<void> {
    const username = this.username.trim();
    if (username.length < 3 || this.password.length < 8) {
      await this.showError('Enter Username and password.');
      return;
    }
    this.busy.set(true);
    try {
      await this.auth.login({ username, password: this.password });
      await this.afterSignedIn();
    } catch (err: unknown) {
      await this.showError(
        friendlyHttpMessage(err, "Couldn't sign in. Check your username and password."),
      );
    } finally {
      this.busy.set(false);
    }
  }

  private async afterSignedIn(): Promise<void> {
    try {
      await this.notifications.registerDevice();
    } catch {
      // optional — Account / Prefs also re-register
    }
    this.openChange.emit(false);
    this.signedIn.emit();
  }

  private async showError(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 4200,
      position: 'bottom',
      cssClass: ['xcron-toast', 'xcron-toast--error'],
    });
    await toast.present();
  }
}
