import { db } from '../lib/database';
import { logger } from '../lib/logger';

export interface User {
  id: string;
  email: string;
  username: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
  createdAt: Date;
  updatedAt: Date;
  isActive: boolean;
}

export interface CreateUserData {
  email: string;
  username: string;
  passwordHash: string;
  firstName: string;
  lastName: string;
}

export interface UpdateUserData {
  email?: string;
  username?: string;
  firstName?: string;
  lastName?: string;
  isActive?: boolean;
}

class UserRepository {
  async findById(id: string): Promise<User | null> {
    logger.debug('Finding user by ID', { id });
    const result = await db.queryOne<User>(
      'SELECT * FROM users WHERE id = $1',
      [id]
    );
    return result;
  }

  async findByEmail(email: string): Promise<User | null> {
    logger.debug('Finding user by email', { email });
    const result = await db.queryOne<User>(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    return result;
  }

  async findByUsername(username: string): Promise<User | null> {
    logger.debug('Finding user by username', { username });
    const result = await db.queryOne<User>(
      'SELECT * FROM users WHERE username = $1',
      [username]
    );
    return result;
  }

  async create(userData: CreateUserData): Promise<User> {
    logger.debug('Creating new user', { email: userData.email });
    const result = await db.queryOne<User>(
      `INSERT INTO users (email, username, password_hash, first_name, last_name, created_at, updated_at, is_active)
       VALUES ($1, $2, $3, $4, $5, NOW(), NOW(), true)
       RETURNING *`,
      [
        userData.email,
        userData.username,
        userData.passwordHash,
        userData.firstName,
        userData.lastName,
      ]
    );
    return result!;
  }

  async update(id: string, userData: UpdateUserData): Promise<User | null> {
    logger.debug('Updating user', { id, updates: userData });
    
    const setClauses: string[] = [];
    const values: any[] = [];
    let paramIndex = 1;

    if (userData.email !== undefined) {
      setClauses.push(`email = $${paramIndex++}`);
      values.push(userData.email);
    }
    if (userData.username !== undefined) {
      setClauses.push(`username = $${paramIndex++}`);
      values.push(userData.username);
    }
    if (userData.firstName !== undefined) {
      setClauses.push(`first_name = $${paramIndex++}`);
      values.push(userData.firstName);
    }
    if (userData.lastName !== undefined) {
      setClauses.push(`last_name = $${paramIndex++}`);
      values.push(userData.lastName);
    }
    if (userData.isActive !== undefined) {
      setClauses.push(`is_active = $${paramIndex++}`);
      values.push(userData.isActive);
    }

    setClauses.push(`updated_at = NOW()`);
    values.push(id);

    const result = await db.queryOne<User>(
      `UPDATE users SET ${setClauses.join(', ')} WHERE id = $${paramIndex} RETURNING *`,
      values
    );
    return result;
  }

  async delete(id: string): Promise<boolean> {
    logger.debug('Deleting user', { id });
    const result = await db.execute('DELETE FROM users WHERE id = $1', [id]);
    return result.affectedRows > 0;
  }

  async list(limit: number = 50, offset: number = 0): Promise<User[]> {
    logger.debug('Listing users', { limit, offset });
    const results = await db.query<User>(
      'SELECT * FROM users ORDER BY created_at DESC LIMIT $1 OFFSET $2',
      [limit, offset]
    );
    return results;
  }
}

export const userRepository = new UserRepository();

// Made with Bob
