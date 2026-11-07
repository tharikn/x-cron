import { isPlatformBrowser } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Injectable, PLATFORM_ID, computed, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  AppLanguageOption,
  I18nCatalogResponse,
} from '../models/language.model';

const KEY = 'xcron.web.language';

const FALLBACK_LANGUAGES: AppLanguageOption[] = [
  {
    code: 'en',
    name: 'English',
    nativeName: 'English',
    enabled: true,
    sortOrder: 1,
    strings: {
      'nav.home': 'Home',
      'nav.post': 'Post',
      'nav.import': 'Bulk import',
      'nav.myJobs': 'Feeds',
      'nav.admin': 'Dashboard',
      'nav.payments': 'Payments',
      'nav.notifications': 'Notifications',
      'nav.notifAdmin': 'Notification',
      'nav.logs': 'Logs',
      'nav.jobFare': 'Job Fare',
      'nav.preferences': 'Preferences',
      'nav.language': 'Language',
      'nav.theme': 'Theme',
      'nav.signIn': 'Sign in',
      'nav.account': 'Account',
      'nav.logOut': 'Log out',
      'nav.saved': 'Saved jobs',
      'nav.applied': 'Applied jobs',
      'nav.blogApproval': 'Blog Approval',
      'nav.settings': 'Settings',
      'nav.myRating': 'My Rating',
      'nav.siteSettings': 'Site',
      'settings.lead':
        'Language, theme, job preferences, and site config — pick a tab below.',
      'footer.quick.settings': 'Settings',
      'footer.tagline': 'X Cron Jobs · local-first · open browse',
      'footer.blurb':
        'Local-first job discovery for younger seekers. Search freely — contact details stay private until unlock.',
      'footer.headings.quickLinks': 'Quick links',
      'footer.headings.address': 'Visit',
      'footer.headings.social': 'Connect',
      'footer.quick.home': 'Home',
      'footer.quick.post': 'Post a job',
      'footer.quick.prefs': 'Preferences',
      'footer.quick.language': 'Language',
      'footer.quick.signIn': 'Sign in',
      'footer.legal.privacy': 'Privacy',
      'footer.legal.terms': 'Terms',
      'footer.address.operations': 'Operations',
      'footer.map': 'Map',
      'footer.copyright': '© X Cron Jobs. Search open — sign in with Google to save or unlock.',
      'menu.open': 'Open menu',
      'menu.close': 'Close menu',
      'home.headline': '“Find your next opportunity, closer to you.”',
      'home.lead': 'Sign in with Google to save, share, or unlock contact.',
      'home.keyword': 'Keyword',
      'home.keywordPlaceholder': 'Role, skill, employer',
      'home.location': 'Location',
      'home.locationPlaceholder': 'City or district',
      'home.sort': 'Sort',
      'home.search': 'Search',
      'home.clear': 'Clear preferences',
      'home.openRoles': 'Open roles',
      'home.loading': 'Loading jobs…',
      'home.empty': 'No jobs match these filters.',
      'home.maintenanceTitle': 'Server maintenance',
      'home.maintenanceLead': "We're updating X Cron right now. Please try again shortly.",
      'home.viewRole': 'View role',
      'appDownload.eyebrow': 'Android app',
      'appDownload.title': 'Get X Cron on your phone',
      'appDownload.lead':
        'Install the Android app for a faster, thumb-friendly job browse — same jobs, clearer on mobile.',
      'appDownload.cta': 'Download APK',
      'appDownload.ctaVersion': 'Download',
      'appDownload.direct': 'Direct install',
      'appDownload.hint':
        'Downloads the latest APK from GitHub Releases. On Android, allow install from this browser when prompted.',
      'appDownload.published': 'Published',
      'appDownload.versions': 'Versions',
      'appDownload.allReleases': 'All releases on GitHub',
      'appDownload.noReleases':
        'No GitHub releases yet — publish with tag vX.Y.Z after bumping versionCode.',
      'appDownload.nav': 'Get the app',
      'sort.newest': 'Newest',
      'sort.oldest': 'Oldest',
      'sort.salaryDesc': 'Salary high to low',
      'sort.salaryAsc': 'Salary low to high',
      'sort.relevance': 'Relevance',
      'common.verified': 'Verified',
      'common.promoted': 'Promoted',
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
      'onboarding.theme.title': 'Choose your look',
      'onboarding.theme.lead':
        'Pick a theme for X Cron. You can change this anytime in Settings.',
      'onboarding.theme.continue': 'Continue',
      'onboarding.title': 'Complete your profile',
      'onboarding.progress': 'Progress',
      'onboarding.remindLater': 'Remind later',
      'onboarding.next': 'Next',
      'onboarding.back': 'Back',
      'onboarding.finish': 'Finish',
      'onboarding.step.personal': 'Personal information',
      'onboarding.step.location': 'Where are you based?',
      'onboarding.step.career': 'Career info',
      'onboarding.step.skills': 'Skills & preferred cities',
      'onboarding.fields.name': 'Name',
      'onboarding.fields.mobile': 'Mobile',
      'onboarding.fields.email': 'Email',
      'onboarding.fields.showContact': 'Show my contact',
      'onboarding.fields.address': 'Address',
      'onboarding.fields.pincode': 'Pincode',
      'onboarding.fields.experience': 'Experience',
      'onboarding.fields.education': 'Education',
      'onboarding.fields.skills': 'Skills',
      'onboarding.fields.skillsHint':
        'These skills become your Default Easy apply version (2–7 badges).',
      'onboarding.fields.cities': 'Preferred cities',
      'onboarding.fields.openToWork': 'Open to work',
      'onboarding.congrats.title': "You're all set",
      'onboarding.congrats.lead':
        'Your profile is ready. Discover roles that match your skills.',
      'onboarding.congrats.cta': 'Browse jobs',
      'language.title': 'Language',
      'language.lead': 'Choose how labels appear across X Cron Jobs.',
      'language.current': 'Current',
    },
  },
];

