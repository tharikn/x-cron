import { Controller, Delete, Get, Param, Post } from '@nestjs/common';
import { CurrentUser } from '../auth/decorators';
import type { AuthUser } from '../auth/auth.types';
import { SeekerService } from './seeker.service';

@Controller('v1')
export class SeekerController {
  constructor(private readonly seekerService: SeekerService) {}

  @Get('feed')
  feed(@CurrentUser() user: AuthUser) {
    return this.seekerService.feed(user);
  }

  @Get('me/saved-jobs')
  listSaved(@CurrentUser() user: AuthUser) {
    return this.seekerService.listSaved(user);
  }

  @Post('me/saved-jobs/:jobId')
  save(@CurrentUser() user: AuthUser, @Param('jobId') jobId: string) {
    return this.seekerService.save(user, jobId);
  }

  @Delete('me/saved-jobs/:jobId')
  unsave(@CurrentUser() user: AuthUser, @Param('jobId') jobId: string) {
    return this.seekerService.unsave(user, jobId);
  }
}
