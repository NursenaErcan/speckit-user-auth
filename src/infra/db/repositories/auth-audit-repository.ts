import { randomUUID } from "crypto";
import { getPool } from "../postgres";

export type AuthAuditEventType =
  | "REGISTER_SUCCESS"
  | "LOGIN_SUCCESS"
  | "LOGIN_FAILURE"
  | "RESET_REQUESTED"
  | "RESET_COMPLETED"
  | "TOKEN_REJECTED"
  | "RATE_LIMITED";

/** Persists security-significant authentication events. */
export class AuthAuditRepository {
  async write(
    eventType: AuthAuditEventType,
    userId: string | null,
    sourceIp: string | null,
    metadata: Record<string, unknown> = {}
  ): Promise<void> {
    await getPool().query(
      `INSERT INTO auth_audit_events (id, user_id, event_type, source_ip, metadata)
       VALUES ($1, $2, $3, $4, $5)`,
      [randomUUID(), userId, eventType, sourceIp, metadata]
    );
  }
}
