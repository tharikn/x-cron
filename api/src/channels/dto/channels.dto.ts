import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Matches,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class CreateChannelSourceDto {
  @IsIn(['telegram', 'whatsapp_manual'])
  provider!: 'telegram' | 'whatsapp_manual';

  @IsString()
  @MinLength(2)
  label!: string;

  @IsString()
  @MinLength(1)
  externalId!: string;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdateChannelSourceDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  label?: string;

  @IsOptional()
  @IsIn(['active', 'paused', 'error'])
  status?: 'active' | 'paused' | 'error';

  @IsOptional()
  @IsString()
  notes?: string;

  @IsOptional()
  @IsString()
  externalId?: string;
}

export class ManualChannelMessageDto {
  @IsOptional()
  @IsString()
  sourceId?: string;

  @IsString()
  @MinLength(8)
  text!: string;

  @IsOptional()
  @IsString()
  authorName?: string;

  @IsOptional()
  @IsString()
  label?: string;
}

export class PullNowDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  sourceIds?: string[];

  /** Pull only these pending inbox message ids (manual selection). */
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  messageIds?: string[];

  /** Cap posts per digest so large inboxes split across review batches. */
  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(200)
  maxMessages?: number;
}

export class UpdatePullScheduleDto {
  @IsOptional()
  @IsString()
  timezone?: string;

  @IsOptional()
  @IsBoolean()
  morningEnabled?: boolean;

  @IsOptional()
  @Matches(/^\d{2}:\d{2}$/)
  morningTime?: string;

  @IsOptional()
  @IsBoolean()
  eveningEnabled?: boolean;

  @IsOptional()
  @Matches(/^\d{2}:\d{2}$/)
  eveningTime?: string;
}

export class SkipMessagesDto {
  @IsArray()
  @IsString({ each: true })
  messageIds!: string[];
}
