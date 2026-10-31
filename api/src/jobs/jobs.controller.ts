import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CurrentUser, Public, Roles } from '../auth/decorators';
import type { AuthUser } from '../auth/auth.types';
import { CreateJobDto, PasteJobDto } from './dto/create-job.dto';
import { ModerateJobDto, ReportJobDto } from './dto/moderation.dto';
import { SearchJobsDto } from './dto/search-jobs.dto';
import { JobsService } from './jobs.service';

@Controller('v1')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Public()
  @Get('jobs')
  search(@Query() query: SearchJobsDto) {
    return this.jobsService.search(query);
  }

  @Public()
  @Get('jobs/meta/categories')
  categories() {
    return this.jobsService.categories();
  }

  @Public()
  @Get('jobs/lookup')
  lookup(@Query('slug') slug: string) {
    return this.jobsService.getBySlug(slug);
  }

  @Public()
  @Get('jobs/:id/related')
  related(@Param('id') id: string) {
    return { items: this.jobsService.related(id) };
  }

  @Public()
  @Get('jobs/:id/contact')
  contact(@Param('id') id: string) {
    return this.jobsService.getContact(id);
  }

  @Public()
  @Post('jobs/:id/report')
  report(@Param('id') id: string, @Body() dto: ReportJobDto) {
    return this.jobsService.report(id, dto);
  }

  @Public()
  @Get('jobs/:id')
  getById(@Param('id') id: string) {
    return this.jobsService.getById(id);
  }

  @Roles('employer', 'admin')
  @Get('employers/jobs')
  myJobs(@CurrentUser() user: AuthUser) {
    return this.jobsService.myJobs(user);
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

  @Roles('admin')
  @Get('admin/jobs')
  moderationQueue(@Query('status') status?: string) {
    return this.jobsService.moderationQueue(status || 'needs-review');
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
