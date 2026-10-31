import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface AdCreative {
  id: string;
  advertiser: string;
  headline: string;
  body: string;
  ctaLabel: string;
  targetUrl: string;
  label: string;
}

@Injectable({ providedIn: 'root' })
export class AdsService {
  private readonly http = inject(HttpClient);

  async loadHomeRail(): Promise<AdCreative[]> {
    try {
      const response = await firstValueFrom(
        this.http.get<{ items: AdCreative[] }>(
          `${environment.apiUrl}/ads/slots/web_home_rail`,
          { params: { deviceId: 'web_ssr', limit: '2' } },
        ),
      );
      for (const item of response.items) {
        void firstValueFrom(
          this.http.post(`${environment.apiUrl}/ads/events`, {
            creativeId: item.id,
            slot: 'web_home_rail',
            type: 'impression',
            deviceId: 'web_ssr',
          }),
        ).catch(() => undefined);
      }
      return response.items;
    } catch {
      return [];
    }
  }
}
