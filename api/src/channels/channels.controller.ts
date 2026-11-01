import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CurrentUser, Public, Roles } from '../auth/decorators';
import type { AuthUser } from '../auth/auth.types';
import { ChannelsService } from './channels.service';
import {
  CreateChannelSourceDto,
  ManualChannelMessageDto,
  PullNowDto,
  SkipMessagesDto,
  UpdateChannelSourceDto,
  UpdatePullScheduleDto,
} from './dto/channels.dto';

@Controller('v1/channels')
export class ChannelsController {
  constructor(private readonly channels: ChannelsService) {}

  @Roles('admin')
  @Get('workflow')
  workflow() {
    return this.channels.workflow();
  }

  @Roles('admin')
  @Get('status')
  status() {
    return this.channels.status();
  }

  @Roles('admin')
  @Get('sources')
  listSources() {
    return this.channels.listSources();
  }

  @Roles('admin')
  @Post('sources')
  createSource(@Body() dto: CreateChannelSourceDto) {
    return this.channels.createSource(dto);
  }

  @Roles('admin')
  @Patch('sources/:id')
  updateSource(@Param('id') id: string, @Body() dto: UpdateChannelSourceDto) {
    return this.channels.updateSource(id, dto);
  }

  @Roles('admin')
  @Get('messages')
  listMessages(
    @Query('status') status?: 'pending' | 'pulled' | 'skipped' | 'failed',
    @Query('sourceId') sourceId?: string,
  ) {
    return this.channels.listMessages(status, sourceId);
  }

  @Roles('admin')
  @Post('messages/manual')
  addManual(@Body() dto: ManualChannelMessageDto) {
    return this.channels.addManualMessage(dto);
  }

  @Roles('admin')
  @Post('messages/skip')
  skip(@Body() dto: SkipMessagesDto) {
    return this.channels.skipMessages(dto.messageIds);
  }

  @Roles('admin')
  @Post('pull')
  pullNow(@CurrentUser() user: AuthUser, @Body() dto: PullNowDto) {
    return this.channels.pullNow(user, 'manual', {
      sourceIds: dto.sourceIds,
      messageIds: dto.messageIds,
      maxMessages: dto.maxMessages,
    });
  }

  @Roles('admin')
  @Get('pulls')
  listPulls() {
    return this.channels.listPulls();
  }

  @Roles('admin')
  @Get('pulls/:id')
  getPull(@Param('id') id: string) {
    return this.channels.getPull(id);
  }

  @Roles('admin')
  @Get('schedule')
  getSchedule() {
    return this.channels.getSchedule();
  }

  @Roles('admin')
  @Put('schedule')
  updateSchedule(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdatePullScheduleDto,
  ) {
    return this.channels.updateSchedule(user, dto);
  }

  /** Free Telegram Bot API webhook (optional; default is long-poll). */
  @Public()
  @Post('telegram/webhook')
  telegramWebhook(
    @Body() body: Record<string, unknown>,
    @Headers('x-telegram-bot-api-secret-token') secret?: string,
  ) {
    return this.channels.handleTelegramWebhook(body, secret);
  }
}
