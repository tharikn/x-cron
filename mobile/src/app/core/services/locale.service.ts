import { HttpClient } from '@angular/common/http';
import { Injectable, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  AppLanguageOption,
  I18nCatalogResponse,
} from '../models/language.model';

const KEY = 'xcron.mobile.language';

const FALLBACK_LANGUAGES: AppLanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    enabled: true,
    sortOrder: 1,
    strings: {
      'nav.discover': 'Discover',
      'nav.post': 'Post',
      'nav.prefs': 'Prefs',
      'nav.account': 'Account',
      'nav.signIn': 'Sign in',
      'nav.saved': 'Saved',
      'nav.language': 'Language',
      'nav.theme': 'Theme',
      'nav.settings': 'Settings',
      'nav.notifications': 'Alerts',
      'nav.feedback': 'Feedback',
      'nav.feedbackAdmin': 'Feedback desk',
      'settings.signInForMore':
        'Sign in to unlock Theme, Prefs, and Saved. Language works without an account.',
      'saved.lead': 'Jobs you saved from a role — open them again or remove anytime.',
      'saved.signIn': 'Sign in to see and manage your saved jobs.',
      'saved.refresh': 'Refresh',
      'saved.open': 'Open',
      'saved.remove': 'Remove',
      'saved.empty': 'No saved jobs yet. Save a role from job detail.',
      'language.title': 'Language',
      'language.lead': 'Choose the app language. Job search language stays under Prefs.',
      'language.current': 'Current',
      'theme.title': 'Theme',
      'theme.lead':
        'Pick how X Cron looks on this account. System follows your device light or dark setting.',
      'theme.current': 'Current',
      'theme.system': 'System default',
      'theme.systemHint': 'Match your phone or computer light / dark setting',
      'theme.light': 'Light',
      'theme.lightHint': 'Bright surfaces with violet accents',
      'theme.dark': 'Dark',
      'theme.darkHint': 'Premium night sky (default brand look)',
      'theme.warm': 'Warm',
      'theme.warmHint': 'Soft paper tones with amber glow',
      'home.headline': '“Find your next opportunity, closer to you.”',
      'home.lead': 'Sign in with Google to save, share, or unlock contact.',
      'home.clear': 'Clear preferences',
      'common.any': 'Any',
      'common.language': 'Language',
      'filter.language': 'Language',
      'prefs.title': 'Preferences',
      'prefs.leadGuest':
        'Preferences save on this device. Sign in with Google to keep them across devices.',
      'prefs.leadSignedIn':
        'Signed-in preferences sync across devices. Push alerts use the system notification shade when permitted.',
      'prefs.location': 'Preferred location',
      'prefs.jobType': 'Preferred job type',
      'prefs.jobLanguage': 'Preferred job language',
      'prefs.appLanguage': 'App language',
      'prefs.salaryMin': 'Minimum salary (optional)',
      'prefs.remote': 'Prefer remote / WFH',
      'prefs.save': 'Save preferences',
      'prefs.clear': 'Clear',
      'prefs.notifications': 'Notifications',
      'prefs.jobAlerts': 'Job match alerts',
      'prefs.inAppAlerts': 'In-app inbox',
      'prefs.pushAlerts': 'Push alerts',
      'prefs.emailAlerts': 'Email alerts',
      'prefs.signInForAlerts': 'Sign in to enable push / in-app job alerts.',
      'prefs.saved': 'Preferences saved.',
      'notif.lead':
        'Your job alert inbox. Manage channels under Prefs — push uses the phone notification shade.',
      'notif.inbox': 'Inbox',
      'notif.refresh': 'Refresh',
      'notif.markRead': 'Mark read',
      'notif.empty': 'No in-app notifications yet.',
      'post.contentLanguage': 'Content language',
    },
  },
];

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly http = inject(HttpClient);

  readonly languages = signal<AppLanguageOption[]>(FALLBACK_LANGUAGES);
  readonly language = signal<string>(this.read());
  readonly ready = signal(false);

  readonly strings = computed(() => {
    const code = this.language();
    const match = this.languages().find((l) => l.code === code);
    const en = this.languages().find((l) => l.code === 'en');
    return { ...(en?.strings ?? {}), ...(match?.strings ?? {}) };
  });

  readonly languageLabel = computed(() => {
    const match = this.languages().find((l) => l.code === this.language());
    return match?.nativeName ?? match?.name ?? this.language();
  });

  async hydrate(preferred?: string): Promise<void> {
    try {
      const catalog = await firstValueFrom(
        this.http.get<I18nCatalogResponse>(`${environment.apiUrl}/i18n`),
      );
      const items = (catalog.items ?? []).filter((l) => l.enabled !== false);
      if (items.length) {
        this.languages.set(items);
      }
      const next =
        preferred ||
        this.language() ||
        catalog.defaultLocale ||
        items[0]?.code ||
        'en';
      if (items.length && !items.some((l) => l.code === next)) {
        this.setLanguage(catalog.defaultLocale || items[0].code);
      } else {
        this.setLanguage(next);
      }
    } catch {
      this.applyDocumentLang(this.language());
    } finally {
      this.ready.set(true);
    }
  }

  setLanguage(code: string): void {
    const match = this.languages().find((l) => l.code === code);
    if (!match && this.languages().length) return;
    this.language.set(code);
    localStorage.setItem(KEY, code);
    this.applyDocumentLang(code);
  }

  t(key: string): string {
    return this.strings()[key] ?? key;
  }

  label(code: string = this.language()): string {
    const match = this.languages().find((l) => l.code === code);
    return match?.nativeName ?? match?.name ?? code;
  }

  private applyDocumentLang(code: string): void {
    document.documentElement.lang = code;
  }

  private read(): string {
    return localStorage.getItem(KEY) || 'en';
  }
}
