import { Body, Controller, Get, Post, Query, Req } from '@nestjs/common';
import type { Request } from 'express';
import { CurrentUser, Public, Roles } from '../auth/decorators';
import type { AuthUser } from '../auth/auth.types';
import { AuthThrottle } from '../security/decorators';
import {
  extractClientIp,
  extractTabId,
  extractUserAgent,
} from '../security/token.util';
import { TrackEventDto, TrackingUsersQueryDto } from './dto/tracking.dto';
import { TrackingService } from './tracking.service';

@Controller('v1')
export class TrackingController {
  constructor(private readonly tracking: TrackingService) {}

  /** Client product analytics (guests OK; signed-in attaches userId). */
  @Public()
  @AuthThrottle(60, 60_000)
  @Post('tracking/events')
  record(
    @Body() dto: TrackEventDto,
    @Req() req: Request,
    @CurrentUser() user?: AuthUser,
  ) {
    return this.tracking.recordClientEvent(dto, {
      user: user ?? null,
      ip: extractClientIp(req),
      userAgent: extractUserAgent(req),
      visitorKey: extractTabId(req),
    });
  }

  @Roles('admin')
  @Get('admin/tracking/summary')
  summary(@Query() query: TrackingUsersQueryDto) {
    return this.tracking.summary({ from: query.from, to: query.to });
  }

  @Roles('admin')
  @Get('admin/tracking/users')
  users(@Query() query: TrackingUsersQueryDto) {
    return this.tracking.listUsers(query);
  }
}
