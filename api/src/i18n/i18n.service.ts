import { Injectable, NotFoundException } from '@nestjs/common';
import { I18nStore } from './i18n.store';

@Injectable()
export class I18nService {
  constructor(private readonly store: I18nStore) {}

  listLanguages() {
    return { items: this.store.listEnabled() };
  }

  /** Full catalogs for clients that want instant locale switching. */
  catalogs() {
    return {
      defaultLocale: 'en',
      items: this.store.listAllWithStrings(),
    };
  }

  strings(locale: string) {
    const lang = this.store.find(locale);
    if (!lang) {
      throw new NotFoundException(`Language '${locale}' not found`);
    }
    return {
      code: lang.code,
      name: lang.name,
      nativeName: lang.nativeName,
      strings: lang.strings,
    };
  }
}
