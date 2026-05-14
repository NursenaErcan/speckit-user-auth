import { Router } from "express";
import { z } from "zod";
import { validateBody } from "../../shared/validation/request-validator";
import { UserRepository } from "../../infra/db/repositories/user-repository";
import { PasswordResetTokenRepository } from "../../infra/db/repositories/password-reset-token-repository";
import { EmailProviderAdapter } from "../../infra/email/email-provider-adapter";
import { AuthAuditRepository } from "../../infra/db/repositories/auth-audit-repository";
import { RateLimitService } from "../../domain/services/rate-limit-service";
import { RequestPasswordResetService } from "../../domain/services/request-password-reset-service";
import { ConfirmPasswordResetService } from "../../domain/services/confirm-password-reset-service";
import { BcryptPasswordHasher } from "../../infra/crypto/bcrypt-password-hasher";
import { BreachedPasswordAdapter } from "../../infra/crypto/breached-password-adapter";

export const passwordResetRoutes = Router();

const requestSchema = z.object({ email: z.string().email() });
const confirmSchema = z.object({ resetToken: z.string().min(1), newPassword: z.string().min(12) });

const userRepository = new UserRepository();
const tokenRepository = new PasswordResetTokenRepository();
const emailService = new EmailProviderAdapter();
const auditRepository = new AuthAuditRepository();
const rateLimitService = new RateLimitService();
const hasher = new BcryptPasswordHasher();
const breachedPasswordService = new BreachedPasswordAdapter();

const requestService = new RequestPasswordResetService(
  userRepository,
  tokenRepository,
  emailService,
  auditRepository,
  rateLimitService
);

const confirmService = new ConfirmPasswordResetService(
  tokenRepository,
  userRepository,
  hasher,
  auditRepository,
  breachedPasswordService
);

passwordResetRoutes.post("/password-reset/request", validateBody(requestSchema), async (req, res, next) => {
  try {
    await requestService.execute(req.body.email, req.ip ?? "unknown");
    res.status(202).json({ status: "accepted" });
  } catch (error) {
    next(error);
  }
});

passwordResetRoutes.post("/password-reset/confirm", validateBody(confirmSchema), async (req, res, next) => {
  try {
    await confirmService.execute(req.body.resetToken, req.body.newPassword, req.ip ?? "unknown");
    res.status(200).json({ status: "password_reset" });
  } catch (error) {
    next(error);
  }
});
