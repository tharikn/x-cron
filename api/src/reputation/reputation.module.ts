import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { ReputationController } from './reputation.controller';
import { ReputationMemoryStore } from './reputation.memory-store';
import { ReputationPrismaStore } from './reputation.prisma-store';
import { ReputationService } from './reputation.service';
import { ReputationStore } from './reputation.store';

function resolveReputationStoreMode(): 'prisma' | 'memory' {
  const dedicated = (process.env.REPUTATION_STORE ?? '')
    .trim()
    .toLowerCase();
  if (dedicated === 'prisma' || dedicated === 'memory') return dedicated;
  return (process.env.JOBS_STORE ?? 'memory').toLowerCase() === 'prisma'
    ? 'prisma'
    : 'memory';
}

@Module({
  controllers: [ReputationController],
  providers: [
    {
      provide: ReputationStore,
      useFactory: (prisma: PrismaService) => {
        if (resolveReputationStoreMode() === 'prisma') {
          return new ReputationPrismaStore(prisma);
        }
        return new ReputationMemoryStore();
      },
      inject: [PrismaService],
    },
    ReputationService,
  ],
  exports: [ReputationService],
})
export class ReputationModule {}
