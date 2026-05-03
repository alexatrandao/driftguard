import { db } from '../lib/database';
import { logger } from '../lib/logger';

export interface Session {
  id: string;
  userId: string;
  token: string;
  expiresAt: Date;
  createdAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

export interface CreateSessionData {
  userId: string;
  token: string;
  expiresAt: Date;
  ipAddress?: string;
  userAgent?: string;
}

class SessionRepository {
  async findByToken(token: string): Promise<Session | null> {
    logger.debug('Finding session by token');
    const result = await db.queryOne<Session>(
      'SELECT * FROM sessions WHERE token = $1 AND expires_at > NOW()',
      [token]
    );
    return result;
  }

  async findByUserId(userId: string): Promise<Session[]> {
    logger.debug('Finding sessions by user ID', { userId });
    const results = await db.query<Session>(
      'SELECT * FROM sessions WHERE user_id = $1 AND expires_at > NOW() ORDER BY created_at DESC',
      [userId]
    );
    return results;
  }

  async create(sessionData: CreateSessionData): Promise<Session> {
    logger.debug('Creating new session', { userId: sessionData.userId });
    const result = await db.queryOne<Session>(
      `INSERT INTO sessions (user_id, token, expires_at, created_at, ip_address, user_agent)
       VALUES ($1, $2, $3, NOW(), $4, $5)
       RETURNING *`,
      [
        sessionData.userId,
        sessionData.token,
        sessionData.expiresAt,
        sessionData.ipAddress,
        sessionData.userAgent,
      ]
    );
    return result!;
  }

  async delete(token: string): Promise<boolean> {
    logger.debug('Deleting session');
    const result = await db.execute('DELETE FROM sessions WHERE token = $1', [token]);
    return result.affectedRows > 0;
  }

  async deleteByUserId(userId: string): Promise<number> {
    logger.debug('Deleting all sessions for user', { userId });
    const result = await db.execute('DELETE FROM sessions WHERE user_id = $1', [userId]);
    return result.affectedRows;
  }

  async deleteExpired(): Promise<number> {
    logger.debug('Deleting expired sessions');
    const result = await db.execute('DELETE FROM sessions WHERE expires_at <= NOW()');
    return result.affectedRows;
  }
}

export const sessionRepository = new SessionRepository();

// Made with Bob
