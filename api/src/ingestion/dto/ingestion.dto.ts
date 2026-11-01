import {
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreateImportBatchDto {
  @IsOptional()
  @IsIn([
    'csv',
    'text',
    'whatsapp',
    'telegram',
    'image',
    'pdf',
    'docx',
    'unknown',
  ])
  sourceType?:
    | 'csv'
    | 'text'
    | 'whatsapp'
    | 'telegram'
    | 'image'
    | 'pdf'
    | 'docx'
    | 'unknown';
}

export class TextUploadDto {
  @IsString()
  @MinLength(3)
  text!: string;

  @IsOptional()
  @IsIn(['text', 'whatsapp', 'telegram'])
  sourceType?: 'text' | 'whatsapp' | 'telegram';

  @IsOptional()
  @IsString()
  filename?: string;
}

export class ApproveRecordsDto {
  @IsArray()
  @IsString({ each: true })
  recordIds!: string[];
}

export class EnrichRecordDto {
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  instruction?: string;
}

export class UpdateImportRecordDto {
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
  @MaxLength(20000)
  description?: string;

  @IsOptional()
  @IsString()
  @MaxLength(16)
  contentLanguage?: string;

  @IsOptional()
  @IsString()
  @MaxLength(500)
  contactWebsite?: string;
}
