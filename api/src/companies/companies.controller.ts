import {
  Body,
  Controller,
  Get,
  Param,
  Patch,
  Post,
  Query,
} from '@nestjs/common';
import { CurrentUser, Roles } from '../auth/decorators';
import type { AuthUser } from '../auth/auth.types';
import { CompaniesService } from './companies.service';
import {
  AdminVerificationDecisionDto,
  CreateCompanyDto,
  CreateInternalNoteDto,
  CreateInterviewDto,
  CreateInvitationDto,
  PatchCompanyDto,
  PatchInterviewDto,
  PatchMemberDto,
  SubmitVerificationDto,
  TransferOwnershipDto,
} from './dto/companies.dto';

@Controller('v1/companies')
export class CompaniesController {
  constructor(private readonly companies: CompaniesService) {}

  @Roles('seeker', 'employer', 'admin')
  @Post()
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateCompanyDto) {
    return this.companies.create(user, dto);
  }

  @Roles('employer', 'admin')
  @Get(':companyId')
  get(@CurrentUser() user: AuthUser, @Param('companyId') companyId: string) {
    return this.companies.get(user, companyId);
  }

  @Roles('employer', 'admin')
  @Patch(':companyId')
  patch(
    @CurrentUser() user: AuthUser,
    @Param('companyId') companyId: string,
    @Body() dto: PatchCompanyDto,
  ) {
    return this.companies.patch(user, companyId, dto);
  }

  @Roles('employer', 'admin')
  @Post(':companyId/verification')
  submitVerification(
    @CurrentUser() user: AuthUser,
    @Param('companyId') companyId: string,
    @Body() dto: SubmitVerificationDto,
  ) {
    return this.companies.submitVerification(user, companyId, dto);
  }

  @Roles('employer', 'admin')
  @Get(':companyId/verification/evidence')
  listEvidence(
    @CurrentUser() user: AuthUser,
    @Param('companyId') companyId: string,
  ) {
    return this.companies.listEvidence(user, companyId);
  }

  @Roles('employer', 'admin')
  @Post(':companyId/invitations')
  invite(
    @CurrentUser() user: AuthUser,
    @Param('companyId') companyId: string,
    @Body() dto: CreateInvitationDto,
  ) {
    return this.companies.invite(user, companyId, dto);
  }

  @Roles('employer', 'admin')
  @Get(':companyId/members')
  listMembers(
    @CurrentUser() user: AuthUser,
    @Param('companyId') companyId: string,
  ) {
    return this.companies.listMembers(user, companyId);
  }

  @Roles('employer', 'admin')
  @Patch(':companyId/members/:memberId')
  patchMember(
    @CurrentUser() user: AuthUser,
    @Param('companyId') companyId: string,
    @Param('memberId') memberId: string,
    @Body() dto: PatchMemberDto,
  ) {
    return this.companies.patchMember(user, companyId, memberId, dto);
  }

  @Roles('employer', 'admin')
  @Post(':companyId/transfer-ownership')
  transferOwnership(
    @CurrentUser() user: AuthUser,
    @Param('companyId') companyId: string,
    @Body() dto: TransferOwnershipDto,
  ) {
    return this.companies.transferOwnership(user, companyId, dto);
  }

  @Roles('employer', 'admin')
  @Post(':companyId/internal-notes')
  addNote(
    @CurrentUser() user: AuthUser,
    @Param('companyId') companyId: string,
    @Body() dto: CreateInternalNoteDto,
  ) {
    return this.companies.addInternalNote(user, companyId, dto);
  }

  @Roles('employer', 'admin')
  @Get(':companyId/internal-notes')
  listNotes(
    @CurrentUser() user: AuthUser,
    @Param('companyId') companyId: string,
    @Query('applicationId') applicationId?: string,
  ) {
    return this.companies.listInternalNotes(user, companyId, applicationId);
  }

  @Roles('employer', 'admin')
  @Post(':companyId/interviews')
  scheduleInterview(
    @CurrentUser() user: AuthUser,
    @Param('companyId') companyId: string,
    @Body() dto: CreateInterviewDto,
  ) {
    return this.companies.scheduleInterview(user, companyId, dto);
  }

  @Roles('employer', 'admin')
  @Get(':companyId/interviews')
  listInterviews(
    @CurrentUser() user: AuthUser,
    @Param('companyId') companyId: string,
    @Query('applicationId') applicationId?: string,
  ) {
    return this.companies.listInterviews(user, companyId, applicationId);
  }

  @Roles('employer', 'admin')
  @Patch(':companyId/interviews/:interviewId')
  patchInterview(
    @CurrentUser() user: AuthUser,
    @Param('companyId') companyId: string,
    @Param('interviewId') interviewId: string,
    @Body() dto: PatchInterviewDto,
  ) {
    return this.companies.patchInterview(user, companyId, interviewId, dto);
  }
}

@Controller('v1/company-invitations')
export class CompanyInvitationsController {
  constructor(private readonly companies: CompaniesService) {}

  @Roles('seeker', 'employer', 'admin')
  @Post(':token/accept')
  accept(@CurrentUser() user: AuthUser, @Param('token') token: string) {
    return this.companies.acceptInvitation(user, token);
  }
}

@Controller('v1/recruiter')
export class RecruiterController {
  constructor(private readonly companies: CompaniesService) {}

  @Roles('employer', 'admin')
  @Get('dashboard')
  dashboard(@CurrentUser() user: AuthUser) {
    return this.companies.dashboard(user);
  }
}

@Controller('v1/admin/companies')
export class AdminCompaniesController {
  constructor(private readonly companies: CompaniesService) {}

  @Roles('admin', 'moderator')
  @Post(':companyId/verification/decision')
  decide(
    @CurrentUser() user: AuthUser,
    @Param('companyId') companyId: string,
    @Body() dto: AdminVerificationDecisionDto,
  ) {
    return this.companies.adminDecideVerification(user, companyId, dto);
  }
}
