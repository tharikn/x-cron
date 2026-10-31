import { Controller, Get, Param } from '@nestjs/common';
import { Public } from '../auth/decorators';
import { I18nService } from './i18n.service';

@Controller('v1')
export class I18nController {
  constructor(private readonly i18n: I18nService) {}

  /** Dropdown catalog — language metadata from DB/store. */
  @Public()
  @Get('languages')
  listLanguages() {
    return this.i18n.listLanguages();
  }

  /** All enabled locales + UI strings (instant client switch). */
  @Public()
  @Get('i18n')
  catalogs() {
    return this.i18n.catalogs();
  }

  @Public()
  @Get('i18n/:locale')
  strings(@Param('locale') locale: string) {
    return this.i18n.strings(locale);
  }
}
