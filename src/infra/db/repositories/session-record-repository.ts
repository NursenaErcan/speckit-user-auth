import { randomUUID } from "crypto";
import { getPool } from "../postgres";
import { SessionRecord } from "../../../domain/entities/session-record";

/** Repository for issued session tokens and their revocation state. */
export class SessionRecordRepository {
  async create(record: Omit<SessionRecord, "id">): Promise<void> {
    await getPool().query(
      `INSERT INTO session_records (id, user_id, jwt_id, issued_at, expires_at, revoked_at, revoked_reason, source_ip, user_agent)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)`,
      [
        randomUUID(),
        record.userId,
        record.jwtId,
        record.issuedAt,
        record.expiresAt,
        record.revokedAt,
        record.revokedReason,
        record.sourceIp,
        record.userAgent
      ]
    );
  }

  async findByJwtId(jwtId: string): Promise<SessionRecord | null> {
    const result = await getPool().query(
      `SELECT id, user_id, jwt_id, issued_at, expires_at, revoked_at, revoked_reason, source_ip, user_agent
       FROM session_records WHERE jwt_id = $1`,
      [jwtId]
    );

    if (!result.rowCount) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      userId: row.user_id,
      jwtId: row.jwt_id,
      issuedAt: row.issued_at,
      expiresAt: row.expires_at,
      revokedAt: row.revoked_at,
      revokedReason: row.revoked_reason,
      sourceIp: row.source_ip,
      userAgent: row.user_agent
    } as SessionRecord;
  }
}
