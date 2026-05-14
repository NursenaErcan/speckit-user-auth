/** Contract for sending password reset emails. */
export interface PasswordResetEmailService {
  send(email: string, resetToken: string): Promise<void>;
}
