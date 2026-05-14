/** Contract for breached-password lookups. */
export interface BreachedPasswordService {
  isBreached(password: string): Promise<boolean>;
}
