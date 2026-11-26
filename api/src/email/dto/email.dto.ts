import {
  IsBoolean,
  IsEmail,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';
import type { EmailCategory, OtpPurpose } from '../types/email.types';

export class SendEmailDto {
  @IsEmail()
  to!: string;

  @IsOptional()
  @IsString()
  toName?: string;

  @IsString()
  @MinLength(1)
  subject!: string;

  @IsOptional()
  @IsString()
  text?: string;

  @IsOptional()
  @IsString()
  html?: string;

  @IsOptional()
  @IsString()
  template?: string;

  @IsOptional()
  templateData?: Record<string, unknown>;

  @IsOptional()
  @IsString()
  tenantId?: string;

  @IsIn([
    'otp',
    'verification',
    'recovery',
    'job_alert',
    'weekly_digest',
    'welcome',
    'application_update',
    'system',
  ])
  category!: EmailCategory;

  @IsOptional()
  @IsString()
  from?: string;

  @IsOptional()
  @IsString()
  fromName?: string;

  @IsOptional()
  @IsString()
  replyTo?: string;

  @IsOptional()
  @IsString()
  dedupeKey?: string;
}

export class SendOtpDto {
  @IsEmail()
  email!: string;

  @IsIn(['signup', 'login', 'recovery', 'verification'])
  purpose!: OtpPurpose;

  @IsOptional()
  @IsString()
  recipientName?: string;
}

export class VerifyOtpDto {
  @IsEmail()
  email!: string;

  @IsString()
  @MinLength(4)
  @Max(8)
  code!: string;

  @IsIn(['signup', 'login', 'recovery', 'verification'])
  purpose!: OtpPurpose;
}

export class SendRecoveryDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  recipientName?: string;

  @IsOptional()
  @IsString()
  recoveryUrl?: string;
}

export class SendJobAlertEmailDto {
  @IsEmail()
  to!: string;

  @IsString()
  @MinLength(1)
  jobTitle!: string;

  @IsString()
  @MinLength(1)
  employerName!: string;

  @IsString()
  @MinLength(1)
  city!: string;

  @IsOptional()
  @IsString()
  jobType?: string;

  @IsOptional()
  @IsString()
  salaryText?: string;

  @IsString()
  @MinLength(1)
  jobUrl!: string;

  @IsOptional()
  @IsString()
  summary?: string;

  @IsOptional()
  @IsString()
  tenantId?: string;
}

export class SetSenderConfigDto {
  @IsString()
  @MinLength(1)
  tenantId!: string;

  @IsEmail()
  from!: string;

  @IsString()
  @MinLength(1)
  fromName!: string;

  @IsOptional()
  @IsEmail()
  replyTo?: string;

  @IsOptional()
  @IsBoolean()
  enabled?: boolean;
}

export class SendVerificationEmailDto {
  @IsEmail()
  email!: string;

  @IsOptional()
  @IsString()
  recipientName?: string;

  @IsOptional()
  @IsString()
  verificationUrl?: string;
}
