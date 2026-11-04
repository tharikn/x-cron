import { Controller, Get } from '@nestjs/common';
import { Public } from '../auth/decorators';
import { NoThrottle } from '../security/decorators';

@Controller('v1/health')
export class HealthController {
  @Public()
  @NoThrottle()
  @Get()
  check() {
    return {
      status: 'ok',
      product: 'X Cron Jobs',
      store: process.env.JOBS_STORE ?? 'memory',
      time: new Date().toISOString(),
    };
  }
}
