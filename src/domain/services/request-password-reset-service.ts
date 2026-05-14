import { randomUUID } from "crypto";
import { UserRepository } from "../../infra/db/repositories/user-repository";
import { PasswordResetTokenRepository } from "../../infra/db/repositories/password-reset-token-repository";
import { PasswordResetEmailService } from "./password-reset-email-service";
import { AuthAuditRepository } from "../../infra/db/repositories/auth-audit-repository";
import { RateLimitService } from "./rate-limit-service";
import { Email } from "../value-objects/email";
import { AppError } from "../../shared/errors/app-error";

/** Initiates password reset without leaking account existence. */
export class RequestPasswordResetService {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly tokenRepository: PasswordResetTokenRepository,
    private readonly emailService: PasswordResetEmailService,
    private readonly auditRepository: AuthAuditRepository,
    private readonly rateLimitService: RateLimitService
  ) {}

  async execute(emailRaw: string, sourceIp: string): Promise<void> {
    const email = new Email(emailRaw).value;

    if (await this.rateLimitService.isBlocked("PASSWORD_RESET_REQUEST", sourceIp, email)) {
      throw new AppError("RATE_LIMITED", 429);
    }

    const user = await this.userRepository.findByEmail(email);
    if (!user) {
      await this.rateLimitService.registerAttempt("PASSWORD_RESET_REQUEST", sourceIp, email);
      return;
    }

    const rawToken = randomUUID();
    await this.tokenRepository.create(user.id, rawToken, sourceIp);
    await this.emailService.send(email, rawToken);
    await this.auditRepository.write("RESET_REQUESTED", user.id, sourceIp, {});
  }
}
