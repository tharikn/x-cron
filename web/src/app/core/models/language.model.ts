export interface AppLanguageOption {
  code: string;
  name: string;
  nativeName: string;
  enabled: boolean;
  sortOrder: number;
  strings?: Record<string, string>;
}

export interface I18nCatalogResponse {
  defaultLocale: string;
  items: AppLanguageOption[];
}
