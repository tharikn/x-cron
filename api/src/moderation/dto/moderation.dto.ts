import {
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  IsArray,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import { IsSafeText } from '../../security/validation/decorators';
import {
  SanitizeOptionalText,
  SanitizeText,
} from '../../security/validation/sanitize';
import {
  MODERATION_QUEUES,
  REPORT_CATEGORIES,
  type ModerationDecision,
  type ModerationQueue,
  type ModerationTargetType,
  type ReportCategory,
} from '../moderation.types';

export class CreateReportDto {
  @IsIn(['job', 'employer', 'user', 'application'])
  targetType!: ModerationTargetType;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  targetId!: string;

  @IsIn([...REPORT_CATEGORIES])
  category!: ReportCategory;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(2000)
  @IsSafeText({ max: 2000 })
  details?: string;

  /** Alias for details — legacy job report clients. */
  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MinLength(5)
  @MaxLength(2000)
  reason?: string;
}

export class CreateAppealDto {
  @IsIn(['job', 'employer', 'user'])
  targetType!: ModerationTargetType;

  @IsString()
  @MinLength(8)
  @MaxLength(64)
  targetId!: string;

  @SanitizeText()
  @IsString()
  @MinLength(10)
  @MaxLength(2000)
  @IsSafeText({ max: 2000 })
  reason!: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  relatedCaseId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  feedbackThreadId?: string;
}

export class ListCasesQueryDto {
  @IsOptional()
  @IsIn([...MODERATION_QUEUES])
  queue?: ModerationQueue;

  @IsOptional()
  @IsIn(['open', 'in_review', 'resolved', 'dismissed'])
  status?: string;

  @IsOptional()
  @IsString()
  assigneeUserId?: string;
}

export class AssignCaseDto {
  @IsOptional()
  @IsString()
  @MaxLength(64)
  assigneeUserId?: string | null;
}

export class DecideCaseDto {
  @IsIn([
    'approve',
    'reject',
    'remove',
    'suspend_user',
    'reactivate_user',
    'verify_company',
    'reject_company',
    'suspend_company',
    'uphold',
    'reinstate',
    'dismiss',
    'override_risk',
  ])
  decision!: ModerationDecision;

  @SanitizeText()
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  @IsSafeText({ max: 500 })
  reason!: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(64)
  reasonCode?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  dismissRiskFlags?: string[];
}

export class SuspendUserDto {
  @SanitizeText()
  @IsString()
  @MinLength(3)
  @MaxLength(64)
  reasonCode!: string;

  @SanitizeText()
  @IsString()
  @MinLength(5)
  @MaxLength(500)
  @IsSafeText({ max: 500 })
  reason!: string;

  /** Omit for indefinite. */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(24 * 365)
  durationHours?: number;
}

export class ReactivateUserDto {
  @SanitizeText()
  @IsString()
  @MinLength(3)
  @MaxLength(500)
  @IsSafeText({ max: 500 })
  reason!: string;
}

export class SearchQueryDto {
  @SanitizeText()
  @IsString()
  @MinLength(2)
  @MaxLength(100)
  q!: string;
}

export class UpdateModerationConfigDto {
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(50)
  reportAutoQueueThreshold?: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  prohibitedPhrases?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  brandImpersonationKeywords?: string[];

  @IsOptional()
  @IsObject()
  defaultSlaHours?: Partial<Record<ModerationQueue, number>>;
}
