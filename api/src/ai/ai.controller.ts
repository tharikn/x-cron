import { Body, Controller, Get, Post } from '@nestjs/common';
import { Public, Roles } from '../auth/decorators';
import { AiService } from './ai.service';
import { EnrichJobDto } from './dto/enrich-job.dto';

@Controller('v1/ai')
export class AiController {
  constructor(private readonly ai: AiService) {}

  /** Whether job-content AI enrich is on (safe for clients to gate UI). */
  @Public()
  @Get('status')
  status() {
    return this.ai.status();
  }

  /**
   * Preview / chatbot-style cleanup for a single job paste.
   * Does not publish; employer/admin can apply the result before create/import.
   */
  @Roles('employer', 'admin')
  @Post('job-enrich')
  enrich(@Body() dto: EnrichJobDto) {
    return this.ai.enrichJob(dto);
  }
}
