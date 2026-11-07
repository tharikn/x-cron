import {
  Body,
  Controller,
  DefaultValuePipe,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser, Roles } from '../auth/decorators';
import type { AuthUser } from '../auth/auth.types';
import { ApplyThrottle, AuthThrottle } from '../security/decorators';
import { ApplicationsService } from './applications.service';
import {
  AddApplicationNoteDto,
  ApplyJobDto,
  SendApplicationMessageDto,
  TransitionApplicationDto,
  WithdrawApplicationDto,
} from './dto/applications.dto';

@Controller('v1')
export class ApplicationsController {
  constructor(private readonly applications: ApplicationsService) {}

  /** Doc-shaped conversations inbox (applicationId = conversation id). */
  @Get('conversations')
  listConversations(@CurrentUser() user: AuthUser) {
    return this.applications.listConversations(user);
  }

  @Get('conversations/:id/messages')
  listConversationMessages(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Query('limit', new DefaultValuePipe(50), ParseIntPipe) limit: number,
    @Query('before') before?: string,
  ) {
    return this.applications.listMessages(user, id, { limit, before });
  }

  @AuthThrottle()
  @Post('conversations/:id/messages')
  sendConversationMessage(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: SendApplicationMessageDto,
  ) {
    return this.applications.sendMessage(user, id, dto);
  }

  @Post('conversations/:id/read')
  markConversationReadPost(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ) {
    return this.applications.markConversationRead(user, id);
  }

  @Patch('conversations/:id/read')
  markConversationReadPatch(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ) {
    return this.applications.markConversationRead(user, id);
  }

  /** Seeker: apply to a published job with an apply-profile version (no CV). */
  @ApplyThrottle()
  @Post('jobs/:jobId/apply')
  apply(
    @CurrentUser() user: AuthUser,
    @Param('jobId') jobId: string,
    @Body() dto: ApplyJobDto,
  ) {
    return this.applications.apply(user, jobId, dto);
  }

  /** Seeker: list my formal applications. */
  @Get('me/job-applications')
  listMine(@CurrentUser() user: AuthUser) {
    return this.applications.listMine(user);
  }

  /** Seeker: application detail + timeline + chat. */
  @Get('me/job-applications/:id')
  getMine(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.applications.getMine(user, id);
  }

  /** Seeker: withdraw. */
  @Post('me/job-applications/:id/withdraw')
  withdraw(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: WithdrawApplicationDto,
  ) {
    return this.applications.withdraw(user, id, dto);
  }

  /** Participant: list chat messages. */
  @Get('me/job-applications/:id/messages')
  listMyMessages(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Query('limit') limit?: string,
    @Query('before') before?: string,
  ) {
    const parsed = limit ? Number(limit) : undefined;
    return this.applications.listMessages(user, id, {
      limit: Number.isFinite(parsed) ? parsed : undefined,
      before,
    });
  }

  /** Participant: send chat message. */
  @AuthThrottle()
  @Post('me/job-applications/:id/messages')
  sendMyMessage(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: SendApplicationMessageDto,
  ) {
    return this.applications.sendMessage(user, id, dto);
  }

  @Post('me/job-applications/:id/messages/read')
  markMyMessagesRead(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.applications.markConversationRead(user, id);
  }

  /** Employer: all applications across owned jobs. */
  @Roles('employer', 'admin')
  @Get('employers/applications')
  listEmployer(@CurrentUser() user: AuthUser) {
    return this.applications.listForEmployer(user);
  }

  /** Employer: applicants for one job. */
  @Roles('employer', 'admin')
  @Get('employers/jobs/:jobId/applications')
  listForJob(@CurrentUser() user: AuthUser, @Param('jobId') jobId: string) {
    return this.applications.listForJob(user, jobId);
  }

  /** Employer: detail + timeline (records first view). */
  @Roles('employer', 'admin')
  @Get('employers/applications/:id')
  getEmployer(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.applications.getForEmployer(user, id);
  }

  /** Employer: status transition (review → offer letter → hired). */
  @Roles('employer', 'admin')
  @Post('employers/applications/:id/transition')
  transition(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: TransitionApplicationDto,
  ) {
    return this.applications.transition(user, id, dto);
  }

  /** Employer: timeline note (notifies seeker). */
  @Roles('employer', 'admin')
  @Post('employers/applications/:id/notes')
  addNote(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: AddApplicationNoteDto,
  ) {
    return this.applications.addNote(user, id, dto);
  }

  /** Employer participant: list chat. */
  @Roles('employer', 'admin')
  @Get('employers/applications/:id/messages')
  listEmployerMessages(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Query('limit') limit?: string,
    @Query('before') before?: string,
  ) {
    const parsed = limit ? Number(limit) : undefined;
    return this.applications.listMessages(user, id, {
      limit: Number.isFinite(parsed) ? parsed : undefined,
      before,
    });
  }

  /** Employer participant: send chat. */
  @Roles('employer', 'admin')
  @AuthThrottle()
  @Post('employers/applications/:id/messages')
  sendEmployerMessage(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: SendApplicationMessageDto,
  ) {
    return this.applications.sendMessage(user, id, dto);
  }

  @Roles('employer', 'admin')
  @Post('employers/applications/:id/messages/read')
  markEmployerMessagesRead(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
  ) {
    return this.applications.markConversationRead(user, id);
  }
}
