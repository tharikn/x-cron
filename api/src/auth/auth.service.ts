import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { AuthStore } from './auth.store';
import {
  CreateEmployerDto,
  GoogleAuthDto,
  StartOtpDto,
  VerifyOtpDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  constructor(private readonly store: AuthStore) {}

  startOtp(dto: StartOtpDto) {
    if (dto.channel === 'email' && !dto.destination.includes('@')) {
      throw new BadRequestException('Valid email required');
    }
    if (dto.channel === 'phone' && dto.destination.replace(/\D/g, '').length < 10) {
      throw new BadRequestException('Valid phone required');
    }
    return this.store.startOtp({
      channel: dto.channel,
      destination: dto.destination,
      intendedRole: dto.intendedRole ?? 'seeker',
    });
  }

  verifyOtp(dto: VerifyOtpDto) {
    try {
      const { user, token } = this.store.verifyOtp(dto.challengeId, dto.code);
      return {
        token,
        user: this.store.toPublicUser(user),
        employer: this.store.getEmployerByOwner(user.id) ?? null,
      };
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'invalid_code';
      throw new UnauthorizedException(reason);
    }
  }

  me(token?: string) {
    const user = this.store.getUserByToken(token);
    if (!user) throw new UnauthorizedException('Sign-in required');
    return {
      user: this.store.toPublicUser(user),
      employer: this.store.getEmployerByOwner(user.id) ?? null,
    };
  }

  logout(token?: string) {
    if (token) this.store.logout(token);
    return { ok: true };
  }

  createEmployer(userId: string, dto: CreateEmployerDto) {
    const profile = this.store.createEmployer(userId, dto.name);
    const user = this.store.getUser(userId)!;
    return {
      employer: profile,
      user: this.store.toPublicUser(user),
    };
  }

  googleStub(_dto: GoogleAuthDto) {
    return {
      supported: false,
      message:
        'Google sign-in is optional and will be enabled after Google Identity setup. Use phone/email OTP for now.',
    };
  }

  requireUser(token?: string) {
    const user = this.store.getUserByToken(token);
    if (!user) throw new UnauthorizedException('Sign-in required');
    return user;
  }

  purgeUserRecord(userId: string, token?: string) {
    if (token) this.store.logout(token);
    return this.store.deleteUser(userId);
  }
}
