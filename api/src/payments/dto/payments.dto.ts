import { IsIn, IsObject, IsOptional, IsString, MinLength } from 'class-validator';

export class DevConfirmPaymentDto {
  @IsString()
  @MinLength(1)
  orderId!: string;
}

export class RazorpayWebhookDto {
  @IsOptional()
  @IsString()
  event?: string;

  @IsOptional()
  @IsString()
  id?: string;

  @IsOptional()
  @IsString()
  gatewayOrderId?: string;

  @IsOptional()
  @IsString()
  gatewayPaymentId?: string;

  @IsOptional()
  @IsIn(['paid', 'failed'])
  status?: 'paid' | 'failed';

  @IsOptional()
  @IsObject()
  payload?: Record<string, unknown>;
}
