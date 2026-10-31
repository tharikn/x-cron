import { IsOptional, IsString, MinLength } from 'class-validator';

export class ModerateJobDto {
  @IsOptional()
  @IsString()
  note?: string;
}

export class ReportJobDto {
  @IsString()
  @MinLength(5)
  reason!: string;
}
