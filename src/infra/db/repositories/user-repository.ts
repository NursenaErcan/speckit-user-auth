import { randomUUID } from "crypto";
import { getPool } from "../postgres";
import { User } from "../../../domain/entities/user";

/** PostgreSQL-backed repository for User records. */
export class UserRepository {
  async findByEmail(email: string): Promise<User | null> {
    const result = await getPool().query(
      `SELECT id, email, password_hash, status, created_at, updated_at, last_login_at
       FROM users WHERE email = $1`,
      [email]
    );

    if (result.rowCount === 0) {
      return null;
    }

    const row = result.rows[0];
    return {
      id: row.id,
      email: row.email,
      passwordHash: row.password_hash,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lastLoginAt: row.last_login_at
    } as User;
  }

  async create(email: string, passwordHash: string): Promise<User> {
    const id = randomUUID();
    const result = await getPool().query(
      `INSERT INTO users (id, email, password_hash)
       VALUES ($1, $2, $3)
       RETURNING id, email, password_hash, status, created_at, updated_at, last_login_at`,
      [id, email, passwordHash]
    );

    const row = result.rows[0];
    return {
      id: row.id,
      email: row.email,
      passwordHash: row.password_hash,
      status: row.status,
      createdAt: row.created_at,
      updatedAt: row.updated_at,
      lastLoginAt: row.last_login_at
    } as User;
  }

  async updateLastLogin(userId: string): Promise<void> {
    await getPool().query(`UPDATE users SET last_login_at = NOW(), updated_at = NOW() WHERE id = $1`, [userId]);
  }
}
