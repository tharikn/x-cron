import {
  IsIn,
  IsOptional,
  IsString,
  IsUUID,
  MaxLength,
  MinLength,
} from 'class-validator';
import {
  IsSafeText,
  IsXcronEmail,
  IsXcronPhone,
} from '../../security/validation/decorators';
import { SanitizeOptionalText } from '../../security/validation/sanitize';
import type { ApplicationStatus } from '../applications.types';

const EMPLOYER_STATUSES = [
  'under_review',
  'shortlisted',
  'interview',
  'offered',
  'hired',
  'rejected',
  'applied',
] as const;

export class ApplyJobDto {
  /** Required — which apply-profile version to submit (no CV). */
  @IsUUID()
  applyProfileId!: string;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  coverNote?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(120)
  @IsSafeText({ max: 120 })
  seekerName?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(32)
  @IsXcronPhone()
  seekerPhone?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(160)
  @IsXcronEmail()
  seekerEmail?: string;

  /** Required when the job has `screeningQuestion`. */
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(2000)
  screeningAnswer?: string;
}

export class TransitionApplicationDto {
  @IsIn(EMPLOYER_STATUSES)
  status!: Exclude<ApplicationStatus, 'withdrawn'>;

  @IsOptional()
  @IsString()
  @MaxLength(2000)
  note?: string;

  /** Required when moving to offered (job / appointment letter text). */
  @IsOptional()
  @IsString()
  @MinLength(1)
  @MaxLength(8000)
  offerLetterText?: string;
}

export class WithdrawApplicationDto {
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  note?: string;
}

export class AddApplicationNoteDto {
  @IsString()
  @MinLength(1)
  @MaxLength(2000)
  note!: string;
}

export class SendApplicationMessageDto {
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  body!: string;
}
