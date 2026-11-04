import { Global, Module, forwardRef } from '@nestjs/common';
import { NotificationsModule } from '../notifications/notifications.module';
import { AuthController, EmployersController } from './auth.controller';
import { AuthGuard } from './auth.guard';
import { AuthService } from './auth.service';
import { AuthStore } from './auth.store';
import { RolesGuard } from './roles.guard';

@Global()
@Module({
  imports: [forwardRef(() => NotificationsModule)],
  controllers: [AuthController, EmployersController],
  providers: [AuthStore, AuthService, AuthGuard, RolesGuard],
  exports: [AuthStore, AuthService, AuthGuard, RolesGuard],
})
export class AuthModule {}
