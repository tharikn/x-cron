import { IsArray, IsIn, IsOptional, IsString, MinLength } from 'class-validator';

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
