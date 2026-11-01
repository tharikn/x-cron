import { IsInt, IsOptional, IsString, Max, MaxLength, Min } from 'class-validator';

export class EnrichJobDto {
  @IsOptional()
  @IsString()
  @MaxLength(200)
  title?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  employerName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  locationCity?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  jobType?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  salaryText?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100000)
  vacancies?: number;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  contactWebsite?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(16)
  contentLanguage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20000)
  rawText?: string;

  /** Chat-style moderator instruction for this cleanup pass. */
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  instruction?: string;
}
