import { Injectable } from '@nestjs/common';

export interface PreferencePayload {
  deviceId: string;
  locations?: string[];
  jobTypes?: string[];
  categories?: string[];
  languages?: string[];
  salaryMin?: number | null;
  remotePreferred?: boolean;
  interfaceLocale?: 'en' | 'ta';
  sort?: string;
}

@Injectable()
export class PreferencesService {
  private readonly byDevice = new Map<string, PreferencePayload>();

  save(payload: PreferencePayload) {
    const existing = this.byDevice.get(payload.deviceId) ?? {
      deviceId: payload.deviceId,
      locations: [],
      jobTypes: [],
      categories: [],
      languages: ['en', 'ta'],
      salaryMin: null,
      remotePreferred: false,
      interfaceLocale: 'en' as const,
      sort: 'newest',
    };
    const next = { ...existing, ...payload };
    this.byDevice.set(payload.deviceId, next);
    return next;
  }

  get(deviceId: string) {
    return (
      this.byDevice.get(deviceId) ?? {
        deviceId,
        locations: [],
        jobTypes: [],
        categories: [],
        languages: ['en', 'ta'],
        salaryMin: null,
        remotePreferred: false,
        interfaceLocale: 'en',
        sort: 'newest',
      }
    );
  }
}
