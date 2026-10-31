import { Module } from '@nestjs/common';
import { I18nController } from './i18n.controller';
import { I18nService } from './i18n.service';
import { I18nStore } from './i18n.store';

@Module({
  controllers: [I18nController],
  providers: [I18nStore, I18nService],
  exports: [I18nService, I18nStore],
})
export class I18nModule {}
