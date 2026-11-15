import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import {
  createPrivateKey,
  createPublicKey,
  createSign,
  generateKeyPairSync,
  randomBytes,
  timingSafeEqual,
  type KeyObject,
} from 'crypto';
import type { AuthUser } from '../auth/auth.types';

const CODE_TTL_MS = 60_000;
const TOKEN_TTL_S = 15 * 60;

interface CodeRecord {
  userId: string;
  roles: string[];
  redirectUri: string;
  nonce: string;
  expiresAt: number;
}

function b64url(input: Buffer | string): string {
  return Buffer.from(input).toString('base64url');
}

/**
 * Issues single-use handoff codes and short-lived, Resume-scoped JWTs (RS256)
 * for the standalone XCron CV service. Design: docs/resume-builder/39 §6.
 * Codes live in memory (single API instance); move to Redis before scaling out.
 */
@Injectable()
export class HandoffService {
  private readonly codes = new Map<string, CodeRecord>();
  private readonly privateKey: KeyObject;
  private readonly publicKey: KeyObject;
  readonly kid: string;

  constructor() {
    const pem = process.env.HANDOFF_PRIVATE_KEY_PEM?.replace(/\\n/g, '\n');
    if (pem) {
      this.privateKey = createPrivateKey(pem);
      this.publicKey = createPublicKey(this.privateKey);
    } else {
      if (process.env.NODE_ENV === 'production') {
        throw new Error('HANDOFF_PRIVATE_KEY_PEM is required in production');
      }
      const pair = generateKeyPairSync('rsa', { modulusLength: 2048 });
      this.privateKey = pair.privateKey;
      this.publicKey = pair.publicKey;
    }
    this.kid = process.env.HANDOFF_KEY_ID ?? 'xcron-handoff-1';
  }

  get issuer(): string {
    return process.env.HANDOFF_ISSUER ?? 'https://x-cron-api.onrender.com';
  }
  get audience(): string {
    return process.env.HANDOFF_AUDIENCE ?? 'xcroncv';
  }
  private get allowedRedirects(): string[] {
    return (process.env.HANDOFF_REDIRECT_URIS ?? 'http://localhost:4300/auth/callback')
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
  }

  jwks() {
    const jwk = this.publicKey.export({ format: 'jwk' });
    return { keys: [{ ...jwk, kid: this.kid, use: 'sig', alg: 'RS256' }] };
  }

  /** Step 1 (browser/app, signed-in user): mint a one-time code. */
  createCode(user: AuthUser, redirectUri: string, nonce: string): string {
    if (!this.allowedRedirects.includes(redirectUri)) {
      throw new BadRequestException('redirect_uri not registered');
    }
    this.sweep();
    const code = randomBytes(32).toString('base64url');
    this.codes.set(code, {
      userId: user.id,
      roles: user.roles,
      redirectUri,
      nonce,
      expiresAt: Date.now() + CODE_TTL_MS,
    });
    return code;
  }

  /** Step 2 (XCron CV API, server-to-server): burn the code for a JWT. */
  exchange(
    secretHeader: string | undefined,
    code: string,
    redirectUri: string,
    nonce: string,
  ) {
    this.assertExchangeSecret(secretHeader);
    const rec = this.codes.get(code);
    this.codes.delete(code); // single use, even on mismatch
    if (
      !rec ||
      rec.expiresAt < Date.now() ||
      rec.redirectUri !== redirectUri ||
      rec.nonce !== nonce
    ) {
      throw new UnauthorizedException('invalid_grant');
    }
    return {
      access_token: this.sign(rec),
      token_type: 'Bearer',
      expires_in: TOKEN_TTL_S,
    };
  }

  private assertExchangeSecret(header: string | undefined) {
    const expected = process.env.HANDOFF_EXCHANGE_SECRET;
    if (!expected || !header) throw new UnauthorizedException();
    const a = Buffer.from(header);
    const b = Buffer.from(expected);
    if (a.length !== b.length || !timingSafeEqual(a, b)) {
      throw new UnauthorizedException();
    }
  }

  private sign(rec: CodeRecord): string {
    const now = Math.floor(Date.now() / 1000);
    const header = b64url(
      JSON.stringify({ alg: 'RS256', typ: 'JWT', kid: this.kid }),
    );
    const payload = b64url(
      JSON.stringify({
        iss: this.issuer,
        sub: rec.userId,
        aud: this.audience,
        iat: now,
        exp: now + TOKEN_TTL_S,
        tenant_id: 'xcron',
        scope: 'resume',
        roles: rec.roles,
      }),
    );
    const sig = createSign('RSA-SHA256')
      .update(`${header}.${payload}`)
      .sign(this.privateKey);
    return `${header}.${payload}.${b64url(sig)}`;
  }

  private sweep() {
    const now = Date.now();
    for (const [k, v] of this.codes) {
      if (v.expiresAt < now) this.codes.delete(k);
    }
  }
}
