export interface PreferenceRecord {
  locations: string[];
  jobTypes: string[];
  categories: string[];
  languages: string[];
  salaryMin: number | null;
  remotePreferred: boolean;
  interfaceLocale: 'en' | 'ta';
  sort: string;
  updatedAt: string;
}

export type PreferenceInput = Partial<
  Omit<PreferenceRecord, 'updatedAt'>
> & {
  deviceId?: string;
};
