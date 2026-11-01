import { IsInt, Max, Min } from 'class-validator';

export class UpdateAuthDto {
  /** Session lifetime in whole days (admin-facing). */
  @IsInt()
  @Min(1)
  @Max(365)
  sessionTtlDays!: number;

  /** OTP challenge lifetime in whole minutes (admin-facing). */
  @IsInt()
  @Min(1)
  @Max(60)
  otpTtlMinutes!: number;
}
