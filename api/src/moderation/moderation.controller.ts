import {
  Body,
  Controller,
  Get,
  Headers,
  Param,
  Patch,
  Post,
  Put,
  Query,
} from '@nestjs/common';
import { CurrentUser, Public, Roles } from '../auth/decorators';
import type { AuthUser } from '../auth/auth.types';
import { AuthThrottle } from '../security/decorators';
import {
  AssignCaseDto,
  CreateAppealDto,
  CreateReportDto,
  DecideCaseDto,
  ListCasesQueryDto,
  ReactivateUserDto,
  SearchQueryDto,
  SuspendUserDto,
  UpdateModerationConfigDto,
} from './dto/moderation.dto';
import { ModerationService } from './moderation.service';

@Controller('v1')
export class ModerationController {
  constructor(private readonly moderation: ModerationService) {}

  @Roles('seeker', 'employer', 'admin', 'moderator')
  @AuthThrottle(20, 60_000)
  @Post('reports')
  createReport(@CurrentUser() user: AuthUser, @Body() dto: CreateReportDto) {
    return this.moderation.createReport(user, dto);
  }

  /** Guest report still allowed but rate-limited; reporter id omitted. */
  @Public()
  @AuthThrottle(10, 60_000)
  @Post('reports/public')
  createPublicReport(@Body() dto: CreateReportDto) {
    return this.moderation.createReport(undefined, dto);
  }

  @Roles('seeker', 'employer', 'admin', 'moderator')
  @AuthThrottle(10, 60_000)
  @Post('moderation/appeals')
  createAppeal(@CurrentUser() user: AuthUser, @Body() dto: CreateAppealDto) {
    return this.moderation.createAppeal(user, dto);
  }

  @Roles('moderator', 'admin')
  @Get('moderation/dashboard')
  dashboard(@CurrentUser() user: AuthUser) {
    return this.moderation.dashboard(user);
  }

  @Roles('moderator', 'admin')
  @Get('moderation/cases')
  listCases(@CurrentUser() user: AuthUser, @Query() query: ListCasesQueryDto) {
    return this.moderation.listCases(user, query);
  }

  @Roles('moderator', 'admin')
  @Get('moderation/cases/:id')
  getCase(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Headers('x-request-id') correlationId?: string,
  ) {
    return this.moderation.getCase(user, id, correlationId);
  }

  @Roles('moderator', 'admin')
  @Patch('moderation/cases/:id/assign')
  assign(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: AssignCaseDto,
  ) {
    return this.moderation.assignCase(user, id, dto.assigneeUserId);
  }

  @Roles('moderator', 'admin')
  @Post('moderation/cases/:id/decide')
  decide(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: DecideCaseDto,
  ) {
    return this.moderation.decideCase(user, id, dto);
  }

  @Roles('moderator', 'admin')
  @Post('moderation/users/:id/suspend')
  suspend(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: SuspendUserDto,
  ) {
    return this.moderation.suspendUser(user, id, dto);
  }

  @Roles('moderator', 'admin')
  @Post('moderation/users/:id/reactivate')
  reactivate(
    @CurrentUser() user: AuthUser,
    @Param('id') id: string,
    @Body() dto: ReactivateUserDto,
  ) {
    return this.moderation.reactivateUser(user, id, dto);
  }

  @Roles('moderator', 'admin')
  @Get('moderation/search')
  search(@CurrentUser() user: AuthUser, @Query() query: SearchQueryDto) {
    return this.moderation.search(user, query.q);
  }

  @Roles('moderator', 'admin')
  @Get('moderation/audit')
  audit(
    @CurrentUser() user: AuthUser,
    @Query('resourceType') resourceType?: string,
    @Query('resourceId') resourceId?: string,
  ) {
    return this.moderation.listAudit(user, resourceType, resourceId);
  }

  @Roles('admin')
  @Get('admin/moderation/config')
  getConfig() {
    return this.moderation.getConfig();
  }

  @Roles('admin')
  @Put('admin/moderation/config')
  putConfig(
    @CurrentUser() user: AuthUser,
    @Body() dto: UpdateModerationConfigDto,
  ) {
    return this.moderation.updateConfig(user, dto);
  }
}
