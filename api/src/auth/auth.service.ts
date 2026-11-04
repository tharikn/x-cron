import {
  BadRequestException,
  ConflictException,
  Inject,
  Injectable,
  Logger,
  Optional,
  UnauthorizedException,
  forwardRef,
} from '@nestjs/common';
import type { Response } from 'express';
import { OAuth2Client } from 'google-auth-library';
import { NotificationsService } from '../notifications/notifications.service';
import {
  clearAuthCookies,
  setAuthCookies,
} from '../security/auth-cookies';
import { AuthStore } from './auth.store';
import {
  AdminLoginDto,
  CreateEmployerDto,
  GoogleAuthDto,
  LoginDto,
  RegisterDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly logger = new Logger(AuthService.name);
  private readonly googleClient = new OAuth2Client();

  constructor(
    private readonly store: AuthStore,
    @Optional()
    @Inject(forwardRef(() => NotificationsService))
    private readonly notifications?: NotificationsService,
  ) {}

  register(dto: RegisterDto, res: Response, tabId?: string) {
    if (dto.password !== dto.confirmPassword) {
      throw new BadRequestException('Passwords do not match');
    }
    try {
      const { user, token, refreshToken, expiresAt } =
        this.store.registerWithPassword(
          {
            username: dto.username,
            password: dto.password,
            intendedRole: dto.intendedRole ?? 'seeker',
          },
          { tabId },
        );
      this.attachSessionCookies(res, token, refreshToken);
      this.fireFirstLoginNotifications(user.id);
      return {
        token,
        refreshToken,
        expiresAt,
        user: this.store.toPublicUser(user),
        employer: this.store.getEmployerByOwner(user.id) ?? null,
      };
    } catch (error) {
      const reason = error instanceof Error ? error.message : 'register_failed';
      if (reason === 'username_taken') {
        throw new ConflictException('Username already taken');
      }
      if (reason === 'invalid_username' || reason === 'weak_password') {
        throw new BadRequestException(reason);
      }
      throw new BadRequestException(reason);
    }
  }

  login(dto: LoginDto, res: Response, tabId?: string) {
    try {
      const { user, token, refreshToken, expiresAt } =
        this.store.loginWithPassword(
          {
            username: dto.username,
            password: dto.password,
            intendedRole: dto.intendedRole ?? 'seeker',
          },
          { tabId },
        );
      this.attachSessionCookies(res, token, refreshToken);
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

  refresh(refreshToken: string | undefined, res: Response, tabId?: string) {
    const token = refreshToken?.trim();
    if (!token) {
      throw new UnauthorizedException('invalid_refresh_token');
    }
    try {
      const next = this.store.refreshSession(token, { tabId });
      this.attachSessionCookies(res, next.token, next.refreshToken);
      return next;
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

  logout(token: string | undefined, res: Response) {
    if (token) this.store.logout(token);
    clearAuthCookies(res);
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

  async google(dto: GoogleAuthDto, res: Response, tabId?: string) {
    const identity = await this.resolveGoogleIdentity(dto);
    try {
      const { user, token, refreshToken, expiresAt, isNewUser } =
        this.store.signInWithGoogle(
          {
            ...identity,
            intendedRole: dto.intendedRole ?? 'seeker',
          },
          { tabId },
        );
      this.attachSessionCookies(res, token, refreshToken);
      if (isNewUser) {
        this.fireFirstLoginNotifications(user.id);
      }
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

  /** Welcome + day-0 profile nudge after account creation (fire-and-forget). */
  private fireFirstLoginNotifications(userId: string) {
    if (!this.notifications) return;
    void this.notifications.onUserFirstLogin(userId).catch((err) => {
      this.logger.warn(
        `First-login notifications failed for ${userId}: ${
          err instanceof Error ? err.message : String(err)
        }`,
      );
    });
  }

  adminLogin(dto: AdminLoginDto, res: Response, tabId?: string) {
    try {
      const { user, token, refreshToken, expiresAt } =
        this.store.signInSuperAdmin(dto.email, dto.password, { tabId });
      this.attachSessionCookies(res, token, refreshToken);
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

  private attachSessionCookies(
    res: Response,
    token: string,
    refreshToken: string,
  ) {
    setAuthCookies(res, {
      token,
      refreshToken,
      accessMaxAgeSec: this.store.getAccessTtlSeconds(),
      refreshMaxAgeSec: this.store.getRefreshTtlSeconds(),
    });
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
