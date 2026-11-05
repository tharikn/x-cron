import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Query,
} from '@nestjs/common';
import type { AuthUser } from '../auth/auth.types';
import { CurrentUser, Public, Roles } from '../auth/decorators';
import { AuthThrottle } from '../security/decorators';
import {
  CreateFeedbackThreadDto,
  FeedbackTypingDto,
  ListAdminFeedbackQueryDto,
  SendFeedbackMessageDto,
} from './dto/feedback.dto';
import { FeedbackService } from './feedback.service';

@Controller('v1')
export class FeedbackController {
  constructor(private readonly feedback: FeedbackService) {}

  /** Public FAQ catalog for the Feedback screen. */
  @Public()
  @Get('feedback/faq')
  listFaq() {
    return this.feedback.listFaq();
  }

  /** Seeker / recruiter: list my Contact Admin threads. */
  @Get('feedback/threads')
  listMyThreads(@CurrentUser() user: AuthUser) {
    return this.feedback.listMyThreads(user);
  }

  /** Seeker / recruiter: open a new Contact Admin thread. */
  @AuthThrottle()
  @Post('feedback/threads')
  createThread(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateFeedbackThreadDto,
  ) {
    return this.feedback.createThread(user, dto);
  }

  /** Seeker / recruiter: thread detail + messages + presence. */
  @Get('feedback/threads/:id')
  getMyThread(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.feedback.getMyThread(user, id);
  }

  /** Seeker / recruiter: typing heartbeat while composing. */
  @Post('feedback/threads/:id/typing')
  setMyTyping(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: FeedbackTypingDto,
  ) {
    return this.feedback.setMyTyping(user, id, dto.typing);
  }

  /** Seeker / recruiter: send a messenger reply. */
  @AuthThrottle()
  @Post('feedback/threads/:id/messages')
  sendMyMessage(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: SendFeedbackMessageDto,
  ) {
    return this.feedback.sendMyMessage(user, id, dto);
  }

  /** Seeker / recruiter: close own thread. */
  @Post('feedback/threads/:id/close')
  closeMyThread(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.feedback.closeMyThread(user, id);
  }

  /** Admin desk: all Contact Admin threads. */
  @Roles('admin')
  @Get('admin/feedback/threads')
  listAdminThreads(@Query() query: ListAdminFeedbackQueryDto) {
    return this.feedback.listAdminThreads({
      status: query.status ?? 'all',
      audience: query.audience,
    });
  }

  /** Admin desk: thread detail + presence. */
  @Roles('admin')
  @Get('admin/feedback/threads/:id')
  getAdminThread(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.feedback.getAdminThread(id, user);
  }

  /** Admin desk: typing heartbeat while composing. */
  @Roles('admin')
  @Post('admin/feedback/threads/:id/typing')
  setAdminTyping(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: FeedbackTypingDto,
  ) {
    return this.feedback.setAdminTyping(user, id, dto.typing);
  }

  /** Admin desk: reply in messenger. */
  @Roles('admin')
  @AuthThrottle()
  @Post('admin/feedback/threads/:id/messages')
  sendAdminMessage(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: SendFeedbackMessageDto,
  ) {
    return this.feedback.sendAdminMessage(user, id, dto);
  }

  /** Admin desk: close thread. */
  @Roles('admin')
  @Post('admin/feedback/threads/:id/close')
  closeAdminThread(@Param('id') id: string) {
    return this.feedback.closeAdminThread(id);
  }

  /** Admin desk: reopen thread. */
  @Roles('admin')
  @Post('admin/feedback/threads/:id/reopen')
  reopenAdminThread(@Param('id') id: string) {
    return this.feedback.reopenAdminThread(id);
  }
}
