# Implementation Plan: User Authentication System

**Branch**: `001-user-authentication` | **Date**: 2026-05-15 | **Spec**: `specs/001-user-authentication/spec.md`

**Input**: Feature specification from `/specs/001-user-authentication/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/plan-template.md` for the execution workflow.

## Summary

Build an authentication subsystem that supports email/password registration, JWT-based login,
password reset through email, and strict 24-hour access-token session expiry with no refresh
tokens. The design uses Express.js + TypeScript for API delivery, PostgreSQL for persistence,
bcrypt for credential hashing, jsonwebtoken for token issuance/verification, and Jest for
Testing Pyramid-aligned automated tests with >=80% business-logic coverage.

## Technical Context

**Language/Version**: TypeScript (strict mode, ES2022 target) on Node.js 20 LTS

**Primary Dependencies**: Express.js, pg, bcrypt, jsonwebtoken, zod, pino

**Storage**: PostgreSQL 15+

**Testing**: Jest (unit + integration), supertest (API integration), contract checks from OpenAPI

**Target Platform**: Linux containerized web service

**Project Type**: Backend web-service (REST API)

**Performance Goals**:
- p95 login response < 2s under nominal load
- p95 registration response < 3s under nominal load
- Reset token validation/rejection at 100% for expired/reused tokens

**Constraints**:
- JWT access-token expiry fixed at 24h; no refresh tokens
- Reset tokens expire after 15 minutes
- Password policy: min 12 chars + upper/lower/number/symbol + breached-password rejection
- Rate limiting by both IP and account identifier on login/reset
- Revoke all active sessions on successful password reset

**Scale/Scope**:
- Initial rollout target up to 50k registered users
- Up to 100 auth requests/second burst handling
- Feature scope limited to authentication and password-recovery workflows

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

- Clean Code: PASS. Architecture separates route handlers, services, repositories, and
  security utilities with explicit domain naming.
- Type Safety: PASS. TypeScript `strict: true` and schema-driven input validation at boundaries.
- Testing Strategy: PASS. Unit-heavy suite plus integration and contract tests.
- Coverage Gate: PASS. CI enforces >=80% business-logic coverage threshold.
- Documentation: PASS. JSDoc mandated for exported and non-trivial internal logic.

## Project Structure

### Documentation (this feature)

```text
specs/001-user-authentication/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
src/
├── api/
│   ├── middlewares/
│   └── routes/
├── config/
├── domain/
│   ├── entities/
│   ├── services/
│   └── value-objects/
├── infra/
│   ├── crypto/
│   ├── db/
│   ├── email/
│   └── tokens/
└── shared/
    ├── errors/
    ├── logging/
    └── validation/

tests/
├── unit/
│   ├── domain/
│   └── shared/
├── integration/
│   └── auth/
├── contract/
└── fixtures/
```

**Structure Decision**: Single backend service structure selected. This layout keeps
authentication business logic isolated in `src/domain/services/`, infrastructure adapters in
`src/infra/`, and endpoint concerns in `src/api/` to preserve testability and clean boundaries.

## Complexity Tracking

No constitution violations identified.

| Violation | Why Needed | Simpler Alternative Rejected Because |
|-----------|------------|-------------------------------------|
| None | N/A | N/A |

## Phase Outputs

### Phase 0: Research
- Output: `specs/001-user-authentication/research.md`
- Result: All technical decisions resolved with rationale and alternatives.

### Phase 1: Design
- Output: `specs/001-user-authentication/data-model.md`
- Output: `specs/001-user-authentication/contracts/auth.openapi.yaml`
- Output: `specs/001-user-authentication/quickstart.md`
- Output: `.github/copilot-instructions.md` updated to point at this plan.

## Constitution Check (Post-Design Re-Check)

- Clean Code: PASS. Data model and API contract separate domain concerns from transport.
- Type Safety: PASS. TypeScript strict mode retained with explicit schema boundaries.
- Testing Strategy: PASS. Jest plan preserves unit-first pyramid with integration/contract tests.
- Coverage Gate: PASS. Coverage objective remains >=80% on business logic.
- Documentation: PASS. Plan includes JSDoc expectation in implementation and review.
