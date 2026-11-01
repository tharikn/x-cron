import { isPlatformBrowser } from '@angular/common';
import {
  Component,
  OnDestroy,
  OnInit,
  PLATFORM_ID,
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

const FOOTER_ITEM_KEYS: Record<string, string> = {
  ql_home: 'footer.quick.home',
  ql_post: 'footer.quick.post',
  ql_prefs: 'footer.quick.prefs',
  ql_lang: 'footer.quick.language',
  ql_signin: 'footer.quick.signIn',
  leg_privacy: 'footer.legal.privacy',
  leg_terms: 'footer.legal.terms',
  addr_hq: 'footer.address.operations',
};

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive, TranslatePipe],
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

  dismissToast(id: number): void {
    this.toastService.dismiss(id);
  }

  isInternalHref(href: string): boolean {
    return this.site.isInternalHref(href);
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
    if (this.auth.isSignedIn()) {
      try {
        await this.notifications.registerDevice();
        await this.notifications.refreshInbox();
      } catch {
        // inbox badge is best-effort
      }
    }
    this.startNotifPolling();
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
    if (typeof document !== 'undefined' && document.visibilityState === 'hidden') {
      return;
    }
    try {
      await this.notifications.refreshInbox();
    } catch {
      // live badge is best-effort
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
