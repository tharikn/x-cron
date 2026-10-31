import { IsIn, IsOptional, IsString, MinLength } from 'class-validator';

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

export class GoogleAuthDto {
  @IsString()
  @MinLength(10)
  idToken!: string;
}
