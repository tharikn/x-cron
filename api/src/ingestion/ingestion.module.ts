import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { JobsModule } from '../jobs/jobs.module';
import { PrismaService } from '../prisma/prisma.service';
import { IngestionController } from './ingestion.controller';
import { IngestionMemoryStore } from './ingestion.memory-store';
import { IngestionPrismaStore } from './ingestion.prisma-store';
import { IngestionService } from './ingestion.service';
import { IngestionStore } from './ingestion.store';
import { ParserRegistry } from './parsers/parser.registry';

@Module({
  imports: [JobsModule, AiModule],
  controllers: [IngestionController],
  providers: [
    {
      provide: IngestionStore,
      useFactory: (prisma: PrismaService) => {
        if ((process.env.JOBS_STORE ?? 'memory') === 'prisma') {
          return new IngestionPrismaStore(prisma);
        }
        return new IngestionMemoryStore();
      },
      inject: [PrismaService],
    },
    ParserRegistry,
    IngestionService,
  ],
  exports: [IngestionService],
})
export class IngestionModule {}
