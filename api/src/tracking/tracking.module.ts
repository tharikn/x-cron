import { Module } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { TrackingController } from './tracking.controller';
import { TrackingMemoryStore } from './tracking.memory-store';
import { TrackingPrismaStore } from './tracking.prisma-store';
import { TrackingService } from './tracking.service';
import { TrackingStore } from './tracking.store';

function resolveTrackingStoreMode(): 'prisma' | 'memory' {
  const dedicated = (process.env.TRACKING_STORE ?? '').trim().toLowerCase();
  if (dedicated === 'prisma' || dedicated === 'memory') return dedicated;
  return (process.env.JOBS_STORE ?? 'memory').toLowerCase() === 'prisma'
    ? 'prisma'
    : 'memory';
}

@Module({
  controllers: [TrackingController],
  providers: [
    {
      provide: TrackingStore,
      useFactory: (prisma: PrismaService) => {
        if (resolveTrackingStoreMode() === 'prisma') {
          return new TrackingPrismaStore(prisma);
        }
        return new TrackingMemoryStore();
      },
      inject: [PrismaService],
    },
    TrackingService,
  ],
  exports: [TrackingService],
})
export class TrackingModule {}
