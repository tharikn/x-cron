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
      'nav.myJobs': 'Posted jobs',
      'nav.admin': 'Dashboard',
      'nav.preferences': 'Preferences',
      'nav.language': 'Language',
      'nav.signIn': 'Sign in',
      'nav.account': 'Account',
      'nav.blogApproval': 'Blog Approval',
      'nav.settings': 'Settings',
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
      'home.headline': 'Local jobs, clearly listed.',
      'home.lead': 'Search jobs freely. Sign in with Google to save, share, or unlock contact.',
      'home.keyword': 'Keyword',
      'home.keywordPlaceholder': 'Role, skill, employer',
      'home.location': 'Location',
      'home.locationPlaceholder': 'City or district',
      'home.sort': 'Sort',
      'home.search': 'Search',
      'home.openRoles': 'Open roles',
      'home.loading': 'Loading jobs…',
      'home.empty': 'No jobs match these filters.',
      'home.maintenanceTitle': 'Server maintenance',
      'home.maintenanceLead': "We're updating X Cron right now. Please try again shortly.",
      'home.viewRole': 'View role',
      'sort.newest': 'Newest',
      'sort.oldest': 'Oldest',
      'sort.salaryDesc': 'Salary high to low',
      'sort.salaryAsc': 'Salary low to high',
      'sort.relevance': 'Relevance',
      'common.verified': 'Verified',
      'common.promoted': 'Promoted',
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
