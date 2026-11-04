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
  Min,
  MinLength,
} from 'class-validator';

export class CreateJobDto {
  @IsString()
  @MinLength(2)
  title!: string;

  @IsString()
  @MinLength(2)
  employerName!: string;

  @IsString()
  @MinLength(2)
  locationCity!: string;

  @IsOptional()
  @IsString()
  locationDistrict?: string;

  @IsOptional()
  @IsString()
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
  @IsString()
  salaryText?: string;

  @IsString()
  @MinLength(5)
  description!: string;

  @IsString()
  contentLanguage!: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  contactWebsite?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
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
}

export class UpdateJobDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  title?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  employerName?: string;

  @IsOptional()
  @IsString()
  @MinLength(2)
  locationCity?: string;

  @IsOptional()
  @IsString()
  locationDistrict?: string;

  @IsOptional()
  @IsString()
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
  @IsString()
  salaryText?: string;

  @IsOptional()
  @IsString()
  @MinLength(5)
  description?: string;

  @IsOptional()
  @IsString()
  contentLanguage?: string;

  @IsOptional()
  @IsString()
  contactPhone?: string;

  @IsOptional()
  @IsString()
  contactEmail?: string;

  @IsOptional()
  @IsString()
  contactWebsite?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
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
}

export class PasteJobDto {
  @IsString()
  @MinLength(10)
  text!: string;

  @IsOptional()
  @IsString()
  contentLanguage?: string;
}
