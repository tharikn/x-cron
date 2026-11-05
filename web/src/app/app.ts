import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
  computed,
  inject,
  signal,
} from '@angular/core';
import {
  NavigationCancel,
  NavigationEnd,
  NavigationError,
  NavigationStart,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet,
} from '@angular/router';
import { filter, Subscription } from 'rxjs';
import { TranslatePipe } from './core/pipes/translate.pipe';
import { ApiLoadingService } from './core/services/api-loading.service';
import { AuthService } from './core/services/auth.service';
import { LocaleService } from './core/services/locale.service';
import { NotificationsService } from './core/services/notifications.service';
import { SiteService } from './core/services/site.service';
import { ToastService } from './core/services/toast.service';
import { GetAppCtaComponent } from './shared/get-app-cta/get-app-cta.component';
import { HelpChatComponent } from './shared/help-chat/help-chat.component';

const FOOTER_ITEM_KEYS: Record<string, string> = {
  ql_home: 'footer.quick.home',
  ql_post: 'footer.quick.post',
  ql_settings: 'footer.quick.settings',
  ql_prefs: 'footer.quick.prefs',
  ql_lang: 'footer.quick.language',
  ql_signin: 'footer.quick.signIn',
  leg_privacy: 'footer.legal.privacy',
  leg_terms: 'footer.legal.terms',
  addr_hq: 'footer.address.operations',
};

