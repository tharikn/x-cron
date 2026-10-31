import {
  Injectable,
  Logger,
  OnModuleInit,
  ServiceUnavailableException,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type {
  LgdDistrict,
  LgdSearchHit,
  LgdState,
  LocationSuggestion,
} from './locations.types';

const DEFAULT_LGD_BASE = 'https://india-lgd-index-api.vercel.app';

@Injectable()
export class LocationsService implements OnModuleInit {
  private readonly logger = new Logger(LocationsService.name);
  private readonly baseUrl: string;
  private states: LgdState[] = [];
  private districts: LgdDistrict[] = [];
  private stateByCode = new Map<string, LgdState>();
  private districtByCode = new Map<string, LgdDistrict>();
  private ready = false;
  private warmPromise: Promise<void> | null = null;

  constructor(private readonly config: ConfigService) {
    this.baseUrl = (
      this.config.get<string>('LGD_API_BASE') ?? DEFAULT_LGD_BASE
    ).replace(/\/$/, '');
  }

  onModuleInit() {
    void this.ensureReady().catch((err: unknown) => {
      this.logger.warn(
        `LGD warm-up failed; will retry on first request: ${String(err)}`,
      );
    });
  }

  async listStates(): Promise<{ items: LocationSuggestion[] }> {
    await this.ensureReady();
    return {
      items: this.states.map((state) => this.toStateSuggestion(state)),
    };
  }

  async listDistricts(
    stateCode: string,
  ): Promise<{ items: LocationSuggestion[] }> {
    await this.ensureReady();
    const code = stateCode.trim();
    const state = this.stateByCode.get(code);
    if (!state) {
      return { items: [] };
    }
    const items = this.districts
      .filter((d) => d.state_code === code)
      .map((d) => this.toDistrictSuggestion(d, state));
    return { items };
  }

  async search(
    q: string,
    limit = 12,
  ): Promise<{ items: LocationSuggestion[]; source: string }> {
    const query = q.trim().toLowerCase();
    if (!query) {
      return { items: [], source: 'local' };
    }

    await this.ensureReady();
    const local = this.searchLocal(query, limit);
    const remote = await this.searchRemoteSubdistricts(query, limit);
    const merged = this.mergeSuggestions([...local, ...remote], limit);
    return { items: merged, source: remote.length ? 'lgd+local' : 'local' };
  }

  private async ensureReady(): Promise<void> {
    if (this.ready) return;
    if (!this.warmPromise) {
      this.warmPromise = this.warmCache().finally(() => {
        this.warmPromise = null;
      });
    }
    await this.warmPromise;
    if (!this.ready) {
      throw new ServiceUnavailableException(
        'India location catalog is temporarily unavailable',
      );
    }
  }

  private async warmCache(): Promise<void> {
    const [statesPayload, districtsPayload] = await Promise.all([
      this.fetchJson<{ data?: LgdState[] }>('/v1/states'),
      this.fetchJson<{ data?: LgdDistrict[] }>('/v1/districts'),
    ]);

    const states = (statesPayload.data ?? [])
      .filter((s) => s?.code && s?.name)
      .map((s) => ({ code: String(s.code), name: s.name.trim() }))
      .sort((a, b) => a.name.localeCompare(b.name));

    const stateByCode = new Map(states.map((s) => [s.code, s]));
    const districts = (districtsPayload.data ?? [])
      .filter((d) => d?.code && d?.name && d?.state_code)
      .map((d) => ({
        code: String(d.code),
        name: d.name.trim(),
        state_code: String(d.state_code),
      }))
      .filter((d) => stateByCode.has(d.state_code))
      .sort((a, b) => a.name.localeCompare(b.name));

    this.states = states;
    this.districts = districts;
    this.stateByCode = stateByCode;
    this.districtByCode = new Map(districts.map((d) => [d.code, d]));
    this.ready = states.length > 0 && districts.length > 0;
    this.logger.log(
      `LGD catalog ready: ${states.length} states, ${districts.length} districts`,
    );
  }

  private searchLocal(query: string, limit: number): LocationSuggestion[] {
    const out: LocationSuggestion[] = [];

    for (const state of this.states) {
      if (!this.matches(state.name, query)) continue;
      out.push(this.toStateSuggestion(state));
      if (out.length >= limit) return out;
    }

    for (const district of this.districts) {
      if (!this.matches(district.name, query)) continue;
      const state = this.stateByCode.get(district.state_code);
      if (!state) continue;
      out.push(this.toDistrictSuggestion(district, state));
      if (out.length >= limit) return out;
    }

    return out;
  }

  private async searchRemoteSubdistricts(
    query: string,
    limit: number,
  ): Promise<LocationSuggestion[]> {
    try {
      const payload = await this.fetchJson<{
        data?: {
          results?: {
            subdistricts?: LgdSearchHit[];
            districts?: LgdSearchHit[];
            states?: LgdSearchHit[];
          };
        };
      }>(`/v1/search?q=${encodeURIComponent(query)}`);

      const results = payload.data?.results;
      const hits: LocationSuggestion[] = [];

      for (const hit of results?.districts ?? []) {
        const state = this.stateByCode.get(String(hit.state_code));
        if (!state) continue;
        hits.push({
          id: `district:${hit.code}`,
          name: hit.name,
          label: `${hit.name}, ${state.name}`,
          level: 'district',
          stateCode: state.code,
          stateName: state.name,
          districtCode: String(hit.code),
          districtName: hit.name,
        });
      }

      for (const hit of results?.subdistricts ?? []) {
        const state = this.stateByCode.get(String(hit.state_code));
        const district = hit.district_code
          ? this.districtByCode.get(String(hit.district_code))
          : undefined;
        if (!state) continue;
        const districtName = district?.name;
        hits.push({
          id: `subdistrict:${hit.code}`,
          name: hit.name,
          label: districtName
            ? `${hit.name} - ${districtName}, ${state.name}`
            : `${hit.name}, ${state.name}`,
          level: 'subdistrict',
          stateCode: state.code,
          stateName: state.name,
          districtCode: district?.code,
          districtName,
        });
        if (hits.length >= limit) break;
      }

      return hits;
    } catch (err) {
      this.logger.warn(`LGD search fallback to local: ${String(err)}`);
      return [];
    }
  }

  private mergeSuggestions(
    items: LocationSuggestion[],
    limit: number,
  ): LocationSuggestion[] {
    const rank: Record<LocationSuggestion['level'], number> = {
      district: 0,
      subdistrict: 1,
      state: 2,
    };
    const seen = new Set<string>();
    return items
      .sort((a, b) => {
        const byLevel = rank[a.level] - rank[b.level];
        if (byLevel !== 0) return byLevel;
        return a.name.localeCompare(b.name);
      })
      .filter((item) => {
        const key = `${item.level}:${item.name.toLowerCase()}:${item.stateCode}:${item.districtCode ?? ''}`;
        if (seen.has(key)) return false;
        seen.add(key);
        return true;
      })
      .slice(0, limit);
  }

  private matches(name: string, query: string): boolean {
    return name.toLowerCase().includes(query);
  }

  private toStateSuggestion(state: LgdState): LocationSuggestion {
    return {
      id: `state:${state.code}`,
      name: state.name,
      label: state.name,
      level: 'state',
      stateCode: state.code,
      stateName: state.name,
    };
  }

  private toDistrictSuggestion(
    district: LgdDistrict,
    state: LgdState,
  ): LocationSuggestion {
    return {
      id: `district:${district.code}`,
      name: district.name,
      label: `${district.name}, ${state.name}`,
      level: 'district',
      stateCode: state.code,
      stateName: state.name,
      districtCode: district.code,
      districtName: district.name,
    };
  }

  private async fetchJson<T>(path: string): Promise<T> {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), 12_000);
    try {
      const res = await fetch(`${this.baseUrl}${path}`, {
        headers: {
          Accept: 'application/json',
          'User-Agent': 'x-cron-locations/1.0',
        },
        signal: controller.signal,
      });
      if (!res.ok) {
        throw new Error(`LGD ${path} → ${res.status}`);
      }
      return (await res.json()) as T;
    } finally {
      clearTimeout(timer);
    }
  }
}
