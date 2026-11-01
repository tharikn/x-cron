import { Global, Module } from '@nestjs/common';
import { AuthController, EmployersController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthStore } from './auth.store';
import { RolesGuard } from './roles.guard';

@Global()
@Module({
  controllers: [AuthController, EmployersController],
  providers: [AuthStore, AuthService, AuthGuard, RolesGuard],
  exports: [AuthStore, AuthService, AuthGuard, RolesGuard],
})
export class AuthModule {}
