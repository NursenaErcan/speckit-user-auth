export type UserStatus = "ACTIVE" | "LOCKED" | "DISABLED";

/** Persisted user aggregate for authentication operations. */
export interface User {
  id: string;
  email: string;
  passwordHash: string;
  status: UserStatus;
  createdAt: Date;
  updatedAt: Date;
  lastLoginAt: Date | null;
}
