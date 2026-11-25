import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { PortfolioAiService } from './portfolio-ai.service';
import { PortfolioController } from './portfolio.controller';
import { PortfolioMemoryStore } from './portfolio.memory-store';
import { PortfolioService } from './portfolio.service';
import { PortfolioStore } from './portfolio.store';

/**
 * Dynamic Portfolios — self-contained module.
 *
 * Storage is in-memory for the MVP (matches the project default data store and
 * needs no database change). `PortfolioStore` is the repository port; a Prisma
 * implementation can be swapped in via `PORTFOLIO_STORE=prisma` once the
 * migration lands, without touching the service or clients.
 */
@Module({
  imports: [AiModule],
  controllers: [PortfolioController],
  providers: [
    {
      provide: PortfolioStore,
      useClass: PortfolioMemoryStore,
    },
    PortfolioService,
    PortfolioAiService,
  ],
  exports: [PortfolioService],
})
export class PortfolioModule {}
