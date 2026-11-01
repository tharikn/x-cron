import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import type {
  SiteAuthConfig,
  SiteCommerceConfig,
  SiteFooterConfig,
} from '../models/site.model';
import { AuthService } from './auth.service';

const FALLBACK_FOOTER: SiteFooterConfig = {
  brand: {
    name: 'X Cron',
    productLabel: 'Jobs',
    blurb:
      'Local-first job discovery for younger seekers. Search freely — contact details stay private until unlock.',
  },
  headings: {
    quickLinks: 'Quick links',
    address: 'Visit',
    social: 'Connect',
  },
  addresses: [
    {
      id: 'addr_hq',
      label: 'Operations',
      lines: ['Near Bus Stand Road', 'Palani, Dindigul', 'Tamil Nadu 624601', 'India'],
      mapUrl: 'https://maps.google.com/?q=Palani+Dindigul',
      sortOrder: 1,
    },
  ],
  socialLinks: [
    {
      id: 'soc_x',
      network: 'x',
      label: 'X',
      url: 'https://x.com/xcronjobs',
      sortOrder: 1,
    },
    {
      id: 'soc_ig',
      network: 'instagram',
      label: 'Instagram',
      url: 'https://instagram.com/xcronjobs',
      sortOrder: 2,
    },
    {
      id: 'soc_li',
      network: 'linkedin',
      label: 'LinkedIn',
      url: 'https://linkedin.com/company/xcronjobs',
      sortOrder: 3,
    },
    {
      id: 'soc_yt',
      network: 'youtube',
      label: 'YouTube',
      url: 'https://youtube.com/@xcronjobs',
      sortOrder: 4,
    },
  ],
  quickLinks: [
    { id: 'ql_home', label: 'Home', href: '/', sortOrder: 1 },
    { id: 'ql_post', label: 'Post a job', href: '/post', sortOrder: 2 },
    { id: 'ql_prefs', label: 'Preferences', href: '/preferences', sortOrder: 3 },
    { id: 'ql_lang', label: 'Language', href: '/language', sortOrder: 4 },
    { id: 'ql_signin', label: 'Sign in', href: '/sign-in', sortOrder: 5 },
  ],
  legalLinks: [
    { id: 'leg_privacy', label: 'Privacy', href: '/preferences', sortOrder: 1 },
    { id: 'leg_terms', label: 'Terms', href: '/preferences', sortOrder: 2 },
  ],
  copyright: '© X Cron Jobs. Search open — sign in with Google to save or unlock.',
  updatedAt: new Date(0).toISOString(),
};

const FALLBACK_COMMERCE: SiteCommerceConfig = {
  unlockPricePaise: 500,
  unlockPriceInr: 5,
  paymentsEnabled: true,
  postJobPaymentMode: 'optional',
  postJobPricePaise: 500,
  postJobPriceInr: 5,
  updatedAt: new Date(0).toISOString(),
};

const FALLBACK_AUTH: SiteAuthConfig = {
  sessionTtlDays: 30,
  otpTtlMinutes: 10,
  updatedAt: new Date(0).toISOString(),
};

@Injectable({ providedIn: 'root' })
export class SiteService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);

  readonly footer = signal<SiteFooterConfig>(FALLBACK_FOOTER);
  readonly commerce = signal<SiteCommerceConfig>(FALLBACK_COMMERCE);
  readonly authConfig = signal<SiteAuthConfig>(FALLBACK_AUTH);

  async hydrateFooter(): Promise<void> {
    try {
      const doc = await firstValueFrom(
        this.http.get<SiteFooterConfig>(`${environment.apiUrl}/site/footer`),
      );
      this.footer.set(this.normalize(doc));
    } catch {
      this.footer.set(FALLBACK_FOOTER);
    }
  }

  async hydrateCommerce(): Promise<SiteCommerceConfig> {
    try {
      const doc = await firstValueFrom(
        this.http.get<SiteCommerceConfig>(`${environment.apiUrl}/site/commerce`),
      );
      this.commerce.set(doc);
      return doc;
    } catch {
      this.commerce.set(FALLBACK_COMMERCE);
      return FALLBACK_COMMERCE;
    }
  }

  async updateCommerce(input: {
    unlockPriceInr: number;
    paymentsEnabled: boolean;
    postJobPaymentMode: SiteCommerceConfig['postJobPaymentMode'];
    postJobPriceInr: number;
  }): Promise<SiteCommerceConfig> {
    const doc = await firstValueFrom(
      this.http.put<SiteCommerceConfig>(
        `${environment.apiUrl}/admin/site/commerce`,
        input,
        { headers: this.auth.authHeaders() },
      ),
    );
    this.commerce.set(doc);
    return doc;
  }

  async hydrateAuth(): Promise<SiteAuthConfig> {
    try {
      const doc = await firstValueFrom(
        this.http.get<SiteAuthConfig>(`${environment.apiUrl}/site/auth`),
      );
      this.authConfig.set(doc);
      return doc;
    } catch {
      this.authConfig.set(FALLBACK_AUTH);
      return FALLBACK_AUTH;
    }
  }

  async updateAuth(input: {
    sessionTtlDays: number;
    otpTtlMinutes: number;
  }): Promise<SiteAuthConfig> {
    const doc = await firstValueFrom(
      this.http.put<SiteAuthConfig>(
        `${environment.apiUrl}/admin/site/auth`,
        input,
        { headers: this.auth.authHeaders() },
      ),
    );
    this.authConfig.set(doc);
    return doc;
  }

  isInternalHref(href: string): boolean {
    return href.startsWith('/') && !href.startsWith('//');
  }

  private normalize(doc: SiteFooterConfig): SiteFooterConfig {
    return {
      ...doc,
      addresses: [...(doc.addresses ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
      socialLinks: [...(doc.socialLinks ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
      quickLinks: [...(doc.quickLinks ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
      legalLinks: [...(doc.legalLinks ?? [])].sort((a, b) => a.sortOrder - b.sortOrder),
    };
  }
}
