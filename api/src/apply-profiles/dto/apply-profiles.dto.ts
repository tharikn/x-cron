import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsBoolean,
  IsIn,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateNested,
} from 'class-validator';
import { IsSafeText } from '../../security/validation/decorators';
import {
  SanitizeOptionalText,
  SanitizeText,
} from '../../security/validation/sanitize';
import { APPLY_PROFILE_LIMITS } from '../apply-profiles.types';

const BANDS = ['fresher', '0-1', '1-3', '3-5', '5+'] as const;

export class ApplyProfileProjectDto {
  @SanitizeText()
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  @IsSafeText({ max: 120 })
  title!: string;

  @IsOptional()
  @SanitizeOptionalText({ allowNewlines: true, stripHtml: false })
  @IsString()
  @MaxLength(2000)
  description?: string;

  @IsOptional()
  @IsUrl({ require_tld: false })
  @MaxLength(500)
  url?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(APPLY_PROFILE_LIMITS.maxTechPerProject)
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  tech?: string[];
}

export class ApplyProfileLinkDto {
  @SanitizeText()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  @IsSafeText({ max: 80 })
  label!: string;

  @IsUrl({ require_tld: false })
  @MaxLength(500)
  url!: string;
}

export class CreateApplyProfileDto {
  @SanitizeText()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  @IsSafeText({ max: 80 })
  name!: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(160)
  @IsSafeText({ max: 160 })
  headline?: string;

  @IsOptional()
  @SanitizeOptionalText({ allowNewlines: true, stripHtml: false })
  @IsString()
  @MaxLength(4000)
  summary?: string;

  @IsOptional()
  @IsIn(BANDS)
  experienceBand?: (typeof BANDS)[number];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(APPLY_PROFILE_LIMITS.minSkills)
  @ArrayMaxSize(APPLY_PROFILE_LIMITS.maxSkills)
  @IsString({ each: true })
  @MaxLength(60, { each: true })
  skills?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(APPLY_PROFILE_LIMITS.maxProjects)
  @ValidateNested({ each: true })
  @Type(() => ApplyProfileProjectDto)
  projects?: ApplyProfileProjectDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(APPLY_PROFILE_LIMITS.maxLinks)
  @ValidateNested({ each: true })
  @Type(() => ApplyProfileLinkDto)
  portfolioLinks?: ApplyProfileLinkDto[];

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}

export class UpdateApplyProfileDto {
  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  @IsSafeText({ max: 80 })
  name?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(160)
  @IsSafeText({ max: 160 })
  headline?: string;

  @IsOptional()
  @SanitizeOptionalText({ allowNewlines: true, stripHtml: false })
  @IsString()
  @MaxLength(4000)
  summary?: string;

  @IsOptional()
  @IsIn(BANDS)
  experienceBand?: (typeof BANDS)[number];

  @IsOptional()
  @IsArray()
  @ArrayMinSize(APPLY_PROFILE_LIMITS.minSkills)
  @ArrayMaxSize(APPLY_PROFILE_LIMITS.maxSkills)
  @IsString({ each: true })
  @MaxLength(60, { each: true })
  skills?: string[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(APPLY_PROFILE_LIMITS.maxProjects)
  @ValidateNested({ each: true })
  @Type(() => ApplyProfileProjectDto)
  projects?: ApplyProfileProjectDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(APPLY_PROFILE_LIMITS.maxLinks)
  @ValidateNested({ each: true })
  @Type(() => ApplyProfileLinkDto)
  portfolioLinks?: ApplyProfileLinkDto[];

  @IsOptional()
  @IsBoolean()
  isDefault?: boolean;
}
