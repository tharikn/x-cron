import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';

export class JobEventDto {
  @IsIn(['view'])
  type!: 'view';

  /** Client-stable anonymous id for once-per-day dedupe (localStorage UUID). */
  @IsOptional()
  @IsString()
  @MinLength(8)
  @MaxLength(128)
  viewerKey?: string;
}
