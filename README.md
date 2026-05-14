# 🔐 SpecKit Authentication System

[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Express](https://img.shields.io/badge/Express-4.x-green.svg)](https://expressjs.com/)
[![Jest](https://img.shields.io/badge/Jest-29.x-red.svg)](https://jestjs.io/)
[![Coverage](https://img.shields.io/badge/Coverage-93%25-brightgreen.svg)](https://coveralls.io/)
[![SpecKit](https://img.shields.io/badge/SpecKit-2.0-purple.svg)](https://github.com/github/spec-kit)

A production-ready user authentication system built using **GitHub SpecKit** - demonstrating spec-driven development (SDD) methodology where specifications drive implementation, not just documentation.

## 📋 Table of Contents

- [Features](#features)
- [Tech Stack](#tech-stack)
- [SpecKit Workflow](#speckit-workflow)
- [Architecture](#architecture)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Testing](#testing)
- [Project Structure](#project-structure)
- [Security Features](#security-features)
- [SpecKit Artifacts](#speckit-artifacts)
- [Development](#development)
- [Deployment](#deployment)
- [Lessons Learned](#lessons-learned)

## ✨ Features

### Core Authentication
- ✅ User registration with email/password
- ✅ JWT-based authentication
- ✅ Password reset via email (1-hour expiry links)
- ✅ Session management (24-hour rolling expiry)

### Security
- ✅ Password hashing with bcrypt (12 rounds)
- ✅ Rate limiting (5 attempts/15 minutes)
- ✅ Password breach detection (HaveIBeenPwned API)
- ✅ Password policy enforcement (min 8 chars, complexity)
- ✅ Session revocation on password reset
- ✅ Email verification requirement

### Quality Assurance
- ✅ 93%+ test coverage (exceeds 80% constitution requirement)
- ✅ 22 test suites (unit, contract, integration)
- ✅ TypeScript strict mode
- ✅ ESLint + Prettier
- ✅ JSDoc documentation on all public APIs

## 🛠️ Tech Stack

| Category | Technology | Purpose |
|----------|-----------|---------|
| **Runtime** | Node.js + Express | API server |
| **Language** | TypeScript (strict mode) | Type safety |
| **Database** | PostgreSQL | Persistent storage |
| **Authentication** | JWT + bcrypt | Tokens + password hashing |
| **Testing** | Jest + Supertest | Unit, integration, contract tests |
| **Validation** | Zod | Request validation |
| **Email** | Nodemailer (pluggable) | Password reset emails |
| **Security** | Helmet + express-rate-limit | Security headers + rate limiting |

## 🔄 SpecKit Workflow

This project was built following the **spec-driven development** methodology using GitHub SpecKit:

```mermaid
graph LR
    A[Constitution] --> B[Specify]
    B --> C[Clarify]
    C --> D[Plan]
    D --> E[Tasks]
    E --> F[Implement]
    F --> G[Code]
    
    style A fill:#f9f,stroke:#333,stroke-width:2px
    style G fill:#9f9,stroke:#333,stroke-width:2px
