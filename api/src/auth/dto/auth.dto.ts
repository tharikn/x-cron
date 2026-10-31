import { IsIn, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';

export class StartOtpDto {
  @IsIn(['phone', 'email'])
  channel!: 'phone' | 'email';

  @IsString()
  @MinLength(5)
  destination!: string;

  @IsOptional()
  @IsIn(['seeker', 'employer'])
  intendedRole?: 'seeker' | 'employer';
}

export class VerifyOtpDto {
  @IsString()
  challengeId!: string;

  @IsString()
  @MinLength(4)
  code!: string;
}

export class CreateEmployerDto {
  @IsString()
  @MinLength(2)
  name!: string;
}

/** Google Identity idToken, or local stub email when AUTH_GOOGLE_STUB=1 / non-production. */
export class GoogleAuthDto {
  @ValidateIf((o: GoogleAuthDto) => !o.email)
  @IsString()
  @MinLength(10)
  idToken?: string;

  @ValidateIf((o: GoogleAuthDto) => !o.idToken)
  @IsString()
  @MinLength(5)
  email?: string;

  @IsOptional()
  @IsString()
  displayName?: string;
}

/** Password login for the configured SUPER_ADMIN_* identity. */
export class AdminLoginDto {
  @IsString()
  @MinLength(5)
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}
