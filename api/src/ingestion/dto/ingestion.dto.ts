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
import {
  IsSafeText,
  IsXcronSalaryText,
  IsXcronUrl,
} from '../../security/validation/decorators';
import { SanitizeOptionalText } from '../../security/validation/sanitize';

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
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(200)
  @IsSafeText({ max: 200 })
  title?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(200)
  @IsSafeText({ max: 200 })
  employerName?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(120)
  @IsSafeText({ max: 120 })
  locationCity?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(40)
  jobType?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(120)
  @IsXcronSalaryText()
  salaryText?: string;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100000)
  vacancies?: number;

  @IsOptional()
  @SanitizeOptionalText({ allowNewlines: true, stripHtml: false })
  @IsString()
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
  @MaxLength(500)
  @IsXcronUrl()
  contactWebsite?: string;
}
