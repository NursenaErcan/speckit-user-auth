import { logger } from "../../shared/logging/logger";
import { PasswordResetEmailService } from "../../domain/services/password-reset-email-service";

/** Logging adapter placeholder for outbound reset email dispatch. */
export class EmailProviderAdapter implements PasswordResetEmailService {
  async send(email: string, resetToken: string): Promise<void> {
    logger.info({ email, resetToken }, "Password reset email dispatch requested");
  }
}
