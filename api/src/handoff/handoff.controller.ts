import { Body, Controller, Get, Headers, Post } from '@nestjs/common';
import { IsString, Length } from 'class-validator';
import { CurrentUser, Public } from '../auth/decorators';
import type { AuthUser } from '../auth/auth.types';
import { AuthThrottle } from '../security/decorators';
import { HandoffService } from './handoff.service';

class CreateCodeDto {
  @IsString() @Length(1, 300) redirectUri!: string;
  @IsString() @Length(16, 128) nonce!: string;
}

class ExchangeDto extends CreateCodeDto {
  @IsString() @Length(20, 100) code!: string;
}

@Controller('v1/handoff')
export class HandoffController {
  constructor(private readonly handoff: HandoffService) {}

  /** Signed-in X Cron user → one-time code for XCron CV (no token in URL). */
  @AuthThrottle()
  @Post('resume')
  create(@CurrentUser() user: AuthUser, @Body() dto: CreateCodeDto) {
    return { code: this.handoff.createCode(user, dto.redirectUri, dto.nonce) };
  }

  /** Server-to-server from the XCron CV API; guarded by a shared secret header. */
  @Public()
  @AuthThrottle()
  @Post('exchange')
  exchange(
    @Headers('x-handoff-secret') secret: string | undefined,
    @Body() dto: ExchangeDto,
  ) {
    return this.handoff.exchange(secret, dto.code, dto.redirectUri, dto.nonce);
  }
}

@Controller('.well-known')
export class JwksController {
  constructor(private readonly handoff: HandoffService) {}

  @Public()
  @Get('jwks.json')
  jwks() {
    return this.handoff.jwks();
  }
}
