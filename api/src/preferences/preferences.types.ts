/** Appearance preference — signed-in Settings → Theme. */
export type ThemePreference = 'system' | 'light' | 'dark' | 'warm';

export interface PreferenceRecord {
  locations: string[];
  jobTypes: string[];
  categories: string[];
  languages: string[];
  salaryMin: number | null;
  remotePreferred: boolean;
  interfaceLocale: string;
  sort: string;
  /** UI theme; default system (OS light/dark). Warm is explicit only. */
  theme: ThemePreference;
  updatedAt: string;
}

export type PreferenceInput = Partial<
  Omit<PreferenceRecord, 'updatedAt'>
> & {
  deviceId?: string;
};
