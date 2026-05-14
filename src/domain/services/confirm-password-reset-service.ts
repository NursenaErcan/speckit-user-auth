import { getPool } from "../../infra/db/postgres";
import { PasswordResetTokenRepository } from "../../infra/db/repositories/password-reset-token-repository";
import { UserRepository } from "../../infra/db/repositories/user-repository";
import { BcryptPasswordHasher } from "../../infra/crypto/bcrypt-password-hasher";
import { AuthAuditRepository } from "../../infra/db/repositories/auth-audit-repository";
import { isStrongPassword } from "./password-policy-service";
import { BreachedPasswordService } from "./breached-password-service";
import { AppError } from "../../shared/errors/app-error";

/** Completes password reset and revokes active sessions. */
export class ConfirmPasswordResetService {
  constructor(
    private readonly tokenRepository: PasswordResetTokenRepository,
    private readonly userRepository: UserRepository,
    private readonly hasher: BcryptPasswordHasher,
    private readonly auditRepository: AuthAuditRepository,
    private readonly breachedPasswordService: BreachedPasswordService
  ) {}

  async execute(rawToken: string, newPassword: string, sourceIp: string): Promise<void> {
    if (!isStrongPassword(newPassword)) {
      throw new AppError("WEAK_PASSWORD", 400);
    }

    if (await this.breachedPasswordService.isBreached(newPassword)) {
      throw new AppError("BREACHED_PASSWORD", 400);
    }

    const resetToken = await this.tokenRepository.findByRawToken(rawToken);
    if (!resetToken || resetToken.invalidatedAt || resetToken.usedAt) {
      throw new AppError("INVALID_RESET_TOKEN", 400);
    }

    if (resetToken.expiresAt.getTime() <= Date.now()) {
      throw new AppError("EXPIRED_RESET_TOKEN", 410);
    }

    const user = await getPool().query(`SELECT id FROM users WHERE id = $1`, [resetToken.userId]);
    if (!user.rowCount) {
      throw new AppError("INVALID_RESET_TOKEN", 400);
    }

    const passwordHash = await this.hasher.hash(newPassword);
    await getPool().query(`UPDATE users SET password_hash = $1, updated_at = NOW() WHERE id = $2`, [passwordHash, resetToken.userId]);
    await this.tokenRepository.markUsed(resetToken.id);

    await getPool().query(
      `UPDATE session_records
       SET revoked_at = NOW(), revoked_reason = 'PASSWORD_RESET'
       WHERE user_id = $1 AND revoked_at IS NULL AND expires_at > NOW()`,
      [resetToken.userId]
    );

    await this.auditRepository.write("RESET_COMPLETED", resetToken.userId, sourceIp, {});
  }
}