@Component({
  selector: 'app-root',
  imports: [
    RouterOutlet,
    RouterLink,
    RouterLinkActive,
    TranslatePipe,
    GetAppCtaComponent,
    HelpChatComponent,
  ],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App implements OnInit, OnDestroy {
  private readonly router = inject(Router);
  private readonly platformId = inject(PLATFORM_ID);
  private readonly auth = inject(AuthService);
  private readonly locale = inject(LocaleService);
  private readonly site = inject(SiteService);
  private readonly apiLoading = inject(ApiLoadingService);
  private readonly toastService = inject(ToastService);
  private readonly notifications = inject(NotificationsService);
  private navSub?: Subscription;
  private notifPollId: ReturnType<typeof setInterval> | null = null;
  private readonly onVisChange = () => {
    if (typeof document !== 'undefined' && document.visibilityState === 'visible') {
      void this.pollNotifications();
    }
  };

  readonly menuOpen = signal(false);
  readonly navigating = signal(false);
  readonly apiBusy = this.apiLoading.visible;
  readonly toasts = this.toastService.messages;
  readonly isSignedIn = this.auth.isSignedIn;
  readonly isAdmin = this.auth.isAdmin;
  readonly isEmployer = this.auth.isEmployer;
  /** Drawer label when signed in: display name → username → email. */
  readonly profileLabel = computed(() => {
    const u = this.auth.user();
    if (!u) return '';
    return (
      u.displayName?.trim() ||
      u.username?.trim() ||
      u.email?.trim() ||
      ''
    );
  });
  /** Default avatar initials when no photo URL exists. */
  readonly profileInitials = computed(() => {
    const label = this.profileLabel();
    if (!label) return '?';
    const parts = label.trim().split(/\s+/).filter(Boolean);
    if (parts.length >= 2) {
      return `${parts[0]![0] ?? ''}${parts[1]![0] ?? ''}`.toUpperCase();
    }
    return label.slice(0, 2).toUpperCase();
  });
  readonly languageLabel = this.locale.languageLabel;
  readonly footer = this.site.footer;
  readonly notifUnread = this.notifications.unreadCount;

  ngOnInit(): void {
    void this.locale.hydrate();
    void this.site.hydrateFooter();
    void this.hydrateNotifications();
    this.navSub = this.router.events
      .pipe(
        filter(
          (e) =>
            e instanceof NavigationStart ||
            e instanceof NavigationEnd ||
            e instanceof NavigationCancel ||
            e instanceof NavigationError,
        ),
      )
      .subscribe((e) => {
        if (e instanceof NavigationStart) {
          this.navigating.set(true);
          return;
        }
        this.navigating.set(false);
        this.closeMenu();
      });
  }

  ngOnDestroy(): void {
    this.navSub?.unsubscribe();
    this.stopNotifPolling();
    this.unlockBody();
  }

  toggleMenu(): void {
    if (this.menuOpen()) this.closeMenu();
    else this.openMenu();
  }

  openMenu(): void {
    this.menuOpen.set(true);
    this.lockBody();
  }

  closeMenu(): void {
    this.menuOpen.set(false);
    this.unlockBody();
  }

  async logout(): Promise<void> {
    this.closeMenu();
    await this.auth.logout();
    void this.router.navigateByUrl('/');
  }

  dismissToast(id: number): void {
    this.toastService.dismiss(id);
  }

  isInternalHref(href: string): boolean {
    return this.site.isInternalHref(href);
  }

  /** Guest chrome: hide account-only quick links (settings/prefs/saved/applied/alerts/score). */
  showFooterQuickLink(href: string, id: string): boolean {
    // Seeker-only destinations — recruiters use Activity / Recruiter desk instead.
    if (this.isEmployer() && (id === 'ql_saved' || id === 'ql_applied')) {
      return false;
    }
    if (this.isSignedIn()) return true;
    const authOnlyIds = new Set([
      'ql_settings',
      'ql_prefs',
      'ql_saved',
      'ql_applied',
      'ql_notifications',
      'ql_performance',
    ]);
    if (authOnlyIds.has(id)) return false;
    const path = href.split('?')[0] ?? href;
    return ![
      '/settings',
      '/preferences',
      '/me',
      '/notifications',
      '/performance',
    ].some((p) => path === p || path.startsWith(`${p}/`));
  }

  /** Translate footer chrome; fall back to CMS English when key is missing. */
  footerText(key: string, fallback: string): string {
    const value = this.locale.t(key);
    return !value || value === key ? fallback : value;
  }

  footerItemLabel(id: string, fallback: string): string {
    const key = FOOTER_ITEM_KEYS[id];
    return key ? this.footerText(key, fallback) : fallback;
  }

  private async hydrateNotifications(): Promise<void> {
    if (!isPlatformBrowser(this.platformId)) return;
    await this.auth.ensureSession();
    this.notifications.watchOsPermission((status) => {
      this.toastOsPermission(status);
    });
    if (this.auth.isSignedIn()) {
      try {
        await this.notifications.registerDevice();
        await this.notifications.loadPrefs();
        if (this.notifications.prefs().pushAlertsEnabled !== false) {
          const result = await this.notifications.promptOsPermissionAfterSignIn();
          if (result.asked) {
            this.toastOsPermission(result.status);
          }
        }
        // First paint: badge only — avoid shade spam for older unread.
        await this.notifications.refreshInbox({ announce: false });
      } catch {
        // inbox badge is best-effort
      }
    }
    this.startNotifPolling();
  }

  private toastOsPermission(
    status: 'granted' | 'denied' | 'prompt' | 'unsupported',
  ): void {
    if (status === 'granted') {
      this.toastService.show('System notifications enabled');
      return;
    }
    if (status === 'denied') {
      this.toastService.show(
        'System notifications blocked — enable them in browser settings',
        'error',
      );
      return;
    }
    if (status === 'unsupported') {
      this.toastService.show(
        'This browser does not support system notifications',
        'error',
      );
    }
  }

  private startNotifPolling(): void {
    if (!isPlatformBrowser(this.platformId) || this.notifPollId != null) return;
    this.notifPollId = setInterval(() => {
      void this.pollNotifications();
    }, 20_000);
    document.addEventListener('visibilitychange', this.onVisChange);
  }

  private stopNotifPolling(): void {
    if (this.notifPollId != null) {
      clearInterval(this.notifPollId);
      this.notifPollId = null;
    }
    if (isPlatformBrowser(this.platformId)) {
      document.removeEventListener('visibilitychange', this.onVisChange);
    }
  }

  private async pollNotifications(): Promise<void> {
    if (!this.auth.isSignedIn()) return;
    try {
      // Poll even when the tab is hidden so browser system notifications can fire.
      await this.notifications.refreshInbox({ announce: true });
    } catch {
      // live badge / OS shade is best-effort
    }
  }

  private lockBody(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = 'hidden';
    }
  }

  private unlockBody(): void {
    if (isPlatformBrowser(this.platformId)) {
      document.body.style.overflow = '';
    }
  }
}
