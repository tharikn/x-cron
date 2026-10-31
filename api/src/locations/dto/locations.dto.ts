import { Type } from 'class-transformer';
import {
  IsInt,
  IsOptional,
  IsString,
  Max,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class SearchLocationsDto {
  @IsString()
  @MinLength(1)
  @MaxLength(80)
  q!: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(30)
  limit?: number;
}

export class ListDistrictsDto {
  @IsString()
  @MinLength(1)
  @MaxLength(8)
  stateCode!: string;
}
