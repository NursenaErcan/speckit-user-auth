import { Pool } from "pg";
import { env } from "../../config/env";

let pool: Pool | null = null;

/** Returns a singleton PostgreSQL pool instance. */
export function getPool(): Pool {
  if (!pool) {
    pool = new Pool({ connectionString: env.databaseUrl });
  }
  return pool;
}
