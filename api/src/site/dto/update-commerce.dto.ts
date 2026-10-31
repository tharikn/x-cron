import { IsInt, Max, Min } from 'class-validator';

export class UpdateCommerceDto {
  /** Unlock price in whole rupees (admin-facing). Stored as paise. */
  @IsInt()
  @Min(1)
  @Max(9999)
  unlockPriceInr!: number;
}
