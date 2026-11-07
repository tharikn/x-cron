import { Type } from 'class-transformer';
import {
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
} from 'class-validator';

const EVENT_TYPES = [
  'access',
  'heartbeat',
  'search',
  'share',
  'apply',
  'page_view',
] as const;

export class TrackEventDto {
  @IsIn(EVENT_TYPES)
  type!: (typeof EVENT_TYPES)[number];

  @IsOptional()
  @IsString()
  @MaxLength(128)
  visitorKey?: string;

  @IsOptional()
  @IsString()
  @MaxLength(64)
  jobId?: string;

  @IsOptional()
  @IsString()
  @MaxLength(512)
  path?: string;

  /** Active time for heartbeat (ms). Capped server-side. */
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(15 * 60 * 1000)
  durationMs?: number;

  @IsOptional()
  @IsObject()
  meta?: Record<string, unknown>;
}

export class TrackingUsersQueryDto {
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(200)
  limit?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  offset?: number;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  q?: string;

  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  to?: string;
}
