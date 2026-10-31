import { Injectable } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';
import { PaymentsService } from '../payments/payments.service';
import { PreferencesService } from '../preferences/preferences.service';
import { SeekerService } from '../seeker/seeker.service';

@Injectable()
export class AccountService {
  constructor(
    private readonly auth: AuthService,
    private readonly payments: PaymentsService,
    private readonly preferences: PreferencesService,
    private readonly seeker: SeekerService,
  ) {}

  deleteAccount(token?: string) {
    const user = this.auth.requireUser(token);
    this.payments.wipeUser(user.id);
    this.preferences.clearForUser(user);
    this.seeker.clearUser(user.id);
    this.auth.purgeUserRecord(user.id, token);
    return {
      ok: true,
      message: 'Account and associated entitlements/preferences were deleted.',
    };
  }
}
