import { IsBoolean, IsIn, IsInt, IsOptional, Max, Min } from 'class-validator';

export class UpdateCommerceDto {
  /** Unlock price in whole rupees (admin-facing). Stored as paise. */
  @IsInt()
  @Min(1)
  @Max(9999)
  unlockPriceInr!: number;

  /** Global payments master switch. */
  @IsBoolean()
  paymentsEnabled!: boolean;

  /** Post-job payment: mandatory | optional | none */
  @IsIn(['mandatory', 'optional', 'none'])
  postJobPaymentMode!: 'mandatory' | 'optional' | 'none';

  /** Post-job fee in whole rupees. */
  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(9999)
  postJobPriceInr?: number;
}
