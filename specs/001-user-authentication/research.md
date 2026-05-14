# Research: User Authentication System

## Decision 1: Express.js + TypeScript strict mode for API service
- Decision: Use Express.js with TypeScript strict mode for REST endpoints and middleware.
- Rationale: Matches requested stack and provides broad ecosystem support with strong type guarantees when paired with strict compiler settings and runtime validation.
- Alternatives considered: Fastify (better raw throughput but not requested), NestJS (more framework overhead than needed for current scope).

## Decision 2: PostgreSQL for user and auth state persistence
- Decision: Persist users, password-reset artifacts, and session revocation metadata in PostgreSQL.
- Rationale: Strong relational integrity for identity constraints, transactional guarantees for sensitive state updates, and mature operational tooling.
- Alternatives considered: MongoDB (weaker relational constraints for this domain), in-memory store (insufficient durability/security).

## Decision 3: bcrypt for password hashing
- Decision: Use bcrypt with a configurable work factor for password hashing.
- Rationale: Explicitly requested and widely adopted for password storage with adaptive cost.
- Alternatives considered: Argon2 (strong option but not requested), PBKDF2 (available but less preferred for new systems).

## Decision 4: JWT access tokens only with 24-hour expiry
- Decision: Issue JWT access tokens with 24-hour expiration and no refresh token flow.
- Rationale: Aligns clarified requirement and simplifies token lifecycle while preserving explicit re-authentication boundary.
- Alternatives considered: Access+refresh token model (added complexity not selected), server-side opaque sessions (higher operational overhead for this requirement set).

## Decision 5: Password reset model and security controls
- Decision: Use one-time password reset tokens delivered by email, expiring in 15 minutes; invalidate all prior active sessions after successful reset.
- Rationale: Reduces account takeover risk and enforces rapid invalidation of potentially compromised sessions.
- Alternatives considered: Longer reset validity windows (higher exposure), preserving existing sessions (security risk after credential compromise).

## Decision 6: Rate limiting strategy
- Decision: Apply throttling by both IP address and account identifier on login and reset endpoints.
- Rationale: Balances abuse prevention for distributed attacks and targeted account abuse scenarios.
- Alternatives considered: IP-only limiting (weaker against shared proxies), account-only limiting (weaker against broad spray attempts).

## Decision 7: Testing strategy with Jest under Testing Pyramid
- Decision: Use Jest for unit and integration tests, with supertest for endpoint integration and contract validation against OpenAPI definitions.
- Rationale: Meets requested testing toolchain and constitution requirements for unit-heavy coverage and >=80% business-logic coverage.
- Alternatives considered: Mocha/Vitest (not requested), e2e-heavy strategy (slower feedback and reduced maintainability).

## Decision 8: Input validation and domain constraints
- Decision: Validate payloads at API boundaries and enforce domain rules for password policy, token lifetimes, and revocation checks.
- Rationale: Prevents invalid state transitions and keeps business rules centralized and testable.
- Alternatives considered: Controller-only ad-hoc checks (higher duplication and drift risk).
