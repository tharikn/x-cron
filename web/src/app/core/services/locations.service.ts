import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../../environments/environment';

export type LocationLevel = 'state' | 'district' | 'subdistrict';

export interface LocationSuggestion {
  id: string;
  name: string;
  label: string;
  level: LocationLevel;
  stateCode: string;
  stateName: string;
  districtCode?: string;
  districtName?: string;
}

@Injectable({ providedIn: 'root' })
export class LocationsService {
  private readonly http = inject(HttpClient);

  search(q: string, limit = 12): Promise<LocationSuggestion[]> {
    const query = q.trim();
    if (query.length < 1) return Promise.resolve([]);
    const params = new HttpParams().set('q', query).set('limit', String(limit));
    return firstValueFrom(
      this.http.get<{ items: LocationSuggestion[] }>(
        `${environment.apiUrl}/locations/search`,
        { params },
      ),
    )
      .then((res) => res.items ?? [])
      .catch(() => []);
  }
}
