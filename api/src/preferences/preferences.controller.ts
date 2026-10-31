import { Body, Controller, Get, Post, Query } from '@nestjs/common';
import {
  IsArray,
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';
import { PreferencesService } from './preferences.service';

class SavePreferencesDto {
  @IsString()
  @MinLength(3)
  deviceId!: string;

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
  @IsIn(['en', 'ta'])
  interfaceLocale?: 'en' | 'ta';

  @IsOptional()
  @IsString()
  sort?: string;
}

@Controller('v1/preferences')
export class PreferencesController {
  constructor(private readonly preferencesService: PreferencesService) {}

  @Post()
  save(@Body() dto: SavePreferencesDto) {
    return this.preferencesService.save(dto);
  }

  @Get()
  get(@Query('deviceId') deviceId: string) {
    return this.preferencesService.get(deviceId || 'anonymous');
  }
}
