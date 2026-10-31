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

export class AdEventDto {
  @IsString()
  @MinLength(1)
  creativeId!: string;

  @IsIn(['discover_feed', 'job_detail_footer', 'web_home_rail'])
  slot!: 'discover_feed' | 'job_detail_footer' | 'web_home_rail';

  @IsIn(['impression', 'click'])
  type!: 'impression' | 'click';

  @IsString()
  @MinLength(3)
  deviceId!: string;
}

export class PurchasePromotionDto {
  @IsString()
  @MinLength(1)
  jobId!: string;

  @IsIn(['featured_3d', 'featured_7d', 'featured_30d'])
  packageId!: 'featured_3d' | 'featured_7d' | 'featured_30d';
}

export class UpsertPlacementDto {
  @IsBoolean()
  enabled!: boolean;

  @IsInt()
  @Min(0)
  @Max(20)
  maxPerSession!: number;

  @IsInt()
  @Min(0)
  @Max(100)
  frequencyCapPerDay!: number;

  @IsString()
  @MinLength(3)
  label!: string;
}

export class UpsertCreativeDto {
  @IsIn(['discover_feed', 'job_detail_footer', 'web_home_rail'])
  slot!: 'discover_feed' | 'job_detail_footer' | 'web_home_rail';

  @IsIn(['house', 'third_party', 'employer_promo'])
  kind!: 'house' | 'third_party' | 'employer_promo';

  @IsString()
  @MinLength(2)
  advertiser!: string;

  @IsString()
  @MinLength(3)
  headline!: string;

  @IsString()
  @MinLength(3)
  body!: string;

  @IsString()
  @MinLength(2)
  ctaLabel!: string;

  @IsString()
  @MinLength(1)
  targetUrl!: string;

  @IsBoolean()
  active!: boolean;

  @IsInt()
  @Min(0)
  @Max(1000)
  priority!: number;

  @IsOptional()
  @IsString()
  id?: string;
}
