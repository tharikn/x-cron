import {
  Body,
  Controller,
  Delete,
  Get,
  Header,
  Param,
  Patch,
  Post,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { CurrentUser, Public, Roles } from '../auth/decorators';
import type { AuthUser } from '../auth/auth.types';
import { AuthThrottle } from '../security/decorators';
import { HideJobDto } from '../seeker/dto/seeker.dto';
import { SeekerService } from '../seeker/seeker.service';
import {
  CreateJobDto,
  PasteJobDto,
  UpdateJobDto,
} from './dto/create-job.dto';
import { JobAnalyticsQueryDto } from './dto/job-analytics-query.dto';
import { JobEventDto } from './dto/job-event.dto';
import { ListMyJobsDto } from './dto/list-my-jobs.dto';
import { ModerateJobDto, ReportJobDto } from './dto/moderation.dto';
import { SearchJobsDto } from './dto/search-jobs.dto';
import { JobsService } from './jobs.service';

@Controller('v1')
export class JobsController {
  constructor(
    private readonly jobsService: JobsService,
    private readonly seekerService: SeekerService,
  ) {}

  @Public()
  @Get('jobs')
  @Header('Cache-Control', 'public, max-age=30, stale-while-revalidate=60')
  search(@Query() query: SearchJobsDto, @CurrentUser() user?: AuthUser) {
    return this.jobsService.search(query, user);
  }

  /** Doc alias for GET /v1/jobs — must stay above jobs/:id. */
  @Public()
  @Get('jobs/search')
  @Header('Cache-Control', 'public, max-age=30, stale-while-revalidate=60')
  searchAlias(@Query() query: SearchJobsDto, @CurrentUser() user?: AuthUser) {
    return this.jobsService.search(query, user);
  }

  /** Doc alias for GET /v1/feed. */
  @Get('jobs/recommendations')
  recommendations(@CurrentUser() user: AuthUser) {
    return this.seekerService.feed(user);
  }

  @Public()
  @Get('jobs/meta/categories')
  @Header('Cache-Control', 'public, max-age=300, stale-while-revalidate=600')
  categories() {
    return this.jobsService.categories();
  }

  @Public()
  @Get('jobs/lookup')
  @Header('Cache-Control', 'public, max-age=60, stale-while-revalidate=120')
  lookup(@Query('slug') slug: string) {
    return this.jobsService.getBySlug(slug);
  }

  @Public()
  @Get('jobs/:id/related')
  @Header('Cache-Control', 'public, max-age=60, stale-while-revalidate=120')
  related(@Param('id') id: string) {
    return { items: this.jobsService.related(id) };
  }

  @Public()
  @AuthThrottle(10, 60_000)
  @Post('jobs/:id/report')
  report(
    @Param('id') id: string,
    @Body() dto: ReportJobDto,
    @CurrentUser() user?: AuthUser,
  ) {
    return this.jobsService.report(id, dto, user);
  }

  /** Doc alias for POST /v1/me/hidden-jobs/:jobId. */
  @Post('jobs/:jobId/not-relevant')
  notRelevant(
    @CurrentUser() user: AuthUser,
    @Param('jobId') jobId: string,
    @Body() dto?: HideJobDto,
  ) {
    return this.seekerService.hideJob(user, jobId, dto ?? {});
  }

  @Public()
  @Get('jobs/:id')
  @Header('Cache-Control', 'public, max-age=60, stale-while-revalidate=120')
  getById(@Param('id') id: string) {
    return this.jobsService.getById(id);
  }

  /** Listing impression for recruiter analytics (deduped once / viewer / day). */
  @Public()
  @AuthThrottle(60, 60_000)
  @Post('jobs/:id/events')
  recordJobEvent(
    @Param('id') id: string,
    @Body() dto: JobEventDto,
    @Req() req: Request,
  ) {
    const fallback =
      (typeof req.headers['x-tab-id'] === 'string' && req.headers['x-tab-id']) ||
      req.ip ||
      'anon';
    const viewerKey = (dto.viewerKey || fallback).slice(0, 128);
    return this.jobsService.recordJobView(id, viewerKey);
  }

  @Roles('employer', 'admin')
  @Get('employers/jobs')
  myJobs(@CurrentUser() user: AuthUser, @Query() query: ListMyJobsDto) {
    return this.jobsService.myJobs(user, query.page ?? 1, query.limit ?? 10);
  }

  @Roles('employer', 'admin')
  @Get('employers/jobs/:id/analytics')
  jobAnalytics(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Query() query: JobAnalyticsQueryDto,
  ) {
    return this.jobsService.jobAnalytics(user, id, query.days ?? 30);
  }

  @Roles('employer', 'admin')
  @Post('employers/jobs')
  createQuick(@CurrentUser() user: AuthUser, @Body() dto: CreateJobDto) {
    return this.jobsService.createQuick(user, dto);
  }

  @Roles('employer', 'admin')
  @Post('employers/jobs/paste')
  createFromPaste(@CurrentUser() user: AuthUser, @Body() dto: PasteJobDto) {
    return this.jobsService.createFromPaste(user, dto);
  }

  @Roles('employer', 'admin')
  @Patch('employers/jobs/:id')
  updateMyJob(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateJobDto,
  ) {
    return this.jobsService.updateMyJob(user, id, dto);
  }

  @Roles('employer', 'admin')
  @Post('employers/jobs/:id/activate')
  activateMyJob(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.jobsService.activateMyJob(user, id);
  }

  @Roles('employer', 'admin')
  @Post('employers/jobs/:id/deactivate')
  deactivateMyJob(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.jobsService.deactivateMyJob(user, id);
  }

  @Roles('employer', 'admin')
  @Post('employers/jobs/:id/hide')
  hideMyJob(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.jobsService.hideMyJob(user, id);
  }

  @Roles('employer', 'admin')
  @Delete('employers/jobs/:id')
  deleteMyJob(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.jobsService.deleteMyJob(user, id);
  }

  @Roles('employer', 'admin')
  @Post('employers/jobs/:id/renew')
  renewMyJob(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.jobsService.renewMyJob(user, id);
  }

  @Public()
  @Get('employers/:id/public')
  @Header('Cache-Control', 'public, max-age=60, stale-while-revalidate=120')
  publicEmployer(@Param('id') id: string) {
    return this.jobsService.publicEmployer(id);
  }

  @Roles('admin', 'moderator')
  @Get('admin/jobs')
  moderationQueue(@Query('status') status?: string) {
    return this.jobsService.moderationQueue(status || 'needs-review');
  }

  @Roles('admin', 'moderator')
  @Patch('admin/jobs/:id')
  updateForModeration(@Param('id') id: string, @Body() dto: UpdateJobDto) {
    return this.jobsService.updateForModeration(id, dto);
  }

  @Roles('admin', 'moderator')
  @Post('admin/jobs/:id/approve')
  approve(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: ModerateJobDto,
  ) {
    return this.jobsService.approve(id, { ...dto, actorId: user.id });
  }

  @Roles('admin', 'moderator')
  @Post('admin/jobs/:id/reject')
  reject(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: ModerateJobDto,
  ) {
    return this.jobsService.reject(id, { ...dto, actorId: user.id });
  }

  @Roles('admin', 'moderator')
  @Post('admin/jobs/:id/remove')
  remove(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: ModerateJobDto,
  ) {
    return this.jobsService.removeForModeration(id, {
      ...dto,
      actorId: user.id,
    });
  }
}
