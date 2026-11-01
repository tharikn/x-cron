import { IsIn, IsInt, IsOptional, IsString, Max, Min } from 'class-validator';
import { Type } from 'class-transformer';

export class PaymentHistoryQueryDto {
  @IsOptional()
  @IsIn([
    'created',
    'confirm_attempt',
    'confirm_failed',
    'paid',
    'failed',
    'cancelled',
    'webhook_rejected',
    'free_grant',
  ])
  status?:
    | 'created'
    | 'confirm_attempt'
    | 'confirm_failed'
    | 'paid'
    | 'failed'
    | 'cancelled'
    | 'webhook_rejected'
    | 'free_grant';

  @IsOptional()
  @IsString()
  orderId?: string;

  @IsOptional()
  @IsString()
  userId?: string;

  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  to?: string;

  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(5000)
  limit?: number;
}
