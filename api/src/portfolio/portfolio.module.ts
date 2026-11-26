import { Module } from '@nestjs/common';
import { AiModule } from '../ai/ai.module';
import { PrismaService } from '../prisma/prisma.service';
import { StorageModule } from '../storage/storage.module';
import { PortfolioAiService } from './portfolio-ai.service';
import { PortfolioController } from './portfolio.controller';
import { PortfolioMemoryStore } from './portfolio.memory-store';
import { PortfolioPrismaStore } from './portfolio.prisma-store';
import { PortfolioService } from './portfolio.service';
import { PortfolioStore } from './portfolio.store';

/**
 * Dynamic Portfolios — self-contained module.
 *
 * Configurable repository port: `PortfolioStore` is backed by `PortfolioPrismaStore`
 * when `PORTFOLIO_STORE=prisma`, or `PortfolioMemoryStore` by default.
 */
@Module({
  imports: [AiModule, StorageModule],
  controllers: [PortfolioController],
  providers: [
    PortfolioMemoryStore,
    PortfolioPrismaStore,
    {
      provide: PortfolioStore,
      useFactory: (prisma: PrismaService, mem: PortfolioMemoryStore) => {
        return process.env.PORTFOLIO_STORE === 'prisma'
          ? new PortfolioPrismaStore(prisma)
          : mem;
      },
      inject: [PrismaService, PortfolioMemoryStore],
    },
    PortfolioService,
    PortfolioAiService,
  ],
  exports: [PortfolioService],
})
export class PortfolioModule {}
