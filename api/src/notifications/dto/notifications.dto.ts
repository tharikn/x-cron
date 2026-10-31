import {
  IsBoolean,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  Max,
  Min,
  MinLength,
} from 'class-validator';

export class RegisterDeviceDto {
  @IsString()
  @MinLength(3)
  deviceId!: string;

  @IsString()
  @MinLength(8)
  fcmToken!: string;

  @IsIn(['android', 'ios', 'web'])
  platform!: 'android' | 'ios' | 'web';
}

export class NotificationPreferencesDto {
  @IsOptional()
  @IsBoolean()
  jobAlertsEnabled?: boolean;

  @IsOptional()
  @IsBoolean()
  marketingEnabled?: boolean;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(23)
  quietHoursStart?: number | null;

  @IsOptional()
  @IsInt()
  @Min(0)
  @Max(23)
  quietHoursEnd?: number | null;

  @IsOptional()
  @IsInt()
  @Min(1)
  @Max(100)
  dailyCap?: number;
}

export class DevSendNotificationDto {
  @IsString()
  @MinLength(1)
  userId!: string;

  @IsOptional()
  @IsString()
  title?: string;

  @IsOptional()
  @IsString()
  body?: string;

  @IsOptional()
  @IsString()
  jobId?: string;
}
