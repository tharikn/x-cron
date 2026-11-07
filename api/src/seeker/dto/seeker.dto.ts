import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsNumber,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  ValidateNested,
} from 'class-validator';
import {
  IsSafeText,
  IsXcronEmail,
  IsXcronPhone,
  IsXcronPincode,
  IsXcronSalaryText,
} from '../../security/validation/decorators';
import { SanitizeOptionalText } from '../../security/validation/sanitize';

export class SavedSearchQueryDto {
  @IsOptional()
  @IsString()
  keyword?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  jobType?: string;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsString()
  language?: string;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  salaryMin?: number | null;

  @IsOptional()
  @IsBoolean()
  remote?: boolean | null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  @Min(1)
  radiusKm?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  nearLat?: number | null;

  @IsOptional()
  @Type(() => Number)
  @IsNumber()
  nearLng?: number | null;

  @IsOptional()
  @IsBoolean()
  walkInOnly?: boolean | null;

  @IsOptional()
  @IsIn(['1d', '7d', '30d', null])
  postedWithin?: '1d' | '7d' | '30d' | null;

  @IsOptional()
  @IsString()
  skills?: string;

  @IsOptional()
  @IsBoolean()
  verifiedEmployer?: boolean | null;

  @IsOptional()
  @IsBoolean()
  fresher?: boolean | null;

  @IsOptional()
  @IsBoolean()
  easyApply?: boolean | null;

  @IsOptional()
  @IsString()
  sort?: string;
}

export class CreateSavedSearchDto {
  @IsString()
  @MaxLength(80)
  name!: string;

  @ValidateNested()
  @Type(() => SavedSearchQueryDto)
  query!: SavedSearchQueryDto;

  @IsOptional()
  @IsBoolean()
  alertEnabled?: boolean;
}

export class UpdateSavedSearchDto {
  @IsOptional()
  @IsString()
  @MaxLength(80)
  name?: string;

  @IsOptional()
  @ValidateNested()
  @Type(() => SavedSearchQueryDto)
  query?: SavedSearchQueryDto;

  @IsOptional()
  @IsBoolean()
  alertEnabled?: boolean;
}

export class UpsertSeekerProfileDto {
  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(80)
  @IsSafeText({ max: 80 })
  displayName?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(20)
  @IsXcronPhone()
  mobile?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(120)
  @IsXcronEmail()
  email?: string;

  @IsOptional()
  @IsBoolean()
  showContact?: boolean;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(240)
  @IsSafeText({ max: 240 })
  address?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(12)
  @IsXcronPincode()
  pincode?: string;

  @IsOptional()
  @IsIn(['fresher', 'experienced'])
  careerStage?: 'fresher' | 'experienced';

  @IsOptional()
  @IsIn(['pursuing', 'completed'])
  educationStatus?: 'pursuing' | 'completed';

  @IsOptional()
  @IsBoolean()
  openToInternship?: boolean;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(120)
  @IsSafeText({ max: 120 })
  courseDetails?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(80)
  @IsSafeText({ max: 80 })
  branchStudied?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(40)
  @IsSafeText({ max: 40 })
  academicScore?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(50)
  experienceYears?: number;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(11)
  experienceMonths?: number;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(120)
  @IsSafeText({ max: 120 })
  companyName?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(120)
  @IsSafeText({ max: 120 })
  companyArea?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(40)
  @IsXcronSalaryText()
  currentSalary?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(40)
  @IsXcronSalaryText()
  expectedSalary?: string;

  @IsOptional()
  @IsIn(['serving', '1', '2', '3', 'immediate'])
  noticePeriod?: 'serving' | '1' | '2' | '3' | 'immediate';

  @IsOptional()
  @IsIn(['fresher', '0-1', '1-3', '3-5', '5+'])
  experienceBand?: 'fresher' | '0-1' | '1-3' | '3-5' | '5+';

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(60, { each: true })
  skills?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  @MaxLength(80, { each: true })
  preferredCities?: string[];

  @IsOptional()
  @IsBoolean()
  openToWork?: boolean;
}

export class MarkApplicationDto {
  @IsOptional()
  @IsIn(['contacted', 'applied'])
  status?: 'contacted' | 'applied';

  @IsOptional()
  @IsIn(['phone', 'whatsapp', 'email', 'website', 'other'])
  channel?: 'phone' | 'whatsapp' | 'email' | 'website' | 'other';
}

export class HideJobDto {
  @IsOptional()
  @IsBoolean()
  hideEmployer?: boolean;
}
