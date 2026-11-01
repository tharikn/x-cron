import { Module } from '@nestjs/common';
import { JobsModule } from '../jobs/jobs.module';
import { PrismaService } from '../prisma/prisma.service';
import { SiteModule } from '../site/site.module';
import { PaymentsController } from './payments.controller';
import { PaymentsMemoryStore } from './payments.memory-store';
import { PaymentsPrismaStore } from './payments.prisma-store';
import { PaymentsService } from './payments.service';
import { PaymentsStore } from './payments.store';

function resolvePaymentsStoreMode(): 'prisma' | 'memory' {
  const dedicated = (process.env.PAYMENTS_STORE ?? '').trim().toLowerCase();
  if (dedicated === 'prisma' || dedicated === 'memory') return dedicated;
  return (process.env.JOBS_STORE ?? 'memory').toLowerCase() === 'prisma'
    ? 'prisma'
    : 'memory';
}

@Module({
  imports: [JobsModule, SiteModule],
  controllers: [PaymentsController],
  providers: [
    {
      provide: PaymentsStore,
      useFactory: (prisma: PrismaService) => {
        if (resolvePaymentsStoreMode() === 'prisma') {
          return new PaymentsPrismaStore(prisma);
        }
        return new PaymentsMemoryStore();
      },
      inject: [PrismaService],
    },
    PaymentsService,
  ],
  exports: [PaymentsService],
})
export class PaymentsModule {}
