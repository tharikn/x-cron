import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsObject,
  IsOptional,
  IsString,
  IsUrl,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import {
  IsSafeText,
  IsXcronEmail,
} from '../../security/validation/decorators';
import {
  SanitizeOptionalText,
  SanitizeText,
} from '../../security/validation/sanitize';

const MEMBER_ROLES = [
  'owner',
  'admin',
  'recruiter',
  'hiring_manager',
  'viewer',
] as const;

const INVITE_ROLES = [
  'admin',
  'recruiter',
  'hiring_manager',
  'viewer',
] as const;

const VERIFY_KINDS = [
  'domain_email',
  'business_registration',
  'website',
  'other',
] as const;

const SIZE_BANDS = [
  '1-10',
  '11-50',
  '51-200',
  '201-1000',
  '1000+',
] as const;

export class CreateCompanyDto {
  @SanitizeText()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  @IsSafeText({ max: 200 })
  name!: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(200)
  @IsSafeText({ max: 200 })
  legalName?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(4000)
  @IsSafeText({ max: 4000 })
  about?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(500)
  website?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(120)
  @IsSafeText({ max: 120 })
  industry?: string;

  @IsOptional()
  @IsIn([...SIZE_BANDS])
  sizeBand?: (typeof SIZE_BANDS)[number];

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(200)
  @IsSafeText({ max: 200 })
  headquarters?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  hiringLocations?: string[];
}

export class PatchCompanyDto {
  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  @IsSafeText({ max: 200 })
  name?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(200)
  @IsSafeText({ max: 200 })
  legalName?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(4000)
  @IsSafeText({ max: 4000 })
  about?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(500)
  @ValidateIf((_, v) => !!v)
  @IsUrl({ require_protocol: true })
  logoUrl?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(500)
  website?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(120)
  @IsSafeText({ max: 120 })
  industry?: string;

  @IsOptional()
  @IsIn([...SIZE_BANDS])
  sizeBand?: (typeof SIZE_BANDS)[number];

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(200)
  @IsSafeText({ max: 200 })
  headquarters?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  hiringLocations?: string[];

  @IsOptional()
  @IsObject()
  workspaceSettings?: Record<string, unknown>;
}

export class SubmitVerificationDto {
  @IsIn([...VERIFY_KINDS])
  kind!: (typeof VERIFY_KINDS)[number];

  @SanitizeText()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  @IsSafeText({ max: 200 })
  label!: string;

  @SanitizeText()
  @IsString()
  @MinLength(2)
  @MaxLength(1000)
  reference!: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(120)
  claimedEmailDomain?: string;
}

export class CreateInvitationDto {
  @SanitizeText()
  @IsString()
  @IsXcronEmail()
  email!: string;

  @IsIn([...INVITE_ROLES])
  role!: (typeof INVITE_ROLES)[number];
}

export class PatchMemberDto {
  @IsOptional()
  @IsIn([...MEMBER_ROLES])
  role?: (typeof MEMBER_ROLES)[number];

  @IsOptional()
  @IsIn(['active', 'revoked'])
  status?: 'active' | 'revoked';

  @IsOptional()
  @IsObject()
  savedFilters?: Record<string, unknown>;
}

export class TransferOwnershipDto {
  @SanitizeText()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  targetMemberId!: string;

  /** Must equal company display name to confirm. */
  @SanitizeText()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  confirmCompanyName!: string;
}

export class CreateInternalNoteDto {
  @SanitizeText()
  @IsString()
  @MinLength(1)
  @MaxLength(4000)
  @IsSafeText({ max: 4000 })
  body!: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(64)
  applicationId?: string;
}

export class CreateInterviewDto {
  @SanitizeText()
  @IsString()
  @MinLength(8)
  @MaxLength(64)
  applicationId!: string;

  @SanitizeText()
  @IsString()
  @MinLength(10)
  @MaxLength(40)
  scheduledAt!: string;

  @IsOptional()
  @IsIn(['video', 'phone', 'in_person'])
  mode?: 'video' | 'phone' | 'in_person';

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(500)
  locationOrLink?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(2000)
  @IsSafeText({ max: 2000 })
  notes?: string;
}

export class PatchInterviewDto {
  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MinLength(10)
  @MaxLength(40)
  scheduledAt?: string;

  @IsOptional()
  @IsIn(['video', 'phone', 'in_person'])
  mode?: 'video' | 'phone' | 'in_person';

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(500)
  locationOrLink?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(2000)
  @IsSafeText({ max: 2000 })
  notes?: string;

  @IsOptional()
  @IsIn(['scheduled', 'completed', 'cancelled'])
  status?: 'scheduled' | 'completed' | 'cancelled';
}

/** Admin-only verification decision. */
export class AdminVerificationDecisionDto {
  @IsIn([
    'verified',
    'rejected',
    'suspended',
    'reverify_required',
    'pending',
  ])
  status!:
    | 'verified'
    | 'rejected'
    | 'suspended'
    | 'reverify_required'
    | 'pending';

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(2000)
  @IsSafeText({ max: 2000 })
  reviewerNotes?: string;

  @IsOptional()
  @IsIn(['standard', 'elevated', 'restricted'])
  trustTier?: 'standard' | 'elevated' | 'restricted';

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  riskFlags?: string[];
}
