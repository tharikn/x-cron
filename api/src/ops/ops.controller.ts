import { Controller, Get } from '@nestjs/common';
import { Roles } from '../auth/decorators';
import { OpsService } from './ops.service';

@Controller('v1/ops')
export class OpsController {
  constructor(private readonly opsService: OpsService) {}

  @Roles('admin')
  @Get('cost-model')
  costModel() {
    return this.opsService.costModel();
  }

  @Roles('admin')
  @Get('metrics')
  metrics() {
    return this.opsService.metrics();
  }

  @Roles('admin')
  @Get('quotas')
  quotas() {
    return this.opsService.quotas();
  }

  @Roles('admin')
  @Get('scale')
  scale() {
    return this.opsService.scaleHints();
  }
}
