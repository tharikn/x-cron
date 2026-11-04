import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { CurrentUser } from '../auth/decorators';
import type { AuthUser } from '../auth/auth.types';
import {
  CreateSavedSearchDto,
  HideJobDto,
  MarkApplicationDto,
  UpdateSavedSearchDto,
  UpsertSeekerProfileDto,
} from './dto/seeker.dto';
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

  @Get('me/profile')
  getProfile(@CurrentUser() user: AuthUser) {
    return this.seekerService.getProfile(user);
  }

  @Patch('me/profile')
  upsertProfile(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpsertSeekerProfileDto,
  ) {
    return this.seekerService.upsertProfile(user, dto);
  }

  @Get('me/applications')
  listApplications(@CurrentUser() user: AuthUser) {
    return this.seekerService.listApplications(user);
  }

  @Post('me/applications/:jobId')
  markApplication(
    @CurrentUser() user: AuthUser,
    @Param('jobId') jobId: string,
    @Body() dto: MarkApplicationDto,
  ) {
    return this.seekerService.markApplication(user, jobId, dto);
  }

  @Get('me/hidden-jobs')
  listHidden(@CurrentUser() user: AuthUser) {
    return this.seekerService.listHidden(user);
  }

  @Post('me/hidden-jobs/:jobId')
  hideJob(
    @CurrentUser() user: AuthUser,
    @Param('jobId') jobId: string,
    @Body() dto: HideJobDto,
  ) {
    return this.seekerService.hideJob(user, jobId, dto);
  }

  @Delete('me/hidden-jobs/:jobId')
  unhideJob(@CurrentUser() user: AuthUser, @Param('jobId') jobId: string) {
    return this.seekerService.unhideJob(user, jobId);
  }

  @Get('me/saved-searches')
  listSavedSearches(@CurrentUser() user: AuthUser) {
    return this.seekerService.listSavedSearches(user);
  }

  @Post('me/saved-searches')
  createSavedSearch(
    @CurrentUser() user: AuthUser,
    @Body() dto: CreateSavedSearchDto,
  ) {
    return this.seekerService.createSavedSearch(user, dto);
  }

  @Patch('me/saved-searches/:id')
  updateSavedSearch(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: UpdateSavedSearchDto,
  ) {
    return this.seekerService.updateSavedSearch(user, id, dto);
  }

  @Delete('me/saved-searches/:id')
  deleteSavedSearch(@CurrentUser() user: AuthUser, @Param('id') id: string) {
    return this.seekerService.deleteSavedSearch(user, id);
  }
}
