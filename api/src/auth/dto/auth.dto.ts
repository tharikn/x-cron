import {
  IsIn,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  MinLength,
  ValidateIf,
} from 'class-validator';
import { IsSafeText, IsXcronEmail } from '../../security/validation/decorators';
import {
  SanitizeOptionalText,
  SanitizeText,
} from '../../security/validation/sanitize';

/** Create account — username + password (+ confirm on client/server). */
export class RegisterDto {
  @SanitizeText()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username may only use letters, numbers, and underscore',
  })
  username!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  confirmPassword!: string;

  /** seeker (default) or employer — never admin via register. */
  @IsOptional()
  @IsIn(['seeker', 'employer'])
  intendedRole?: 'seeker' | 'employer';
}

/** Sign in with local username + password. */
export class LoginDto {
  @SanitizeText()
  @IsString()
  @MinLength(3)
  @MaxLength(32)
  @Matches(/^[a-zA-Z0-9_]+$/, {
    message: 'Username may only use letters, numbers, and underscore',
  })
  username!: string;

  @IsString()
  @MinLength(8)
  @MaxLength(128)
  password!: string;

  /** seeker (default) or employer — never admin via login. */
  @IsOptional()
  @IsIn(['seeker', 'employer'])
  intendedRole?: 'seeker' | 'employer';
}

export class CreateEmployerDto {
  @SanitizeText()
  @IsString()
  @MinLength(2)
  @MaxLength(200)
  @IsSafeText({ max: 200 })
  name!: string;
}

/** Google Identity idToken, or local stub email when AUTH_GOOGLE_STUB=1 / non-production. */
export class GoogleAuthDto {
  @ValidateIf((o: GoogleAuthDto) => !o.email)
  @IsString()
  @MinLength(10)
  idToken?: string;

  @ValidateIf((o: GoogleAuthDto) => !o.idToken)
  @SanitizeOptionalText()
  @IsString()
  @IsXcronEmail()
  email?: string;

  @IsOptional()
  @SanitizeOptionalText()
  @IsString()
  @MaxLength(80)
  @IsSafeText({ max: 80 })
  displayName?: string;

  /** seeker (default) or employer — never admin via Google. */
  @IsOptional()
  @IsIn(['seeker', 'employer'])
  intendedRole?: 'seeker' | 'employer';
}

/** Password login for the configured SUPER_ADMIN_* identity. */
export class AdminLoginDto {
  @SanitizeText()
  @IsString()
  @IsXcronEmail()
  email!: string;

  @IsString()
  @MinLength(8)
  password!: string;
}

/** Rotate access + refresh tokens (body optional when HttpOnly refresh cookie is set). */
export class RefreshTokenDto {
  @IsOptional()
  @IsString()
  @MinLength(16)
  refreshToken?: string;
}
