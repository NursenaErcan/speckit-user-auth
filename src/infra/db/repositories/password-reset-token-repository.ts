import { createHash, randomUUID } from "crypto";
import { getPool } from "../postgres";
import { PasswordResetToken } from "../../../domain/entities/password-reset-token";

/** PostgreSQL repository for password-reset token lifecycle management. */
export class PasswordResetTokenRepository {
  async create(userId: string, rawToken: string, requestIp: string | null): Promise<PasswordResetToken> {
    const id = randomUUID();
    const issuedAt = new Date();
    const expiresAt = new Date(issuedAt.getTime() + 15 * 60 * 1000);
    const tokenHash = this.hash(rawToken);

    await getPool().query(
      `UPDATE password_reset_tokens SET invalidated_at = NOW()
       WHERE user_id = $1 AND used_at IS NULL AND invalidated_at IS NULL`,
      [userId]
    );

    const result = await getPool().query(
      `INSERT INTO password_reset_tokens (id, user_id, token_hash, issued_at, expires_at, request_ip)
       VALUES ($1, $2, $3, $4, $5, $6)
       RETURNING id, user_id, token_hash, issued_at, expires_at, used_at, invalidated_at, request_ip`,
      [id, userId, tokenHash, issuedAt, expiresAt, requestIp]
    );

    return this.toEntity(result.rows[0]);
  }

  async findByRawToken(rawToken: string): Promise<PasswordResetToken | null> {
    const tokenHash = this.hash(rawToken);
    const result = await getPool().query(
      `SELECT id, user_id, token_hash, issued_at, expires_at, used_at, invalidated_at, request_ip
       FROM password_reset_tokens WHERE token_hash = $1`,
      [tokenHash]
    );
    return result.rowCount ? this.toEntity(result.rows[0]) : null;
  }

  async markUsed(id: string): Promise<void> {
    await getPool().query(`UPDATE password_reset_tokens SET used_at = NOW() WHERE id = $1`, [id]);
  }

  private hash(token: string): string {
    return createHash("sha256").update(token).digest("hex");
  }

  private toEntity(row: Record<string, unknown>): PasswordResetToken {
    return {
      id: row.id as string,
      userId: row.user_id as string,
      tokenHash: row.token_hash as string,
      issuedAt: row.issued_at as Date,
      expiresAt: row.expires_at as Date,
      usedAt: row.used_at as Date | null,
      invalidatedAt: row.invalidated_at as Date | null,
      requestIp: row.request_ip as string | null
    };
  }
}
