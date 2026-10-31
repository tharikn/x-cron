import { IsIn, IsOptional, IsString } from 'class-validator';

export class DashboardQueryDto {
  /** Bucket size for the posts / sign-ins series. */
  @IsOptional()
  @IsIn(['day', 'month', 'year'])
  granularity?: 'day' | 'month' | 'year';

  /** Inclusive ISO date or datetime (defaults to start of current period). */
  @IsOptional()
  @IsString()
  from?: string;

  /** Inclusive ISO date or datetime (defaults to now). */
  @IsOptional()
  @IsString()
  to?: string;
}
