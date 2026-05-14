/** One-time token record for password reset confirmation. */
export interface PasswordResetToken {
  id: string;
  userId: string;
  tokenHash: string;
  issuedAt: Date;
  expiresAt: Date;
  usedAt: Date | null;
  invalidatedAt: Date | null;
  requestIp: string | null;
}
