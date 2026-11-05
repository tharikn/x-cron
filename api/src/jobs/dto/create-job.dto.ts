import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsISO8601,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';
import {
  IsSafeText,
  IsXcronEmail,
  IsXcronPhone,
  IsXcronSalaryText,
  IsXcronUrl,
} from '../../security/validation/decorators';
import {
  SanitizeOptionalText,
  SanitizeText,
} from '../../security/validation/sanitize';

export class CreateJobDto {
  @SanitizeText()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  @IsSafeText({ max: 200 })
  title!: string;

  @SanitizeText()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  @IsSafeText({ max: 200 })
  employerName!: string;

  @SanitizeText()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  @IsSafeText({ max: 120 })
  locationCity!: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(120)
  @IsSafeText({ max: 120 })
  locationDistrict?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(120)
  @IsSafeText({ max: 120 })
  locationState?: string;

  @IsIn([
    'full-time',
    'part-time',
    'contract',
    'temporary',
    'internship',
    'apprenticeship',
    'daily-wage',
  ])
  jobType!:
    | 'full-time'
    | 'part-time'
    | 'contract'
    | 'temporary'
    | 'internship'
    | 'apprenticeship'
    | 'daily-wage';

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(120)
  @IsXcronSalaryText()
  salaryText?: string;

  @SanitizeText({ allowNewlines: true, stripHtml: false })
  @IsString()
  @MinLength(5)
  @MaxLength(20000)
  description!: string;

  @SanitizeText()
  @IsString()
  @MaxLength(16)
  contentLanguage!: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(32)
  @IsXcronPhone()
  contactPhone?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(160)
  @IsXcronEmail()
  contactEmail?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(500)
  @IsXcronUrl()
  contactWebsite?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(80)
  @IsSafeText({ max: 80 })
  category?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(80)
  @IsSafeText({ max: 80 })
  experienceLabel?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  vacancies?: number;

  @IsOptional()
  @IsString()
  workSchedule?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsISO8601()
  effectiveFrom?: string;

  @IsOptional()
  @IsISO8601()
  expiresAt?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1000)
  priority?: number;

  @IsOptional()
  @IsBoolean()
  remote?: boolean;

  @IsOptional()
  @IsISO8601()
  walkInAt?: string;

  @IsOptional()
  @IsISO8601()
  applyBy?: string;

  /** Optional intent question; seekers must answer when applying. */
  @IsOptional()
  @IsString()
  @MaxLength(280)
  screeningQuestion?: string;

  /**
   * Recruiter privilege: publish live immediately (skips Blog Approval queue).
   * Admin import / channel pulls still use needs-review without this flag.
   */
  @IsOptional()
  @IsBoolean()
  directPublish?: boolean;
}

export class UpdateJobDto {
  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  @IsSafeText({ max: 200 })
  title?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  @IsSafeText({ max: 200 })
  employerName?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MinLength(2)
  @MaxLength(120)
  @IsSafeText({ max: 120 })
  locationCity?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(120)
  @IsSafeText({ max: 120 })
  locationDistrict?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(120)
  @IsSafeText({ max: 120 })
  locationState?: string;

  @IsOptional()
  @IsIn([
    'full-time',
    'part-time',
    'contract',
    'temporary',
    'internship',
    'apprenticeship',
    'daily-wage',
  ])
  jobType?:
    | 'full-time'
    | 'part-time'
    | 'contract'
    | 'temporary'
    | 'internship'
    | 'apprenticeship'
    | 'daily-wage';

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(120)
  @IsXcronSalaryText()
  salaryText?: string;

  @IsOptional()
  @SanitizeOptionalText({ allowNewlines: true, stripHtml: false })
  @IsString()
  @MinLength(5)
  @MaxLength(20000)
  description?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(16)
  contentLanguage?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(32)
  @IsXcronPhone()
  contactPhone?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(160)
  @IsXcronEmail()
  contactEmail?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(500)
  @IsXcronUrl()
  contactWebsite?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(80)
  @IsSafeText({ max: 80 })
  category?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(80)
  @IsSafeText({ max: 80 })
  experienceLabel?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  vacancies?: number;

  @IsOptional()
  @IsString()
  workSchedule?: string;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  skills?: string[];

  @IsOptional()
  @IsISO8601()
  effectiveFrom?: string;

  @IsOptional()
  @IsISO8601()
  expiresAt?: string;

  @IsOptional()
  @IsNumber()
  @Min(0)
  @Max(1000)
  priority?: number;

  @IsOptional()
  @IsIn(['published', 'draft', 'expired', 'needs-review', 'rejected', 'removed'])
  status?:
    | 'published'
    | 'draft'
    | 'expired'
    | 'needs-review'
    | 'rejected'
    | 'removed';

  @IsOptional()
  @IsBoolean()
  remote?: boolean;

  @IsOptional()
  @IsISO8601()
  walkInAt?: string;

  @IsOptional()
  @IsISO8601()
  applyBy?: string;

  /** Empty string clears the question. */
  @IsOptional()
  @IsString()
  @MaxLength(280)
  screeningQuestion?: string;
}

export class PasteJobDto {
  @IsString()
  @MinLength(10)
  text!: string;

  @IsOptional()
  @IsString()
  contentLanguage?: string;

  /** Recruiter privilege: publish live immediately (skips Blog Approval). */
  @IsOptional()
  @IsBoolean()
  directPublish?: boolean;
}
