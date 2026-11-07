import {
  Body,
  Controller,
  Delete,
  Get,
  Headers,
  Param,
  Post,
  Put,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { Public } from '../auth/decorators';
import { AuthThrottle } from '../security/decorators';
import {
  PartnerJobBatchDto,
  PartnerJobDto,
  PartnerJobUpdateDto,
} from './dto/integrations.dto';
import { IntegrationsService } from './integrations.service';

/**
 * Machine-to-machine Partner Job API (free).
 * Auth: `X-Api-Key: xcron_pk_…` or `Authorization: Bearer xcron_pk_…`
 * Routes are @Public so session cookies are not required; key is checked in-service.
 */
@Controller('v1/partner')
export class PartnerController {
  constructor(private readonly integrations: IntegrationsService) {}

  @Public()
  @Post('jobs')
  @AuthThrottle()
  upsert(
    @Req() req: Request,
    @Headers('x-api-key') apiKeyHeader: string | undefined,
    @Body() dto: PartnerJobDto,
  ) {
    const key = this.integrations.resolvePartnerKey(
      extractPartnerKey(req, apiKeyHeader),
    );
    return this.integrations.partnerUpsert(key, dto);
  }

  @Public()
  @Put('jobs/:externalJobId')
  @AuthThrottle()
  update(
    @Req() req: Request,
    @Headers('x-api-key') apiKeyHeader: string | undefined,
    @Param('externalJobId') externalJobId: string,
    @Body() dto: PartnerJobUpdateDto,
  ) {
    const key = this.integrations.resolvePartnerKey(
      extractPartnerKey(req, apiKeyHeader),
    );
    return this.integrations.partnerUpsert(key, {
      ...dto,
      externalJobId,
    });
  }

  @Public()
  @Post('jobs/batch')
  @AuthThrottle()
  batch(
    @Req() req: Request,
    @Headers('x-api-key') apiKeyHeader: string | undefined,
    @Body() dto: PartnerJobBatchDto,
  ) {
    const key = this.integrations.resolvePartnerKey(
      extractPartnerKey(req, apiKeyHeader),
    );
    return this.integrations.partnerBatch(key, dto.jobs);
  }

  @Public()
  @Delete('jobs/:externalJobId')
  @AuthThrottle()
  close(
    @Req() req: Request,
    @Headers('x-api-key') apiKeyHeader: string | undefined,
    @Param('externalJobId') externalJobId: string,
  ) {
    const key = this.integrations.resolvePartnerKey(
      extractPartnerKey(req, apiKeyHeader),
    );
    return this.integrations.partnerClose(key, externalJobId);
  }

  @Public()
  @Get('jobs')
  list(
    @Req() req: Request,
    @Headers('x-api-key') apiKeyHeader: string | undefined,
  ) {
    const key = this.integrations.resolvePartnerKey(
      extractPartnerKey(req, apiKeyHeader),
    );
    return this.integrations.partnerList(key);
  }
}

function extractPartnerKey(
  req: Request,
  apiKeyHeader?: string,
): string | undefined {
  if (apiKeyHeader?.trim()) return apiKeyHeader.trim();
  const auth = req.headers.authorization;
  if (typeof auth === 'string' && auth.toLowerCase().startsWith('bearer ')) {
    const token = auth.slice(7).trim();
    if (token.startsWith('xcron_pk_')) return token;
  }
  return undefined;
}
