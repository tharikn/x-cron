import { Type } from 'class-transformer';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsNumber,
  IsOptional,
  IsString,
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
