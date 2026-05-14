---

description: "Task list for user authentication feature implementation"
---

# Tasks: User Authentication System

**Input**: Design documents from `/specs/001-user-authentication/`

**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Test tasks are REQUIRED for business logic changes. Include unit/integration/contract coverage according to the Testing Pyramid and enforce >=80% business-logic coverage.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3)
- Include exact file paths in descriptions

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and baseline engineering configuration

- [X] T001 Initialize Node.js + TypeScript project scaffolding and scripts in package.json and tsconfig.json
- [X] T002 [P] Add core dependencies (express, pg, bcrypt, jsonwebtoken, zod, pino) in package.json
- [X] T003 [P] Add testing dependencies (jest, ts-jest, supertest, @types/*) and test scripts in package.json
- [X] T004 [P] Configure Jest projects for unit/integration/contract suites in jest.config.ts
- [X] T005 [P] Configure linting/formatting and TypeScript strict checks in .eslintrc.cjs and tsconfig.json
- [X] T006 Create source and test directory structure from plan in src/ and tests/
- [X] T007 [P] Add environment template and config loader for auth settings in .env.example and src/config/env.ts

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [X] T008 Create PostgreSQL migration baseline for auth entities in src/infra/db/migrations/001_auth_schema.sql
- [X] T009 [P] Implement PostgreSQL connection and repository base utilities in src/infra/db/postgres.ts
- [X] T010 [P] Implement shared request validation helpers (zod wrappers) in src/shared/validation/request-validator.ts
- [X] T011 [P] Implement shared error model and HTTP mapper in src/shared/errors/app-error.ts and src/api/middlewares/error-handler.ts
- [X] T012 [P] Implement structured logging setup in src/shared/logging/logger.ts
- [X] T013 [P] Implement auth audit event repository and writer in src/infra/db/repositories/auth-audit-repository.ts
- [X] T014 [P] Implement JWT token service with 24h expiry and jti support in src/infra/tokens/jwt-token-service.ts
- [X] T015 [P] Implement bcrypt password hasher adapter in src/infra/crypto/bcrypt-password-hasher.ts
- [X] T016 [P] Implement rate limit repository/service for IP+account scopes in src/domain/services/rate-limit-service.ts
- [X] T017 [P] Implement auth middleware for bearer token validation and revocation checks in src/api/middlewares/auth-middleware.ts
- [X] T018 Wire Express app bootstrap, middleware stack, and route registration in src/api/app.ts and src/index.ts

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Register and Log In Securely (Priority: P1) 🎯 MVP

**Goal**: Users can register with email/password and authenticate to receive 24-hour JWT access tokens.

**Independent Test**: Register a new user and log in with valid credentials; verify JWT token with 24-hour expiry and failed login handling.

### Tests for User Story 1 (REQUIRED) ⚠️

> **NOTE: Write these tests FIRST, ensure they FAIL before implementation**

- [X] T019 [P] [US1] Add contract test for POST /auth/register in tests/contract/auth/register.contract.test.ts
- [X] T020 [P] [US1] Add contract test for POST /auth/login in tests/contract/auth/login.contract.test.ts
- [X] T021 [P] [US1] Add integration test for register+login happy path in tests/integration/auth/register-login.integration.test.ts
- [X] T022 [P] [US1] Add integration test for invalid credentials and duplicate email in tests/integration/auth/login-failures.integration.test.ts
- [X] T023 [P] [US1] Add unit tests for password policy and breached-password rejection in tests/unit/domain/password-policy.service.test.ts
- [X] T024 [P] [US1] Add unit tests for token issuance expiry claims in tests/unit/infra/jwt-token-service.test.ts

### Implementation for User Story 1

- [X] T025 [P] [US1] Implement User entity and value objects in src/domain/entities/user.ts and src/domain/value-objects/email.ts
- [X] T026 [P] [US1] Implement User repository for create/find operations in src/infra/db/repositories/user-repository.ts
- [X] T027 [P] [US1] Implement breached-password checker port and adapter in src/domain/services/breached-password-service.ts and src/infra/crypto/breached-password-adapter.ts
- [X] T028 [US1] Implement registration domain service in src/domain/services/register-user-service.ts
- [X] T029 [US1] Implement login domain service with rate-limit checks in src/domain/services/login-user-service.ts
- [X] T030 [US1] Implement /auth/register and /auth/login handlers in src/api/routes/auth-routes.ts
- [X] T031 [US1] Emit auth audit events for register/login outcomes in src/domain/services/register-user-service.ts and src/domain/services/login-user-service.ts
- [X] T032 [US1] Add or update JSDoc for US1 production code units in src/domain/services/register-user-service.ts and src/domain/services/login-user-service.ts
- [X] T033 [US1] Validate business-logic coverage threshold (>=80%) for US1 modules using npm run test:coverage

**Checkpoint**: User Story 1 should be fully functional and independently testable

---

## Phase 4: User Story 2 - Reset Forgotten Password (Priority: P2)

**Goal**: Users can request and confirm password reset via email using one-time 15-minute reset tokens.

**Independent Test**: Request reset for an account, complete reset with valid token, verify invalid/expired/reused token rejection and session revocation.

### Tests for User Story 2 (REQUIRED) ⚠️

- [X] T034 [P] [US2] Add contract test for POST /auth/password-reset/request in tests/contract/auth/password-reset-request.contract.test.ts
- [X] T035 [P] [US2] Add contract test for POST /auth/password-reset/confirm in tests/contract/auth/password-reset-confirm.contract.test.ts
- [X] T036 [P] [US2] Add integration test for password reset success flow in tests/integration/auth/password-reset-success.integration.test.ts
- [X] T037 [P] [US2] Add integration test for expired/reused reset token rejection in tests/integration/auth/password-reset-token-failures.integration.test.ts
- [X] T038 [P] [US2] Add unit tests for reset token lifecycle rules (15m expiry, one-time use) in tests/unit/domain/password-reset-token.service.test.ts

### Implementation for User Story 2

- [X] T039 [P] [US2] Implement PasswordResetToken entity in src/domain/entities/password-reset-token.ts
- [X] T040 [P] [US2] Implement PasswordResetToken repository in src/infra/db/repositories/password-reset-token-repository.ts
- [X] T041 [P] [US2] Implement email sender port/adapter for reset delivery in src/domain/services/password-reset-email-service.ts and src/infra/email/email-provider-adapter.ts
- [X] T042 [US2] Implement request-password-reset service in src/domain/services/request-password-reset-service.ts
- [X] T043 [US2] Implement confirm-password-reset service with session revocation in src/domain/services/confirm-password-reset-service.ts
- [X] T044 [US2] Implement /auth/password-reset/request and /auth/password-reset/confirm handlers in src/api/routes/password-reset-routes.ts
- [X] T045 [US2] Add revocation event logging for reset completion in src/domain/services/confirm-password-reset-service.ts
- [X] T046 [US2] Add or update JSDoc for US2 production code units in src/domain/services/request-password-reset-service.ts and src/domain/services/confirm-password-reset-service.ts
- [X] T047 [US2] Validate business-logic coverage threshold (>=80%) for reset modules using npm run test:coverage

**Checkpoint**: User Stories 1 and 2 should both work independently

---

## Phase 5: User Story 3 - Enforce 24-Hour Session Expiry (Priority: P3)

**Goal**: Session validation consistently accepts active tokens and rejects expired or revoked tokens.

**Independent Test**: Validate protected route access succeeds before expiry and fails after expiry or revocation, requiring re-authentication.

### Tests for User Story 3 (REQUIRED) ⚠️

- [X] T048 [P] [US3] Add contract test for GET /auth/session/validate in tests/contract/auth/session-validate.contract.test.ts
- [X] T049 [P] [US3] Add integration test for token expiry enforcement in tests/integration/auth/session-expiry.integration.test.ts
- [X] T050 [P] [US3] Add integration test for revoked-session rejection in tests/integration/auth/session-revoked.integration.test.ts
- [X] T051 [P] [US3] Add unit tests for session validation decision logic in tests/unit/domain/session-validation.service.test.ts

### Implementation for User Story 3

- [X] T052 [P] [US3] Implement SessionRecord entity in src/domain/entities/session-record.ts
- [X] T053 [P] [US3] Implement SessionRecord repository in src/infra/db/repositories/session-record-repository.ts
- [X] T054 [US3] Implement session validation service in src/domain/services/validate-session-service.ts
- [X] T055 [US3] Implement /auth/session/validate handler in src/api/routes/session-routes.ts
- [X] T056 [US3] Ensure auth middleware rejects expired/revoked sessions consistently in src/api/middlewares/auth-middleware.ts
- [X] T057 [US3] Add or update JSDoc for US3 production code units in src/domain/services/validate-session-service.ts and src/api/middlewares/auth-middleware.ts
- [X] T058 [US3] Validate business-logic coverage threshold (>=80%) for session modules using npm run test:coverage

**Checkpoint**: All user stories should now be independently functional

---

## Phase 6: Polish & Cross-Cutting Concerns

**Purpose**: Improvements and quality gates affecting multiple user stories

- [X] T059 [P] Add OpenAPI contract consistency checks in tests/contract/auth/openapi-contract-consistency.test.ts
- [X] T060 Harden security error responses and non-enumerating messages in src/api/routes/auth-routes.ts and src/api/routes/password-reset-routes.ts
- [X] T061 [P] Add performance-focused integration scenarios for login/register latency budgets in tests/integration/auth/auth-performance.integration.test.ts
- [X] T062 [P] Update feature documentation and operational runbook in specs/001-user-authentication/quickstart.md and docs/authentication.md
- [ ] T063 Run full quickstart validation sequence and capture results in specs/001-user-authentication/checklists/requirements.md
- [X] T064 Run full CI-equivalent checks (lint, typecheck, tests, coverage) via npm scripts in package.json

---

## Dependencies & Execution Order

### Phase Dependencies

- **Phase 1 (Setup)**: No dependencies - starts immediately.
- **Phase 2 (Foundational)**: Depends on Phase 1 completion - blocks all user stories.
- **Phase 3+ (User Stories)**: Depend on Phase 2 completion.
- **Phase 6 (Polish)**: Depends on completion of all targeted user stories.

### User Story Dependencies

- **US1 (P1)**: Starts after Foundational - no dependency on other stories.
- **US2 (P2)**: Starts after Foundational - depends on shared auth foundations and user repository from US1 outputs.
- **US3 (P3)**: Starts after Foundational - depends on session data and middleware behaviors established by US1/US2.

### Within Each User Story

- Tests MUST be written first and fail before implementation.
- Entities/repositories before services.
- Services before routes/middleware wiring.
- Story-specific JSDoc and coverage validation complete story closure.

### Parallel Opportunities

- Setup tasks marked [P] are parallelizable.
- Foundational tasks marked [P] can run concurrently after DB schema baseline exists.
- Contract and integration tests within each story marked [P] can run concurrently.
- Entity/repository tasks marked [P] can be split across team members.

---

## Parallel Example: User Story 1

```bash
# Launch contract tests in parallel:
Task: "T019 [US1] Contract test for POST /auth/register in tests/contract/auth/register.contract.test.ts"
Task: "T020 [US1] Contract test for POST /auth/login in tests/contract/auth/login.contract.test.ts"

# Launch model/repository work in parallel:
Task: "T025 [US1] Implement User entity and value objects in src/domain/entities/user.ts and src/domain/value-objects/email.ts"
Task: "T026 [US1] Implement User repository for create/find operations in src/infra/db/repositories/user-repository.ts"
```

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup
2. Complete Phase 2: Foundational (CRITICAL)
3. Complete Phase 3: User Story 1
4. STOP and validate registration/login plus 24-hour token behavior
5. Demo/deploy MVP if ready

### Incremental Delivery

1. Finish Setup + Foundational
2. Deliver US1 and validate independently
3. Deliver US2 and validate reset and revocation flows
4. Deliver US3 and validate session expiry/revocation enforcement
5. Execute Polish phase and release

### Parallel Team Strategy

1. Team handles Setup + Foundational first
2. Post-foundation split:
   - Engineer A: US1
   - Engineer B: US2
   - Engineer C: US3
3. Rejoin for cross-cutting hardening and CI gates

---

## Notes

- [P] tasks indicate no direct dependency on another unfinished task.
- [USx] labels map tasks to user stories for independent delivery.
- Every task includes explicit file paths for direct execution.
- Keep code changes aligned with strict TypeScript, JSDoc, and >=80% business-logic coverage requirements.
