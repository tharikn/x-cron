import { IsIn, IsOptional, IsString, MaxLength, MinLength } from 'class-validator';
import { IsSafeText } from '../../security/validation/decorators';
import {
  SanitizeOptionalText,
  SanitizeText,
} from '../../security/validation/sanitize';
import { REPORT_CATEGORIES, type ReportCategory } from '../../moderation/moderation.types';

export class ModerateJobDto {
  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(500)
  @IsSafeText({ max: 500 })
  note?: string;

  /** Set by controller from CurrentUser — not client-trusted alone. */
  actorId?: string;
}

export class ReportJobDto {
  @IsOptional()
  @IsIn([...REPORT_CATEGORIES])
  category?: ReportCategory;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MinLength(5)
  @MaxLength(2000)
  @IsSafeText({ max: 2000 })
  details?: string;

  /** Legacy free-text — still accepted. */
  @IsOptional()
  @SanitizeText()
  @IsString()
  @MinLength(5)
  @MaxLength(2000)
  reason?: string;
}
