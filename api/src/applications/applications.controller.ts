import { Body, Controller, Get, Param, Post } from '@nestjs/common';
import { CurrentUser, Roles } from '../auth/decorators';
import type { AuthUser } from '../auth/auth.types';
import { ApplyThrottle } from '../security/decorators';
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
  listMyMessages(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.applications.listMessages(user, id);
  }

  /** Participant: send chat message. */
  @Post('me/job-applications/:id/messages')
  sendMyMessage(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: SendApplicationMessageDto,
  ) {
    return this.applications.sendMessage(user, id, dto);
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
  ) {
    return this.applications.listMessages(user, id);
  }

  /** Employer participant: send chat. */
  @Roles('employer', 'admin')
  @Post('employers/applications/:id/messages')
  sendEmployerMessage(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: SendApplicationMessageDto,
  ) {
    return this.applications.sendMessage(user, id, dto);
  }
}
