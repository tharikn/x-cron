import { Transform, Type } from 'class-transformer';
import {
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  Min,
} from 'class-validator';

function toOptionalBoolean(value: unknown): boolean | undefined {
  if (value === true || value === 'true' || value === '1') return true;
  if (value === false || value === 'false' || value === '0') return false;
  return undefined;
}

export class SearchJobsDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsIn([
    'full-time',
    'part-time',
    'contract',
    'temporary',
    'internship',
    'apprenticeship',
    'daily-wage',
    '',
  ])
  jobType?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  salaryMin?: number;

  @IsOptional()
  @Transform(({ value }) => toOptionalBoolean(value))
  @IsBoolean()
  remote?: boolean;

  @IsOptional()
  @IsIn(['1d', '7d', '30d', ''])
  postedWithin?: '1d' | '7d' | '30d' | '';

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-90)
  @Max(90)
  nearLat?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(-180)
  @Max(180)
  nearLng?: number;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(500)
  radiusKm?: number;

  @IsOptional()
  @Transform(({ value }) => toOptionalBoolean(value))
  @IsBoolean()
  walkInOnly?: boolean;

  @IsOptional()
  @IsIn([
    'relevance',
    'newest',
    'oldest',
    'salary-desc',
    'salary-asc',
    'distance',
  ])
  sort?:
    | 'relevance'
    | 'newest'
    | 'oldest'
    | 'salary-desc'
    | 'salary-asc'
    | 'distance';

  @IsOptional()
  @IsString()
  cursor?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  @Max(50)
  limit?: number;
}
