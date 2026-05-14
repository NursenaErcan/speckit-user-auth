import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../../shared/validation/request-validator";
import { UserRepository } from "../../infra/db/repositories/user-repository";
import { BcryptPasswordHasher } from "../../infra/crypto/bcrypt-password-hasher";
import { AuthAuditRepository } from "../../infra/db/repositories/auth-audit-repository";
import { BreachedPasswordAdapter } from "../../infra/crypto/breached-password-adapter";
import { RegisterUserService } from "../../domain/services/register-user-service";
import { LoginUserService } from "../../domain/services/login-user-service";
import { JwtTokenService } from "../../infra/tokens/jwt-token-service";
import { RateLimitService } from "../../domain/services/rate-limit-service";
import { SessionRecordRepository } from "../../infra/db/repositories/session-record-repository";

const registerSchema = z.object({
  email: z.string().email(),
  password: z.string().min(12)
});

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1)
});

export const authRoutes = Router();

const userRepository = new UserRepository();
const hasher = new BcryptPasswordHasher();
const auditRepository = new AuthAuditRepository();
const breachedPasswordService = new BreachedPasswordAdapter();
const tokenService = new JwtTokenService();
const rateLimitService = new RateLimitService();
const sessionRepository = new SessionRecordRepository();

const registerUserService = new RegisterUserService(
  userRepository,
  hasher,
  auditRepository,
  breachedPasswordService
);

const loginUserService = new LoginUserService(
  userRepository,
  hasher,
  tokenService,
  auditRepository,
  rateLimitService,
  sessionRepository
);

/** Registers a new user account with email/password credentials. */
authRoutes.post("/register", validateBody(registerSchema), async (req, res, next) => {
  try {
    const result = await registerUserService.execute({
      email: req.body.email,
      password: req.body.password,
      sourceIp: req.ip ?? null
    });
    res.status(201).json(result);
  } catch (error) {
    next(error);
  }
});

/** Authenticates a user and returns a 24-hour access token. */
authRoutes.post("/login", validateBody(loginSchema), async (req, res, next) => {
  try {
    const result = await loginUserService.execute({
      email: req.body.email,
      password: req.body.password,
      sourceIp: req.ip ?? "unknown"
    });
    res.status(200).json(result);
  } catch (error) {
    next(error);
  }
});
