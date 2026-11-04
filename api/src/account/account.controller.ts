import { Controller, Delete, Res } from '@nestjs/common';
import type { Response } from 'express';
import { AccessToken } from '../auth/decorators';
import { clearAuthCookies } from '../security/auth-cookies';
import { SensitiveThrottle } from '../security/decorators';
import { AccountService } from './account.service';

@Controller('v1')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @SensitiveThrottle()
  @Delete('me')
  deleteMe(
    @AccessToken() token: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = this.accountService.deleteAccount(token);
    clearAuthCookies(res);
    return result;
  }

  @SensitiveThrottle()
  @Delete('auth/me')
  deleteAuthMe(
    @AccessToken() token: string | undefined,
    @Res({ passthrough: true }) res: Response,
  ) {
    const result = this.accountService.deleteAccount(token);
    clearAuthCookies(res);
    return result;
  }
}
