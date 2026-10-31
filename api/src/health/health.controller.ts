import { Controller, Get } from '@nestjs/common';

@Controller('v1/health')
export class HealthController {
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
