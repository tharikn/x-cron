import { Module } from '@nestjs/common';
import { JobsModule } from '../jobs/jobs.module';
import { IngestionController } from './ingestion.controller';
import { IngestionService } from './ingestion.service';
import { IngestionStore } from './ingestion.store';
import { ParserRegistry } from './parsers/parser.registry';

@Module({
  imports: [JobsModule],
  controllers: [IngestionController],
  providers: [IngestionStore, ParserRegistry, IngestionService],
})
export class IngestionModule {}
