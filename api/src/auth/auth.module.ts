import { Global, Module } from '@nestjs/common';
import { AuthController, EmployersController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthStore } from './auth.store';

@Global()
@Module({
  controllers: [AuthController, EmployersController],
  providers: [AuthStore, AuthService, AuthGuard],
  exports: [AuthStore, AuthService, AuthGuard],
})
export class AuthModule {}
