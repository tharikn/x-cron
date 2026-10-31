import { Module } from '@nestjs/common';
import { JobsController } from './jobs.controller';
import { JobsMemoryStore } from './jobs.memory-store';
import { JobsService } from './jobs.service';

@Module({
  controllers: [JobsController],
  providers: [JobsMemoryStore, JobsService],
  exports: [JobsService, JobsMemoryStore],
})
export class JobsModule {}

