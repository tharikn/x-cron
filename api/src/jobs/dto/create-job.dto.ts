import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
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
}

export class PasteJobDto {
  @IsString()
  @MinLength(10)
  text!: string;

  @IsOptional()
  @IsString()
  contentLanguage?: string;
}
