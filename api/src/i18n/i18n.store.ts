import { Injectable, OnModuleInit } from '@nestjs/common';
import { SEED_LANGUAGES } from './seed-i18n';
import type {
  LanguageRecord,
  LanguageWithStrings,
  UiStringCatalog,
} from './i18n.types';

/**
 * In-memory language + UI string catalog (PRD multilingual).
 * Prisma `Language` / `UiString` models are the durable shape; runtime still
 * defaults to memory like the rest of the MVP API.
 */
@Injectable()
export class I18nStore implements OnModuleInit {
  private languages: LanguageWithStrings[] = [];

  onModuleInit() {
    this.languages = SEED_LANGUAGES.map((lang) => ({
      ...lang,
      strings: { ...lang.strings },
    }));
  }

  listEnabled(): LanguageRecord[] {
    return this.languages
      .filter((l) => l.enabled)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map(({ strings: _strings, ...meta }) => meta);
  }

  listAllWithStrings(): LanguageWithStrings[] {
    return this.languages
      .filter((l) => l.enabled)
      .sort((a, b) => a.sortOrder - b.sortOrder)
      .map((l) => ({
        ...l,
        strings: { ...l.strings },
      }));
  }

  find(code: string): LanguageWithStrings | undefined {
    return this.languages.find((l) => l.code === code && l.enabled);
  }

  stringsFor(code: string): UiStringCatalog | undefined {
    return this.find(code)?.strings;
  }
}