@Injectable({ providedIn: 'root' })
export class LocaleService {
  private readonly platformId = inject(PLATFORM_ID);
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

  async hydrate(): Promise<void> {
    try {
      const catalog = await firstValueFrom(
        this.http.get<I18nCatalogResponse>(`${environment.apiUrl}/i18n`),
      );
      const fallbackEn = FALLBACK_LANGUAGES.find((l) => l.code === 'en')?.strings ?? {};
      const items = (catalog.items ?? [])
        .filter((l) => l.enabled !== false)
        .map((l) => ({
          ...l,
          strings: { ...fallbackEn, ...(l.strings ?? {}) },
        }));
      if (items.length) {
        this.languages.set(items);
        const current = this.language();
        if (!items.some((l) => l.code === current)) {
          this.setLanguage(catalog.defaultLocale || items[0].code);
        } else {
          this.applyDocumentLang(current);
        }
      }
    } catch {
      // keep fallback catalog
      this.applyDocumentLang(this.language());
    } finally {
      this.ready.set(true);
    }
  }

  setLanguage(code: string): void {
    const match = this.languages().find((l) => l.code === code);
    if (!match) return;
    this.language.set(code);
    this.applyDocumentLang(code);
    if (isPlatformBrowser(this.platformId)) {
      localStorage.setItem(KEY, code);
    }
  }

  t(key: string): string {
    return this.strings()[key] ?? key;
  }

  label(code: string = this.language()): string {
    const match = this.languages().find((l) => l.code === code);
    return match?.nativeName ?? match?.name ?? code;
  }

  private applyDocumentLang(code: string): void {
    if (isPlatformBrowser(this.platformId)) {
      document.documentElement.lang = code;
    }
  }

  private read(): string {
    if (!isPlatformBrowser(this.platformId)) return 'en';
    return localStorage.getItem(KEY) || 'en';
  }
}
