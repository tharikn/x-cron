# Module 02 — Authentication Implementation Prompt

## Goal

Implement secure password authentication now while providing a configurable OTP path that is disabled in the initial release.

## Configuration

Create centralized settings:

- AUTH_METHOD = PASSWORD
- OTP_ENABLED = false
- OTP_PROVIDER = configurable
- OTP_EXPIRY_SECONDS = configurable
- OTP_MAX_ATTEMPTS = configurable
- OTP_RESEND_COOLDOWN_SECONDS = configurable
- PASSWORD_MIN_LENGTH = configurable
- SESSION/JWT_EXPIRY = configurable

The application must behave as if OTP does not exist when OTP_ENABLED=false.

## Password authentication

Implement:
- registration
- login
- logout
- forgot password
- reset password
- change password
- refresh/session handling
- account lock/rate limiting
- suspicious-login audit events

Use a modern password hashing algorithm such as Argon2id or the existing approved equivalent.

Never:
- store plain passwords;
- return password hashes;
- log passwords, reset tokens or OTPs;
- reveal whether an email/mobile exists during password-reset requests.

## OTP design for future enablement

OTP must be an authentication strategy, not hard-coded into login controllers.

Interface concept:

```
AuthenticationStrategy
  PasswordAuthenticationStrategy
  OtpAuthenticationStrategy
```

When OTP_ENABLED=true:
- issue OTP;
- apply cooldown;
- limit attempts;
- expire OTP;
- invalidate old OTP;
- audit verification;
- prevent OTP enumeration/brute force.

When OTP_ENABLED=false:
- login must use username/mobile + password;
- OTP endpoints may return a controlled "feature disabled" response or remain internal.

## Session/security

Implement:
- short-lived access token/session;
- refresh-token rotation if JWT architecture is used;
- secure, HttpOnly, SameSite cookies where browser sessions are used;
- CSRF protection where cookie authentication is used;
- rate limiting by account and IP;
- brute-force protection;
- audit logging;
- logout/revocation.

## UI/UX

Login:
- Mobile/username
- Password
- Show/hide password
- Forgot password
- Register
- Clear error states

Do not show OTP UI in the normal login flow while disabled.

Registration:
- mobile
- password
- confirm password
- role selection

Password errors must be actionable but must not disclose security-sensitive information.

## Acceptance criteria

- Password login works end-to-end.
- OTP is disabled by configuration.
- Enabling OTP later requires configuration/provider setup, not a rewrite.
- Brute-force and rate-limit tests exist.
- Reset-password flow is secure.
- Authentication events are auditable.
