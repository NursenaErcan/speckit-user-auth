/** Returns true when reset token age exceeds the 15-minute validity window. */
export function isResetTokenExpired(issuedAt: Date, now: Date): boolean {
  return now.getTime() - issuedAt.getTime() > 15 * 60 * 1000;
}
