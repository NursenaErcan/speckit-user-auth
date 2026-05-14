import bcrypt from "bcrypt";
import { env } from "../../config/env";

/** Adapter for hashing and comparing passwords with bcrypt. */
export class BcryptPasswordHasher {
  async hash(rawPassword: string): Promise<string> {
    return bcrypt.hash(rawPassword, env.bcryptCost);
  }

  async verify(rawPassword: string, hash: string): Promise<boolean> {
    return bcrypt.compare(rawPassword, hash);
  }
}
