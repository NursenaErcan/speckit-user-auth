# Data Model: User Authentication System

## Entity: User
- Purpose: Represents a registered identity that can authenticate.
- Fields:
  - id (UUID, primary key)
  - email (string, unique, normalized lowercase)
  - passwordHash (string, bcrypt hash)
  - status (enum: ACTIVE, LOCKED, DISABLED)
  - createdAt (timestamp)
  - updatedAt (timestamp)
  - lastLoginAt (timestamp, nullable)
- Validation:
  - email must be valid format and unique.
  - passwordHash must never store plaintext credentials.
- Relationships:
  - 1:N with SessionRecord.
  - 1:N with PasswordResetToken.
  - 1:N with AuthAuditEvent.

## Entity: SessionRecord
- Purpose: Tracks issued JWT sessions for revocation and audit semantics.
- Fields:
  - id (UUID, primary key)
  - userId (UUID, foreign key -> User.id)
  - jwtId (string, unique token identifier claim)
  - issuedAt (timestamp)
  - expiresAt (timestamp, issuedAt + 24 hours)
  - revokedAt (timestamp, nullable)
  - revokedReason (enum: PASSWORD_RESET, MANUAL, SECURITY_EVENT, nullable)
  - sourceIp (string, nullable)
  - userAgent (string, nullable)
- Validation:
  - expiresAt must be exactly 24h after issuedAt for this feature.
  - revoked sessions are invalid regardless of expiry.

## Entity: PasswordResetToken
- Purpose: One-time credential reset artifact delivered via email.
- Fields:
  - id (UUID, primary key)
  - userId (UUID, foreign key -> User.id)
  - tokenHash (string, hashed reset token)
  - issuedAt (timestamp)
  - expiresAt (timestamp, issuedAt + 15 minutes)
  - usedAt (timestamp, nullable)
  - invalidatedAt (timestamp, nullable)
  - requestIp (string, nullable)
- Validation:
  - token is one-time use.
  - token older than 15 minutes must be rejected.
  - new reset request invalidates previous unused tokens for the user.

## Entity: AuthRateLimitBucket
- Purpose: Tracks throttling counters for authentication-sensitive endpoints.
- Fields:
  - id (UUID, primary key)
  - scopeType (enum: IP, ACCOUNT)
  - scopeKey (string, normalized IP or account identifier)
  - endpointType (enum: LOGIN, PASSWORD_RESET_REQUEST, PASSWORD_RESET_CONFIRM)
  - windowStart (timestamp)
  - attemptCount (integer)
  - blockedUntil (timestamp, nullable)
- Validation:
  - counters increment atomically.
  - blocks enforced when thresholds exceeded.

## Entity: AuthAuditEvent
- Purpose: Stores security-relevant events for traceability and incident response.
- Fields:
  - id (UUID, primary key)
  - userId (UUID, nullable, foreign key -> User.id)
  - eventType (enum: REGISTER_SUCCESS, LOGIN_SUCCESS, LOGIN_FAILURE, RESET_REQUESTED, RESET_COMPLETED, TOKEN_REJECTED, RATE_LIMITED)
  - occurredAt (timestamp)
  - sourceIp (string, nullable)
  - metadata (jsonb)
- Validation:
  - sensitive values (tokens, plaintext passwords) must never be logged.

## State Transitions

### User
- ACTIVE -> LOCKED: after policy-driven risk events (optional future policy).
- ACTIVE -> DISABLED: administrative action (out of scope to initiate in this feature).

### SessionRecord
- ISSUED (revokedAt null, now < expiresAt)
- EXPIRED (now >= expiresAt)
- REVOKED (revokedAt set)
- Transition rule: successful password reset revokes all ISSUED sessions for user.

### PasswordResetToken
- ISSUED -> USED when reset succeeds.
- ISSUED -> EXPIRED when now >= expiresAt.
- ISSUED -> INVALIDATED when a newer reset request is generated.
