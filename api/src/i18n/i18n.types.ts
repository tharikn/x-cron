export interface LanguageRecord {
  code: string;
  name: string;
  nativeName: string;
  enabled: boolean;
  sortOrder: number;
}

export type UiStringCatalog = Record<string, string>;

export interface LanguageWithStrings extends LanguageRecord {
  strings: UiStringCatalog;
}
