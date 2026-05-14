import { randomUUID } from "crypto";
import { getPool } from "../../infra/db/postgres";
import { env } from "../../config/env";

export type RateLimitEndpoint = "LOGIN" | "PASSWORD_RESET_REQUEST" | "PASSWORD_RESET_CONFIRM";

/** Tracks and enforces request throttling by both IP and account identifier. */
export class RateLimitService {
  async registerAttempt(endpoint: RateLimitEndpoint, ip: string, accountKey: string): Promise<void> {
    await Promise.all([
      this.upsertBucket("IP", endpoint, ip),
      this.upsertBucket("ACCOUNT", endpoint, accountKey.toLowerCase())
    ]);
  }

  async isBlocked(endpoint: RateLimitEndpoint, ip: string, accountKey: string): Promise<boolean> {
    const blocked = await Promise.all([
      this.checkBucket("IP", endpoint, ip),
      this.checkBucket("ACCOUNT", endpoint, accountKey.toLowerCase())
    ]);
    return blocked.some(Boolean);
  }

  private async upsertBucket(scopeType: "IP" | "ACCOUNT", endpoint: RateLimitEndpoint, scopeKey: string): Promise<void> {
    await getPool().query(
      `INSERT INTO auth_rate_limit_buckets (id, scope_type, scope_key, endpoint_type, window_start, attempt_count)
       VALUES ($1, $2, $3, $4, NOW(), 1)
       ON CONFLICT (scope_type, scope_key, endpoint_type)
       DO UPDATE SET
         attempt_count = auth_rate_limit_buckets.attempt_count + 1,
         blocked_until = CASE
           WHEN auth_rate_limit_buckets.attempt_count + 1 >= $5 THEN NOW() + make_interval(secs => $6)
           ELSE auth_rate_limit_buckets.blocked_until
         END`,
      [randomUUID(), scopeType, scopeKey, endpoint, env.rateLimitMaxAttempts, env.rateLimitWindowSeconds]
    );
  }

  private async checkBucket(scopeType: "IP" | "ACCOUNT", endpoint: RateLimitEndpoint, scopeKey: string): Promise<boolean> {
    const result = await getPool().query(
      `SELECT blocked_until FROM auth_rate_limit_buckets
       WHERE scope_type = $1 AND endpoint_type = $2 AND scope_key = $3`,
      [scopeType, endpoint, scopeKey]
    );

    if (result.rowCount === 0) {
      return false;
    }

    const blockedUntil = result.rows[0].blocked_until as Date | null;
    return Boolean(blockedUntil && blockedUntil > new Date());
  }
}
