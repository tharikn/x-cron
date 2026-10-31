import { Module } from '@nestjs/common';
import { PaymentsModule } from '../payments/payments.module';
import { PreferencesModule } from '../preferences/preferences.module';
import { SeekerModule } from '../seeker/seeker.module';
import { AccountController } from './account.controller';
import { AccountService } from './account.service';

@Module({
  imports: [PaymentsModule, PreferencesModule, SeekerModule],
  controllers: [AccountController],
  providers: [AccountService],
})
export class AccountModule {}
