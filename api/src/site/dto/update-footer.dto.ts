import { Type } from 'class-transformer';
import {
  ArrayMaxSize,
  ArrayMinSize,
  IsArray,
  IsIn,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
  MinLength,
  ValidateNested,
} from 'class-validator';

class FooterBrandDto {
  @IsString()
  @MinLength(1)
  name!: string;

  @IsString()
  @MinLength(1)
  productLabel!: string;

  @IsString()
  @MinLength(3)
  blurb!: string;
}

class FooterHeadingsDto {
  @IsString()
  @MinLength(1)
  quickLinks!: string;

  @IsString()
  @MinLength(1)
  address!: string;

  @IsString()
  @MinLength(1)
  social!: string;
}

class FooterAddressDto {
  @IsString()
  @MinLength(1)
  id!: string;

  @IsString()
  @MinLength(1)
  label!: string;

  @IsArray()
  @ArrayMinSize(1)
  @ArrayMaxSize(8)
  @IsString({ each: true })
  lines!: string[];

  @IsOptional()
  @IsUrl({ require_tld: false })
  mapUrl?: string;

  @IsInt()
  @Min(0)
  @Max(1000)
  sortOrder!: number;
}

class FooterSocialLinkDto {
  @IsString()
  @MinLength(1)
  id!: string;

  @IsIn([
    'x',
    'instagram',
    'youtube',
    'linkedin',
    'facebook',
    'whatsapp',
    'other',
  ])
  network!:
    | 'x'
    | 'instagram'
    | 'youtube'
    | 'linkedin'
    | 'facebook'
    | 'whatsapp'
    | 'other';

  @IsString()
  @MinLength(1)
  label!: string;

  @IsUrl({ require_protocol: true })
  url!: string;

  @IsInt()
  @Min(0)
  @Max(1000)
  sortOrder!: number;
}

class FooterQuickLinkDto {
  @IsString()
  @MinLength(1)
  id!: string;

  @IsString()
  @MinLength(1)
  label!: string;

  @IsString()
  @MinLength(1)
  href!: string;

  @IsInt()
  @Min(0)
  @Max(1000)
  sortOrder!: number;
}

class FooterLegalLinkDto {
  @IsString()
  @MinLength(1)
  id!: string;

  @IsString()
  @MinLength(1)
  label!: string;

  @IsString()
  @MinLength(1)
  href!: string;

  @IsInt()
  @Min(0)
  @Max(1000)
  sortOrder!: number;
}

export class UpdateFooterDto {
  @ValidateNested()
  @Type(() => FooterBrandDto)
  brand!: FooterBrandDto;

  @ValidateNested()
  @Type(() => FooterHeadingsDto)
  headings!: FooterHeadingsDto;

  @IsArray()
  @ArrayMaxSize(6)
  @ValidateNested({ each: true })
  @Type(() => FooterAddressDto)
  addresses!: FooterAddressDto[];

  @IsArray()
  @ArrayMaxSize(12)
  @ValidateNested({ each: true })
  @Type(() => FooterSocialLinkDto)
  socialLinks!: FooterSocialLinkDto[];

  @IsArray()
  @ArrayMaxSize(20)
  @ValidateNested({ each: true })
  @Type(() => FooterQuickLinkDto)
  quickLinks!: FooterQuickLinkDto[];

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(12)
  @ValidateNested({ each: true })
  @Type(() => FooterLegalLinkDto)
  legalLinks?: FooterLegalLinkDto[];

  @IsString()
  @MinLength(3)
  copyright!: string;
}
