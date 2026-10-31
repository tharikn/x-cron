import { Module } from '@nestjs/common';
import { SiteController } from './site.controller';
import { SiteService } from './site.service';
import { SiteStore } from './site.store';

@Module({
  controllers: [SiteController],
  providers: [SiteStore, SiteService],
  exports: [SiteService, SiteStore],
})
export class SiteModule {}
