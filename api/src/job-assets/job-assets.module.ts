import { Module } from '@nestjs/common';
import { StorageModule } from '../storage/storage.module';
import { JobAssetsController } from './job-assets.controller';
import { JobAssetMemoryStore } from './job-assets.memory-store';
import { JobAssetsService } from './job-assets.service';
import { JobAssetStore } from './job-assets.types';

@Module({
  imports: [StorageModule],
  controllers: [JobAssetsController],
  providers: [
    { provide: JobAssetStore, useClass: JobAssetMemoryStore },
    JobAssetsService,
  ],
  exports: [JobAssetsService],
})
export class JobAssetsModule {}
