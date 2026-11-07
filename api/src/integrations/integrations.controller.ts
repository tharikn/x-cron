import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser, Roles } from '../auth/decorators';
import type { AuthUser } from '../auth/auth.types';
import { AuthThrottle } from '../security/decorators';
import {
  CreateApiKeyDto,
  CreateFeedDto,
  CreateWebhookDto,
  PullSheetDto,
  UpdateFeedDto,
} from './dto/integrations.dto';
import { IntegrationsService } from './integrations.service';

/** Recruiter self-serve: API keys, XML/JSON feeds, Zapier webhooks, Sheet pull. */
@Controller('v1/integrations')
export class IntegrationsController {
  constructor(private readonly integrations: IntegrationsService) {}

  @Roles('employer', 'admin')
  @Post('api-keys')
  @AuthThrottle()
  createKey(@CurrentUser() user: AuthUser, @Body() dto: CreateApiKeyDto) {
    return this.integrations.createApiKey(user, dto);
  }

  @Roles('employer', 'admin')
  @Get('api-keys')
  listKeys(@CurrentUser() user: AuthUser) {
    return this.integrations.listApiKeys(user);
  }

  @Roles('employer', 'admin')
  @Delete('api-keys/:id')
  revokeKey(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.integrations.revokeApiKey(user, id);
  }

  @Roles('employer', 'admin')
  @Post('feeds')
  createFeed(@CurrentUser() user: AuthUser, @Body() dto: CreateFeedDto) {
    return this.integrations.createFeed(user, dto);
  }

  @Roles('employer', 'admin')
  @Get('feeds')
  listFeeds(@CurrentUser() user: AuthUser) {
    return this.integrations.listFeeds(user);
  }

  @Roles('employer', 'admin')
  @Patch('feeds/:id')
  updateFeed(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateFeedDto,
  ) {
    return this.integrations.updateFeed(user, id, dto);
  }

  @Roles('employer', 'admin')
  @Post('feeds/:id/pull')
  @AuthThrottle()
  pullFeed(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.integrations.pullFeed(user, id);
  }

  @Roles('employer', 'admin')
  @Post('webhooks')
  createWebhook(@CurrentUser() user: AuthUser, @Body() dto: CreateWebhookDto) {
    return this.integrations.createWebhook(user, dto);
  }

  @Roles('employer', 'admin')
  @Get('webhooks')
  listWebhooks(@CurrentUser() user: AuthUser) {
    return this.integrations.listWebhooks(user);
  }

  @Roles('employer', 'admin')
  @Delete('webhooks/:id')
  revokeWebhook(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.integrations.revokeWebhook(user, id);
  }

  @Roles('employer', 'admin')
  @Post('sheets/pull')
  @AuthThrottle()
  pullSheet(@CurrentUser() user: AuthUser, @Body() dto: PullSheetDto) {
    return this.integrations.pullSheet(user, dto);
  }
}
