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
} from '@nestjs/common';
import { CurrentUser, Public, Roles } from '../auth/decorators';
import type { AuthUser } from '../auth/auth.types';
import {
  CreateJobDto,
  PasteJobDto,
  UpdateJobDto,
} from './dto/create-job.dto';
import { ListMyJobsDto } from './dto/list-my-jobs.dto';
import { ModerateJobDto, ReportJobDto } from './dto/moderation.dto';
import { SearchJobsDto } from './dto/search-jobs.dto';
import { JobsService } from './jobs.service';

@Controller('v1')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Public()
  @Get('jobs')
  @Header('Cache-Control', 'public, max-age=30, stale-while-revalidate=60')
  search(@Query() query: SearchJobsDto) {
    return this.jobsService.search(query);
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
  @Post('jobs/:id/report')
  report(@Param('id') id: string, @Body() dto: ReportJobDto) {
    return this.jobsService.report(id, dto);
  }

  @Public()
  @Get('jobs/:id')
  @Header('Cache-Control', 'public, max-age=60, stale-while-revalidate=120')
  getById(@Param('id') id: string) {
    return this.jobsService.getById(id);
  }

  @Roles('admin')
  @Get('employers/jobs')
  myJobs(@CurrentUser() user: AuthUser, @Query() query: ListMyJobsDto) {
    return this.jobsService.myJobs(user, query.page ?? 1, query.limit ?? 10);
  }

  @Roles('admin')
  @Post('employers/jobs')
  createQuick(@CurrentUser() user: AuthUser, @Body() dto: CreateJobDto) {
    return this.jobsService.createQuick(user, dto);
  }

  @Roles('admin')
  @Post('employers/jobs/paste')
  createFromPaste(@CurrentUser() user: AuthUser, @Body() dto: PasteJobDto) {
    return this.jobsService.createFromPaste(user, dto);
  }

  @Roles('admin')
  @Patch('employers/jobs/:id')
  updateMyJob(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateJobDto,
  ) {
    return this.jobsService.updateMyJob(user, id, dto);
  }

  @Roles('admin')
  @Post('employers/jobs/:id/activate')
  activateMyJob(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.jobsService.activateMyJob(user, id);
  }

  @Roles('admin')
  @Post('employers/jobs/:id/deactivate')
  deactivateMyJob(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.jobsService.deactivateMyJob(user, id);
  }

  @Roles('admin')
  @Post('employers/jobs/:id/hide')
  hideMyJob(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.jobsService.hideMyJob(user, id);
  }

  @Roles('admin')
  @Delete('employers/jobs/:id')
  deleteMyJob(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.jobsService.deleteMyJob(user, id);
  }

  @Roles('admin')
  @Get('admin/jobs')
  moderationQueue(@Query('status') status?: string) {
    return this.jobsService.moderationQueue(status || 'needs-review');
  }

  @Roles('admin')
  @Patch('admin/jobs/:id')
  updateForModeration(@Param('id') id: string, @Body() dto: UpdateJobDto) {
    return this.jobsService.updateForModeration(id, dto);
  }

  @Roles('admin')
  @Post('admin/jobs/:id/approve')
  approve(@Param('id') id: string, @Body() dto: ModerateJobDto) {
    return this.jobsService.approve(id, dto);
  }

  @Roles('admin')
  @Post('admin/jobs/:id/reject')
  reject(@Param('id') id: string, @Body() dto: ModerateJobDto) {
    return this.jobsService.reject(id, dto);
  }
}
