/** Persisted access-token session record. */
export interface SessionRecord {
  id: string;
  userId: string;
  jwtId: string;
  issuedAt: Date;
  expiresAt: Date;
  revokedAt: Date | null;
  revokedReason: string | null;
  sourceIp: string | null;
  userAgent: string | null;
}
