import { createPublicKey, createVerify } from 'crypto';
import type { AuthUser } from '../auth/auth.types';
import { HandoffService } from './handoff.service';

const REDIRECT = 'http://localhost:4300/auth/callback';
const NONCE = 'n'.repeat(24);
const SECRET = 'secret-secret-secret';
const user = { id: 'u1', roles: ['seeker'] } as AuthUser;

describe('HandoffService', () => {
  beforeEach(() => {
    process.env.HANDOFF_EXCHANGE_SECRET = SECRET;
    process.env.HANDOFF_REDIRECT_URIS = REDIRECT;
  });

  it('issues a verifiable RS256 token for a valid code, once', () => {
    const svc = new HandoffService();
    const code = svc.createCode(user, REDIRECT, NONCE);
    const res = svc.exchange(SECRET, code, REDIRECT, NONCE);
    const [h, p, s] = res.access_token.split('.');
    const jwk = svc.jwks().keys[0];
    const ok = createVerify('RSA-SHA256')
      .update(`${h}.${p}`)
      .verify(
        createPublicKey({ key: jwk as never, format: 'jwk' }),
        Buffer.from(s, 'base64url'),
      );
    expect(ok).toBe(true);
    const claims = JSON.parse(Buffer.from(p, 'base64url').toString());
    expect(claims).toMatchObject({ sub: 'u1', aud: 'xcroncv', scope: 'resume' });
    expect(() => svc.exchange(SECRET, code, REDIRECT, NONCE)).toThrow();
  });

  it('rejects unregistered redirects, wrong nonce and wrong secret', () => {
    const svc = new HandoffService();
    expect(() => svc.createCode(user, 'https://evil.example/cb', NONCE)).toThrow();
    const code = svc.createCode(user, REDIRECT, NONCE);
    expect(() =>
      svc.exchange(SECRET, code, REDIRECT, 'x'.repeat(24)),
    ).toThrow();
    const code2 = svc.createCode(user, REDIRECT, NONCE);
    expect(() => svc.exchange('bad', code2, REDIRECT, NONCE)).toThrow();
  });
});
