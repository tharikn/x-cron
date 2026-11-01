import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { OAuth2Client } from 'google-auth-library';
import { AuthStore } from './auth.store';
import {
  AdminLoginDto,
  CreateEmployerDto,
  GoogleAuthDto,
  RefreshTokenDto,
  StartOtpDto,
  VerifyOtpDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly googleClient = new OAuth2Client();

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
      const { user, token, refreshToken, expiresAt } = this.store.verifyOtp(
        dto.challengeId,
        dto.code,
      );
      return {
        token,
        refreshToken,
        expiresAt,
        user: this.store.toPublicUser(user),
        employer: this.store.getEmployerByOwner(user.id) ?? null,
      };
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'invalid_code';
      throw new UnauthorizedException(reason);
    }
  }

  refresh(dto: RefreshTokenDto) {
    try {
      return this.store.refreshSession(dto.refreshToken.trim());
    } catch (error) {
      const reason =
        error instanceof Error ? error.message : 'invalid_refresh_token';
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

  async google(dto: GoogleAuthDto) {
    const identity = await this.resolveGoogleIdentity(dto);
    try {
      const { user, token, refreshToken, expiresAt } =
        this.store.signInWithGoogle(identity);
      return {
        token,
        refreshToken,
        expiresAt,
        user: this.store.toPublicUser(user),
        employer: this.store.getEmployerByOwner(user.id) ?? null,
      };
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'google_auth_failed';
      throw new UnauthorizedException(reason);
    }
  }

  adminLogin(dto: AdminLoginDto) {
    try {
      const { user, token, refreshToken, expiresAt } =
        this.store.signInSuperAdmin(dto.email, dto.password);
      return {
        token,
        refreshToken,
        expiresAt,
        user: this.store.toPublicUser(user),
        employer: this.store.getEmployerByOwner(user.id) ?? null,
      };
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'invalid_credentials';
      throw new UnauthorizedException(reason);
    }
  }

  private async resolveGoogleIdentity(dto: GoogleAuthDto): Promise<{
    email: string;
    displayName?: string;
  }> {
    if (dto.idToken?.trim()) {
      const payload = await this.verifyGoogleIdToken(dto.idToken.trim());
      if (!payload.email) {
        throw new BadRequestException('Google token missing email');
      }
      return {
        email: payload.email,
        displayName: payload.name || dto.displayName,
      };
    }

    const stubAllowed =
      (process.env.AUTH_GOOGLE_STUB ?? '1') === '1' &&
      (process.env.NODE_ENV ?? 'development') !== 'production';
    if (!stubAllowed || !dto.email?.trim()) {
      throw new BadRequestException(
        'Google idToken required (or AUTH_GOOGLE_STUB email in development)',
      );
    }
    return {
      email: dto.email.trim(),
      displayName: dto.displayName,
    };
  }

  private async verifyGoogleIdToken(idToken: string): Promise<{
    email?: string;
    name?: string;
  }> {
    const audiences = this.googleAudiences();
    if (!audiences.length) {
      // Local/dev without GOOGLE_CLIENT_ID: decode only (never use in production).
      if ((process.env.NODE_ENV ?? 'development') === 'production') {
        throw new UnauthorizedException('GOOGLE_CLIENT_ID not configured');
      }
      return this.decodeGoogleIdToken(idToken);
    }

    try {
      const ticket = await this.googleClient.verifyIdToken({
        idToken,
        audience: audiences.length === 1 ? audiences[0] : audiences,
      });
      const payload = ticket.getPayload();
      if (!payload) {
        throw new UnauthorizedException('invalid_google_token');
      }
      if (payload.email_verified === false) {
        throw new UnauthorizedException('google_email_unverified');
      }
      return {
        email: payload.email,
        name: payload.name,
      };
    } catch (error) {
      if (
        error instanceof UnauthorizedException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new UnauthorizedException('invalid_google_token');
    }
  }

  private googleAudiences(): string[] {
    const raw =
      process.env.GOOGLE_CLIENT_IDS?.trim() ||
      process.env.GOOGLE_CLIENT_ID?.trim() ||
      '';
    return raw
      .split(',')
      .map((v) => v.trim())
      .filter(Boolean);
  }

  private decodeGoogleIdToken(idToken: string): {
    email?: string;
    name?: string;
  } {
    const parts = idToken.split('.');
    if (parts.length < 2) {
      throw new BadRequestException('Malformed Google idToken');
    }
    try {
      const json = Buffer.from(parts[1], 'base64url').toString('utf8');
      return JSON.parse(json) as { email?: string; name?: string };
    } catch {
      throw new BadRequestException('Could not decode Google idToken');
    }
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
