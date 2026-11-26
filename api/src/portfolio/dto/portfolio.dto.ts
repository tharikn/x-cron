import {
  ArrayMaxSize,
  IsArray,
  IsIn,
  IsInt,
  IsObject,
  IsOptional,
  IsString,
  Matches,
  MaxLength,
  Min,
  MinLength,
} from 'class-validator';

export class CreatePortfolioSiteDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(60)
  templateId!: string;

  @IsOptional()
  @Matches(/^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])?$/, {
    message: 'slug must be lowercase letters, numbers or dashes',
  })
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  defaultLocale?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @MaxLength(20, { each: true })
  locales?: string[];
}

export class UpdatePortfolioSiteDto {
  @IsOptional()
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  name?: string;

  @IsOptional()
  @Matches(/^[a-z0-9](?:[a-z0-9-]{1,38}[a-z0-9])?$/, {
    message: 'slug must be lowercase letters, numbers or dashes',
  })
  slug?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  defaultLocale?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(10)
  @IsString({ each: true })
  @MaxLength(20, { each: true })
  locales?: string[];
}

// ── Custom domain bindings (docs/dynamic-portfolios/13-DOMAIN-SUBDOMAIN-ROUTING.md) ──

export class CreatePortfolioDomainDto {
  @IsString()
  @MinLength(3)
  @MaxLength(40)
  siteId!: string;

  @IsString()
  @MinLength(3)
  @MaxLength(253)
  hostname!: string;

  @IsOptional()
  @IsIn(['TXT', 'CNAME'])
  verificationMethod?: 'TXT' | 'CNAME';
}

export class VerifyPortfolioDomainDto {
  /** DNS record value (TXT) or CNAME target the owner just published. */
  @IsOptional()
  @IsString()
  @MaxLength(255)
  token?: string;
}

export class ListPortfolioDomainsQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(40)
  siteId?: string;
}

export class SavePortfolioDraftDto {
  @IsObject()
  document!: Record<string, unknown>;

  @IsInt()
  @Min(0)
  baseRevision!: number;

  @IsOptional()
  @IsString()
  @MaxLength(80)
  mutationId?: string;
}

export class ValidatePortfolioDraftDto {
  @IsOptional()
  @IsObject()
  document?: Record<string, unknown>;
}

export class PublishPortfolioDto {
  @IsString()
  @MinLength(6)
  @MaxLength(100)
  idempotencyKey!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  note?: string;
}

export class RollbackPortfolioDto {
  @IsString()
  @MinLength(3)
  @MaxLength(80)
  versionId!: string;

  @IsString()
  @MinLength(6)
  @MaxLength(100)
  idempotencyKey!: string;
}

export class PortfolioEventDto {
  @IsOptional()
  @IsIn(['view', 'contact', 'outbound', 'download'])
  type?: 'view' | 'contact' | 'outbound' | 'download';

  @IsOptional()
  @IsString()
  @MaxLength(200)
  path?: string;

  @IsOptional()
  @IsString()
  @MaxLength(20)
  locale?: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  referrer?: string;
}

export class ListPortfolioTemplatesQueryDto {
  @IsOptional()
  @IsString()
  @MaxLength(40)
  category?: string;
}

/** Optional AI copy assist — proposals only, never written to a draft. */
export class GeneratePortfolioCopyDto {
  @IsString()
  @MinLength(2)
  @MaxLength(80)
  role!: string;

  @IsOptional()
  @IsString()
  @MaxLength(200)
  experience?: string;

  @IsOptional()
  @IsArray()
  @ArrayMaxSize(20)
  @IsString({ each: true })
  @MaxLength(40, { each: true })
  skills?: string[];

  @IsOptional()
  @IsIn(['professional', 'creative', 'minimal'])
  tone?: 'professional' | 'creative' | 'minimal';

  @IsOptional()
  @IsString()
  @MaxLength(20)
  locale?: string;
}
