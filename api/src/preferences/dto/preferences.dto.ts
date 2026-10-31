import {
  IsArray,
  IsBoolean,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class PreferenceFieldsDto {
  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  locations?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  jobTypes?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  categories?: string[];

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  languages?: string[];

  @IsOptional()
  @IsInt()
  salaryMin?: number | null;

  @IsOptional()
  @IsBoolean()
  remotePreferred?: boolean;

  @IsOptional()
  @IsString()
  @MinLength(2)
  interfaceLocale?: string;

  @IsOptional()
  @IsString()
  sort?: string;
}

export class SaveGuestPreferencesDto extends PreferenceFieldsDto {
  @IsString()
  @MinLength(3)
  deviceId!: string;
}

export class ClaimPreferencesDto {
  @IsString()
  @MinLength(3)
  deviceId!: string;
}
