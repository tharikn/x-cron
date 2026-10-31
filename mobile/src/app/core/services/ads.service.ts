import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';
import { AuthService } from './auth.service';
import { PreferencesService } from './preferences.service';

export interface AdCreative {
  id: string;
  slot: string;
  kind: string;
  advertiser: string;
  headline: string;
  body: string;
  ctaLabel: string;
  targetUrl: string;
  label: string;
  labeled: boolean;
}

export interface PromoPackage {
  id: string;
  name: string;
  description: string;
  durationDays: number;
  pricePaise: number;
  badge: string;
}

@Injectable({ providedIn: 'root' })
export class AdsService {
  private readonly http = inject(HttpClient);
  private readonly auth = inject(AuthService);
  private readonly preferences = inject(PreferencesService);

  readonly discoverAd = signal<AdCreative | null>(null);
  readonly packages = signal<PromoPackage[]>([]);

  async loadSlot(slot: 'discover_feed' | 'job_detail_footer'): Promise<AdCreative | null> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ label: string; items: AdCreative[] }>(
          `${environment.apiUrl}/ads/slots/${slot}`,
          { params: { deviceId: this.preferences.deviceId(), limit: '1' } },
        ),
      );
      const item = response.items[0] ?? null;
      if (slot === 'discover_feed') this.discoverAd.set(item);
      if (item) {
        await this.recordEvent(item.id, slot, 'impression');
      }
      return item;
    } catch {
      if (slot === 'discover_feed') this.discoverAd.set(null);
      return null;
    }
  }

  async recordEvent(
    creativeId: string,
    slot: string,
    type: 'impression' | 'click',
  ): Promise<void> {
    try {
      await firstValueFrom(
        this.http.post(`${environment.apiUrl}/ads/events`, {
          creativeId,
          slot,
          type,
          deviceId: this.preferences.deviceId(),
        }),
      );
    } catch {
      // non-blocking
    }
  }

  async loadPackages(): Promise<PromoPackage[]> {
    const response = await firstValueFrom(
      this.http.get<{ items: PromoPackage[] }>(
        `${environment.apiUrl}/promotions/packages`,
      ),
    );
    this.packages.set(response.items);
    return response.items;
  }

  async purchase(jobId: string, packageId: string) {
    return firstValueFrom(
      this.http.post<{
        promotion: { id: string; badge: string; endsAt: string };
        checkout: { amountPaise: number; message: string };
      }>(
        `${environment.apiUrl}/employers/promotions`,
        { jobId, packageId },
        { headers: this.auth.authHeaders() },
      ),
    );
  }
}
