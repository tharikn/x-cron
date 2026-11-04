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
  @IsString()
  @MaxLength(80)
  displayName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  mobile?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  email?: string;

  @IsOptional()
  @IsBoolean()
  showContact?: boolean;

  @IsOptional()
  @IsString()
  @MaxLength(240)
  address?: string;

  @IsOptional()
  @IsString()
  @MaxLength(12)
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
  @IsString()
  @MaxLength(120)
  courseDetails?: string;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  branchStudied?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
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
  @IsString()
  @MaxLength(120)
  companyName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(120)
  companyArea?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
  currentSalary?: string;

  @IsOptional()
  @IsString()
  @MaxLength(40)
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
  skills?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
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
