import { Module } from '@nestjs/common';
import { IngestionModule } from '../ingestion/ingestion.module';
import { TelegramAdapter } from './adapters/telegram.adapter';
import { ChannelsController } from './channels.controller';
import { ChannelsScheduler } from './channels.scheduler';
import { ChannelsService } from './channels.service';
import { ChannelsStore } from './channels.store';

@Module({
  imports: [IngestionModule],
  controllers: [ChannelsController],
  providers: [
    ChannelsStore,
    TelegramAdapter,
    ChannelsService,
    ChannelsScheduler,
  ],
  exports: [ChannelsService],
})
export class ChannelsModule {}
