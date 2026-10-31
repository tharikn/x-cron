import { Controller, Delete } from '@nestjs/common';
import { AccessToken } from '../auth/decorators';
import { AccountService } from './account.service';

@Controller('v1')
export class AccountController {
  constructor(private readonly accountService: AccountService) {}

  @Delete('me')
  deleteMe(@AccessToken() token?: string) {
    return this.accountService.deleteAccount(token);
  }

  @Delete('auth/me')
  deleteAuthMe(@AccessToken() token?: string) {
    return this.accountService.deleteAccount(token);
  }
}
