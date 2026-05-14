# Quickstart: User Authentication System

## Prerequisites
- Node.js 20+
- PostgreSQL 15+
- npm

## 1. Configure environment
Create .env values for:
- DATABASE_URL
- JWT_SECRET
- JWT_ISSUER
- JWT_AUDIENCE
- BCRYPT_COST
- EMAIL_PROVIDER_API_KEY
- RATE_LIMIT_WINDOW_SECONDS
- RATE_LIMIT_MAX_ATTEMPTS

## 2. Install dependencies
```bash
npm install
```

## 3. Run database migrations
```bash
npm run db:migrate
```

## 4. Start service
```bash
npm run dev
```

## 5. Run tests
```bash
npm run test
npm run test:integration
npm run test:contract
npm run test:coverage
```

## 6. Validate key acceptance paths

### Register
- Call POST /auth/register with valid email + strong password.
- Expect success and created user identity.

### Login with JWT
- Call POST /auth/login with valid credentials.
- Expect JWT access token with 24-hour expiry claims.

### Password reset request
- Call POST /auth/password-reset/request with user email.
- Expect generic success response and reset email dispatch.

### Password reset confirm
- Call POST /auth/password-reset/confirm with reset token + new password.
- Expect password updated, token invalidated, and all active sessions revoked.

### Session expiry
- Access protected endpoint with expired token (>24h).
- Expect unauthorized response requiring re-authentication.

## 7. Coverage gate
- Ensure business-logic coverage remains >=80%.
- CI must fail if threshold is not met.

## 8. Operational docs
- Review docs/authentication.md before deployment and incident response drills.
