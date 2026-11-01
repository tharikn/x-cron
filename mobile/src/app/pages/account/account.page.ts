import { DatePipe } from '@angular/common';
import { Component, OnInit, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import {
  AlertController,
  IonButton,
  IonContent,
  IonHeader,
  IonItem,
  IonLabel,
  IonList,
  IonNote,
  IonSelect,
  IonSelectOption,
  IonTitle,
  IonToolbar,
  ToastController,
} from '@ionic/angular';
import type { Job } from '../../core/models/job.model';
import { AuthService } from '../../core/services/auth.service';
import { GoogleIdentityService } from '../../core/services/google-identity.service';
import { JobsService } from '../../core/services/jobs.service';
import { NotificationsService } from '../../core/services/notifications.service';
import { PaymentsService } from '../../core/services/payments.service';
import { PreferencesService } from '../../core/services/preferences.service';
import { SeekerService } from '../../core/services/seeker.service';

@Component({
  selector: 'app-account',
  templateUrl: './account.page.html',
  styleUrls: ['./account.page.scss'],
  imports: [
    DatePipe,
    FormsModule,
    RouterLink,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonLabel,
    IonNote,
    IonButton,
    IonSelect,
    IonSelectOption,
  ],
})
export class AccountPage implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly googleIdentity = inject(GoogleIdentityService);
  private readonly jobsService = inject(JobsService);
  private readonly preferences = inject(PreferencesService);
  private readonly notifications = inject(NotificationsService);
  private readonly payments = inject(PaymentsService);
  private readonly seeker = inject(SeekerService);
  private readonly toastController = inject(ToastController);
  private readonly alertController = inject(AlertController);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly user = this.auth.user;
  readonly employer = this.auth.employer;
  readonly isSignedIn = this.auth.isSignedIn;
  readonly isAdmin = this.auth.isAdmin;
  readonly queue = signal<Job[]>([]);
  readonly inbox = this.notifications.items;
  readonly savedJobs = this.seeker.saved;
  readonly feedJobs = this.seeker.feed;
  readonly plans = signal<
    Array<{ id: string; name: string; description: string; pricePaise: number }>
  >([]);
  readonly subscriptionLabel = signal<string>('None');
  readonly needsAdminLogin = computed(() => {
    const modeParam = this.route.snapshot.queryParamMap.get('mode');
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '';
    const wantsAdmin =
      modeParam === 'admin' ||
      returnUrl.startsWith('/tabs/post') ||
      returnUrl.startsWith('/tabs/ads') ||
      returnUrl.startsWith('/tabs/import') ||
      returnUrl.startsWith('/tabs/job-fare');
    return wantsAdmin && !this.isAdmin();
  });

  selectedPlanId = 'seeker_weekly';

  async ngOnInit(): Promise<void> {
    await this.auth.ensureSession();
    if (this.isSignedIn() && !this.needsAdminLogin()) {
      await this.afterSignIn();
      await this.redirectIfNeeded();
      return;
    }
    if (this.needsAdminLogin() && !this.isAdmin()) {
      // Keep current session visible; prompt admin password only when needed.
      await this.signInAsAdmin();
    } else if (this.isSignedIn()) {
      await this.afterSignIn();
      await this.redirectIfNeeded();
    }
  }

  async signInAsAdmin(): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Admin sign in',
      message: 'Use the SUPER_ADMIN email and password for Post, Ads, and moderation.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'superadmin@xcron.app',
          value: '',
        },
        {
          name: 'password',
          type: 'password',
          placeholder: 'Password',
        },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Sign in',
          handler: (data) => {
            void this.completeAdminLogin(data?.email, data?.password);
            return false;
          },
        },
      ],
    });
    await alert.present();
  }

  async signInWithGoogle(): Promise<void> {
    if (this.googleIdentity.isConfigured) {
      try {
        const idToken = await this.googleIdentity.requestIdToken();
        await this.auth.signInWithGoogle({ idToken });
        await this.afterSignIn();
        await this.showToast(
          this.isAdmin()
            ? 'Signed in as admin. Post and Ads tabs unlocked.'
            : 'Signed in with Google.',
        );
        await this.redirectIfNeeded();
      } catch (err) {
        const message =
          err instanceof Error && err.message
            ? err.message
            : 'Google sign-in failed.';
        await this.showToast(message);
      }
      return;
    }

    const alert = await this.alertController.create({
      header: 'Continue with Google',
      message:
        'Local stub — enter the Google account email. Set googleClientId for real Google Identity.',
      inputs: [
        {
          name: 'email',
          type: 'email',
          placeholder: 'you@gmail.com',
          value: '',
        },
        {
          name: 'displayName',
          type: 'text',
          placeholder: 'Display name (optional)',
        },
      ],
      buttons: [
        { text: 'Cancel', role: 'cancel' },
        {
          text: 'Sign in',
          handler: (data) => {
            void this.completeGoogleStub(data?.email, data?.displayName);
            return false;
          },
        },
      ],
    });
    await alert.present();
  }

  private async completeAdminLogin(email?: string, password?: string): Promise<void> {
    if (!email?.trim()?.includes('@') || !password || password.length < 8) {
      await this.showToast('Enter admin email and password.');
      return;
    }
    try {
      await this.auth.signInAsAdmin({
        email: email.trim(),
        password,
      });
      const top = await this.alertController.getTop();
      await top?.dismiss();
      await this.afterSignIn();
      await this.showToast('Signed in as super admin.');
      await this.redirectIfNeeded();
    } catch {
      await this.showToast('Admin sign-in failed. Check credentials and API.');
    }
  }

  private async completeGoogleStub(email?: string, displayName?: string): Promise<void> {
    if (!email?.trim() || !email.includes('@')) {
      await this.showToast('Enter a valid email.');
      return;
    }
    try {
      await this.auth.signInWithGoogle({
        email: email.trim(),
        displayName: displayName?.trim() || undefined,
      });
      const top = await this.alertController.getTop();
      await top?.dismiss();
      await this.afterSignIn();
      await this.showToast(
        this.isAdmin()
          ? 'Signed in as admin. Post and Ads tabs unlocked.'
          : 'Signed in with Google.',
      );
      await this.redirectIfNeeded();
    } catch {
      await this.showToast('Google sign-in failed. Is the API running?');
    }
  }

  async logout(): Promise<void> {
    await this.auth.logout();
    this.queue.set([]);
    this.notifications.items.set([]);
    this.seeker.saved.set([]);
    this.seeker.feed.set([]);
    await this.showToast('Signed out. Guest browsing still works.');
  }

  async buySubscription(): Promise<void> {
    try {
      const entitlement = await this.payments.checkoutSubscription(this.selectedPlanId);
      this.subscriptionLabel.set(
        entitlement?.validUntil
          ? `Active until ${new Date(entitlement.validUntil).toLocaleDateString('en-IN')}`
          : 'Active',
      );
      await this.showToast('Subscription activated (stub payment).');
    } catch {
      await this.showToast('Could not start subscription checkout.');
    }
  }

  async deleteAccount(): Promise<void> {
    try {
      await this.seeker.deleteAccount();
      await this.auth.logout();
      this.queue.set([]);
      this.seeker.saved.set([]);
      await this.showToast('Account deleted.');
    } catch {
      await this.showToast('Could not delete account.');
    }
  }

  async markRead(id: string): Promise<void> {
    try {
      await this.notifications.markRead(id);
    } catch {
      await this.showToast('Could not mark notification read.');
    }
  }

  async refreshInbox(): Promise<void> {
    try {
      await this.notifications.refreshInbox();
    } catch {
      await this.showToast('Could not load notifications.');
    }
  }

  private async afterSignIn(): Promise<void> {
    try {
      await this.preferences.hydrate();
      await this.notifications.registerDevice();
      await this.notifications.loadPrefs();
      await this.notifications.refreshInbox({ announce: false });
      if (this.notifications.prefs().pushAlertsEnabled !== false) {
        await this.notifications.ensurePushPermission();
      }
      this.notifications.startPolling();
      this.plans.set(await this.payments.listSubscriptionPlans());
      const entitlements = await this.payments.listEntitlements();
      this.subscriptionLabel.set(
        entitlements.subscription?.validUntil
          ? `Active until ${new Date(entitlements.subscription.validUntil).toLocaleDateString('en-IN')}`
          : 'None',
      );
      await this.seeker.loadSaved();
      await this.seeker.loadFeed();
    } catch {
      // API optional for account chrome
    }
    if (this.isAdmin()) await this.reloadQueue();
  }

  private async redirectIfNeeded(): Promise<void> {
    const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl');
    if (!returnUrl?.startsWith('/') || returnUrl.startsWith('//')) return;
    if (!this.isAdmin()) return;
    await this.router.navigateByUrl(returnUrl);
  }

  async reloadQueue(): Promise<void> {
    try {
      this.queue.set(await this.jobsService.moderationQueue('needs-review'));
    } catch {
      this.queue.set([]);
    }
  }

  async approve(job: Job): Promise<void> {
    await this.jobsService.approveJob(job.id, 'Approved');
    await this.reloadQueue();
    await this.showToast(`Approved ${job.title}`);
  }

  async reject(job: Job): Promise<void> {
    await this.jobsService.rejectJob(job.id, 'Rejected by moderator');
    await this.reloadQueue();
    await this.showToast(`Rejected ${job.title}`);
  }

  private async showToast(message: string): Promise<void> {
    const toast = await this.toastController.create({
      message,
      duration: 2200,
      color: 'dark',
    });
    await toast.present();
  }
}
