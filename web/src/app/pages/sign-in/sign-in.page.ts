import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  computed,
  effect,
  inject,
  signal,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';
import { GoogleIdentityService } from '../../core/services/google-identity.service';
import { SeoService } from '../../core/services/seo.service';

type SignInMode = 'google' | 'admin';

@Component({
  selector: 'app-sign-in',
  imports: [FormsModule, RouterLink],
  templateUrl: './sign-in.page.html',
  styleUrl: './sign-in.page.scss',
})
export class SignInPage implements OnInit, AfterViewInit {
  private readonly auth = inject(AuthService);
  private readonly googleIdentity = inject(GoogleIdentityService);
  private readonly seo = inject(SeoService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);

  @ViewChild('googleBtnHost') private googleBtnHost?: ElementRef<HTMLElement>;

  readonly isSignedIn = this.auth.isSignedIn;
  readonly isAdmin = this.auth.isAdmin;
  readonly user = this.auth.user;
  readonly busy = signal(false);
  readonly error = signal<string | null>(null);
  readonly mode = signal<SignInMode>(this.initialMode());
  readonly googleReady = this.googleIdentity.isConfigured;
  /** Admin password required for Dashboard / History / ops — even if a seeker session exists. */
  readonly needsAdminLogin = computed(() => {
    const modeParam = this.route.snapshot.queryParamMap.get('mode');
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '';
    const wantsAdmin =
      modeParam === 'admin' || this.isAdminReturnUrl(returnUrl);
    return wantsAdmin && !this.isAdmin();
  });

  email = '';
  displayName = '';
  password = '';

  constructor() {
    effect(() => {
      if (this.needsAdminLogin() && this.mode() !== 'admin') {
        this.mode.set('admin');
      }
      if (this.mode() === 'google' && this.googleReady && !this.isSignedIn()) {
        queueMicrotask(() => void this.mountGoogleButton());
      }
    });
  }

  async ngOnInit(): Promise<void> {
    this.seo.setPage({
      title: 'Sign in',
      description: 'Sign in to X Cron Jobs with Google, or admin password for ops.',
      path: '/sign-in',
    });
    await this.auth.ensureSession();
    if (this.needsAdminLogin()) {
      this.mode.set('admin');
    }
  }

  ngAfterViewInit(): void {
    if (this.mode() === 'google' && this.googleReady) {
      void this.mountGoogleButton();
    }
  }

  setMode(value: SignInMode): void {
    if (this.needsAdminLogin() && value !== 'admin') return;
    this.mode.set(value);
    this.error.set(null);
  }

  async signIn(): Promise<void> {
    if (this.mode() === 'admin') {
      await this.signInAdmin();
      return;
    }
    await this.signInGoogle();
  }

  async continueWithGoogle(): Promise<void> {
    if (!this.googleReady) {
      await this.signInGoogle();
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    try {
      const idToken = await this.googleIdentity.requestIdToken();
      await this.auth.signInWithGoogle({ idToken });
      await this.redirectAfterSignIn();
    } catch (err) {
      const message =
        err instanceof Error && err.message
          ? err.message
          : 'Google sign-in failed.';
      this.error.set(message);
    } finally {
      this.busy.set(false);
    }
  }

  async logout(): Promise<void> {
    await this.auth.logout();
  }

  private initialMode(): SignInMode {
    const modeParam = this.route.snapshot.queryParamMap.get('mode');
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '';
    if (modeParam === 'admin' || this.isAdminReturnUrl(returnUrl)) {
      return 'admin';
    }
    return this.googleIdentity.isConfigured ? 'google' : 'google';
  }

  private isAdminReturnUrl(url: string): boolean {
    return (
      url.startsWith('/admin') ||
      url.startsWith('/my-jobs') ||
      url.startsWith('/blog-approval') ||
      url.startsWith('/settings') ||
      url.startsWith('/post') ||
      url.startsWith('/import')
    );
  }

  private async mountGoogleButton(): Promise<void> {
    const host = this.googleBtnHost?.nativeElement;
    if (!host || !this.googleReady) return;
    try {
      await this.googleIdentity.renderButton(host, (idToken) => {
        void this.completeGoogleToken(idToken);
      });
    } catch {
      // Custom button still available via continueWithGoogle()
    }
  }

  private async completeGoogleToken(idToken: string): Promise<void> {
    this.busy.set(true);
    this.error.set(null);
    try {
      await this.auth.signInWithGoogle({ idToken });
      await this.redirectAfterSignIn();
    } catch {
      this.error.set('Google sign-in failed. Is the API running on port 3000?');
    } finally {
      this.busy.set(false);
    }
  }

  private async signInAdmin(): Promise<void> {
    if (!this.email.trim().includes('@') || this.password.trim().length < 8) {
      this.error.set('Enter admin email and password.');
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    try {
      await this.auth.signInAsAdmin({
        email: this.email.trim(),
        password: this.password,
      });
      await this.redirectAfterSignIn();
    } catch {
      this.error.set('Admin sign-in failed. Check credentials and API status.');
    } finally {
      this.busy.set(false);
    }
  }

  private async signInGoogle(): Promise<void> {
    if (this.googleReady) {
      await this.continueWithGoogle();
      return;
    }
    if (!this.email.trim().includes('@')) {
      this.error.set('Enter a valid Google account email.');
      return;
    }
    this.busy.set(true);
    this.error.set(null);
    try {
      await this.auth.signInWithGoogle({
        email: this.email.trim(),
        displayName: this.displayName.trim() || undefined,
      });
      await this.redirectAfterSignIn();
    } catch {
      this.error.set('Sign-in failed. Is the API running on port 3000?');
    } finally {
      this.busy.set(false);
    }
  }

  private async redirectAfterSignIn(): Promise<void> {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (returnUrl?.startsWith('/') && !returnUrl.startsWith('//')) {
      if (this.isAdminReturnUrl(returnUrl) && !this.isAdmin()) {
        this.error.set('Admin password login is required for Dashboard and History.');
        this.mode.set('admin');
        return;
      }
      await this.router.navigateByUrl(returnUrl);
      return;
    }
    if (this.isAdmin()) {
      await this.router.navigateByUrl('/admin');
      return;
    }
    await this.router.navigateByUrl('/');
  }
}
