<!--
Sync Impact Report
- Version change: template placeholder -> 1.0.0
- Modified principles:
	- Principle 1 placeholder -> I. Clean Code First
	- Principle 2 placeholder -> II. TypeScript Strict Mode Required
	- Principle 3 placeholder -> III. Testing Pyramid Enforcement
	- Principle 4 placeholder -> IV. Business Logic Coverage Floor
	- Principle 5 placeholder -> V. JSDoc Documentation Required
- Added sections:
	- Engineering Standards
	- Delivery Workflow & Quality Gates
- Removed sections:
	- None
- Templates requiring updates:
	- .specify/templates/plan-template.md: ✅ updated
	- .specify/templates/spec-template.md: ✅ updated
	- .specify/templates/tasks-template.md: ✅ updated
	- .specify/templates/constitution-template.md: ⚠ pending (generic scaffold intentionally unchanged)
- Follow-up TODOs:
	- None
-->

# Speckit Lab Constitution

## Core Principles

### I. Clean Code First
All production code MUST be easy to read, modular, and intentionally simple. Functions and
classes MUST have a single responsibility, names MUST reflect domain intent, and dead code or
unused abstractions MUST NOT be merged. Refactoring to maintain clarity is required whenever
feature delivery introduces complexity.

Rationale: Maintainability is a product requirement; unreadable code increases defect rate and
delivery cost.

### II. TypeScript Strict Mode Required
All TypeScript projects in this repository MUST compile with `strict: true` and MUST NOT weaken
type-safety via broad `any`, unchecked casts, or disabled strict flags. New code MUST use
explicit domain types, exhaustive handling for discriminated unions where applicable, and
runtime validation at boundaries.

Rationale: Strict typing prevents entire classes of runtime defects and improves change safety.

### III. Testing Pyramid Enforcement
Tests MUST follow the Testing Pyramid: many unit tests, fewer integration tests, and minimal
end-to-end tests. Business logic changes MUST include corresponding unit tests first, with
integration tests covering cross-module contracts and external boundaries.

Rationale: The pyramid provides high confidence with fast feedback and sustainable test
execution time.

### IV. Business Logic Coverage Floor
Business logic MUST maintain at least 80% automated test coverage at all times. Coverage is
measured on business-domain modules (services, use cases, domain rules) and MUST be enforced in
CI quality gates. Pull requests that reduce business-logic coverage below 80% MUST NOT be
approved without a documented, time-bound exception.

Rationale: Coverage thresholds protect critical behavior from silent regressions.

### V. JSDoc Documentation Required
All production code units (public functions, classes, interfaces, type aliases, and non-trivial
internal functions) MUST include JSDoc comments describing purpose, parameters, return values,
and side effects where relevant. JSDoc MUST stay synchronized with implementation changes.

Rationale: Accurate code-level documentation speeds onboarding, review, and long-term ownership.

## Engineering Standards

- Tooling MUST include linting, formatting, and type-checking in local development and CI.
- Architecture decisions MUST prefer composable modules over monolith files.
- Exceptions to constitutional principles MUST be documented in the feature plan under
	complexity tracking and approved during review.

## Delivery Workflow & Quality Gates

- Every feature plan MUST include a Constitution Check covering clean code, strict TypeScript,
	testing strategy, coverage impact, and JSDoc updates.
- Every task list MUST include test tasks for business logic and must identify where coverage is
	validated.
- Code review MUST verify principle compliance before merge approval.
- CI MUST fail on type-check errors, failing tests, missing coverage threshold, or broken lint
	baselines.

## Governance

This constitution overrides local conventions when conflicts occur. Amendments require: (1) a
written proposal, (2) explicit update to affected templates, and (3) approval by project
maintainers. Versioning follows semantic rules: MAJOR for incompatible governance changes, MINOR
for new principles or sections, PATCH for clarifications.

Compliance is verified in planning, task generation, pull-request review, and CI checks.

**Version**: 1.0.0 | **Ratified**: 2026-05-15 | **Last Amended**: 2026-05-15
