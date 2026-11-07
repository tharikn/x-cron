import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  MaxLength,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import {
  IsSafeText,
  IsXcronSalaryText,
  IsXcronUrl,
} from '../../security/validation/decorators';
import {
  SanitizeOptionalText,
  SanitizeText,
} from '../../security/validation/sanitize';

export class CreateApiKeyDto {
  @IsSafeText({ max: 80 })
  @SanitizeText()
  label!: string;

  @IsOptional()
  @IsBoolean()
  autoPublish?: boolean;
}

export class CreateFeedDto {
  @IsSafeText({ max: 80 })
  @SanitizeText()
  label!: string;

  @IsUrl({ require_protocol: true, protocols: ['https'] })
  url!: string;

  @IsOptional()
  @IsIn(['xml', 'json', 'auto'])
  format?: 'xml' | 'json' | 'auto';

  @IsOptional()
  @IsBoolean()
  closeMissing?: boolean;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class UpdateFeedDto {
  @IsOptional()
  @IsSafeText({ max: 80 })
  @SanitizeOptionalText()
  label?: string;

  @IsOptional()
  @IsUrl({ require_protocol: true, protocols: ['https'] })
  url?: string;

  @IsOptional()
  @IsIn(['xml', 'json', 'auto'])
  format?: 'xml' | 'json' | 'auto';

  @IsOptional()
  @IsBoolean()
  closeMissing?: boolean;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class CreateWebhookDto {
  @IsSafeText({ max: 80 })
  @SanitizeText()
  label!: string;

  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  secret?: string;
}

export class PullSheetDto {
  /** Public Google Sheet CSV export URL (File → Share → Anyone + Publish / export?format=csv). */
  @IsUrl({ require_protocol: true, protocols: ['https'] })
  csvUrl!: string;

  @IsOptional()
  @IsSafeText({ max: 80 })
  @SanitizeOptionalText()
  label?: string;
}

export class PartnerJobDto {
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  externalJobId!: string;

  @IsSafeText({ max: 120 })
  @SanitizeText()
  title!: string;

  @IsOptional()
  @IsSafeText({ max: 120 })
  @SanitizeOptionalText()
  employerName?: string;

  @IsOptional()
  @IsSafeText({ max: 80 })
  @SanitizeOptionalText()
  locationCity?: string;

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
  @IsXcronSalaryText()
  salaryText?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100000)
  vacancies?: number;

  @IsSafeText({ max: 8000, allowNewlines: true })
  @SanitizeText({ allowNewlines: true })
  description!: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  contentLanguage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  contactPhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  contactEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  contactWhatsapp?: string;

  @IsOptional()
  @IsXcronUrl()
  contactWebsite?: string;
}

export class PartnerJobUpdateDto {
  @IsSafeText({ max: 120 })
  @SanitizeText()
  title!: string;

  @IsOptional()
  @IsSafeText({ max: 120 })
  @SanitizeOptionalText()
  employerName?: string;

  @IsOptional()
  @IsSafeText({ max: 80 })
  @SanitizeOptionalText()
  locationCity?: string;

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
  @IsXcronSalaryText()
  salaryText?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100000)
  vacancies?: number;

  @IsSafeText({ max: 8000, allowNewlines: true })
  @SanitizeText({ allowNewlines: true })
  description!: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
  contentLanguage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  contactPhone?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  contactEmail?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  contactWhatsapp?: string;

  @IsOptional()
  @IsXcronUrl()
  contactWebsite?: string;
}

export class PartnerJobBatchDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => PartnerJobDto)
  jobs!: PartnerJobDto[];
}

export class WebhookJobPayloadDto {
  @IsOptional()
  @IsArray()
  jobs?: Record<string, unknown>[];

  @IsOptional()
  @IsString()
  externalJobId?: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  description?: string;
}
