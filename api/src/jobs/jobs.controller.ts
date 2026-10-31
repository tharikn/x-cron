import { Body, Controller, Get, Param, Post, Query } from '@nestjs/common';
import { CreateJobDto, PasteJobDto } from './dto/create-job.dto';
import { SearchJobsDto } from './dto/search-jobs.dto';
import { JobsService } from './jobs.service';

@Controller('v1')
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Get('jobs')
  search(@Query() query: SearchJobsDto) {
    return this.jobsService.search(query);
  }

  @Get('jobs/meta/categories')
  categories() {
    return this.jobsService.categories();
  }

  @Get('jobs/lookup')
  lookup(@Query('slug') slug: string) {
    return this.jobsService.getBySlug(slug);
  }

  @Get('jobs/:id/related')
  related(@Param('id') id: string) {
    return { items: this.jobsService.related(id) };
  }

  @Get('jobs/:id/contact')
  contact(@Param('id') id: string) {
    return this.jobsService.getContact(id);
  }

  @Get('jobs/:id')
  getById(@Param('id') id: string) {
    return this.jobsService.getById(id);
  }

  @Post('employers/jobs')
  createQuick(@Body() dto: CreateJobDto) {
    return this.jobsService.createQuick(dto);
  }

  @Post('employers/jobs/paste')
  createFromPaste(@Body() dto: PasteJobDto) {
    return this.jobsService.createFromPaste(dto);
  }
}
