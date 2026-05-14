# Authentication Runbook

## Overview
This service implements email/password registration, JWT login, password reset, and session validation with 24-hour access-token expiry.

## Security Controls
- Password policy: minimum 12 chars with upper/lower/number/symbol.
- Breached-password check enforced during registration/reset.
- Password reset token expires after 15 minutes.
- All active sessions are revoked after successful password reset.
- Rate limits apply by IP and account identifier.

## Operational Checks
- Verify DATABASE_URL and JWT_* env variables before startup.
- Run migrations before service startup.
- Monitor auth audit events for repeated failures and throttling.

## Troubleshooting
- 401 responses on session validation can be caused by token expiry/revocation.
- 429 responses indicate throttling by rate-limit policy.
