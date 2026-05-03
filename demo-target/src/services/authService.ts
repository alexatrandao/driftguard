import { userRepository, User } from '../repositories/userRepository';
import { sessionRepository, CreateSessionData } from '../repositories/sessionRepository';
import { logger } from '../lib/logger';
import { config } from '../lib/config';

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface AuthResult {
  user: User;
  token: string;
  expiresAt: Date;
}

class AuthService {
  // VIOLATION: Rule 4.1 - Hardcoded JWT secret instead of loading from config
  // This is a plausible violation - developer hardcodes during development and forgets to externalize
  private readonly JWT_SECRET = 'super-secret-jwt-key-12345';

  async login(credentials: LoginCredentials, ipAddress?: string, userAgent?: string): Promise<AuthResult> {
    logger.info('User login attempt', { email: credentials.email });

    // Find user by email
    const user = await userRepository.findByEmail(credentials.email);
    if (!user) {
      logger.warn('Login failed: user not found', { email: credentials.email });
      throw new Error('Invalid credentials');
    }

    // Verify password (in real app, would use bcrypt.compare)
    const isPasswordValid = await this.verifyPassword(credentials.password, user.passwordHash);
    if (!isPasswordValid) {
      logger.warn('Login failed: invalid password', { email: credentials.email });
      throw new Error('Invalid credentials');
    }

    if (!user.isActive) {
      logger.warn('Login failed: user is inactive', { email: credentials.email });
      throw new Error('Account is inactive');
    }

    // Generate token
    const token = this.generateToken(user.id);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24); // 24 hours from now

    // Create session
    const sessionData: CreateSessionData = {
      userId: user.id,
      token,
      expiresAt,
      ipAddress,
      userAgent,
    };

    await sessionRepository.create(sessionData);

    logger.info('User logged in successfully', { userId: user.id, email: user.email });

    return {
      user,
      token,
      expiresAt,
    };
  }

  async logout(token: string): Promise<void> {
    logger.info('User logout');
    await sessionRepository.delete(token);
  }

  async validateToken(token: string): Promise<User | null> {
    const session = await sessionRepository.findByToken(token);
    if (!session) {
      return null;
    }

    const user = await userRepository.findById(session.userId);
    return user;
  }

  async refreshToken(oldToken: string): Promise<AuthResult | null> {
    const session = await sessionRepository.findByToken(oldToken);
    if (!session) {
      return null;
    }

    const user = await userRepository.findById(session.userId);
    if (!user || !user.isActive) {
      return null;
    }

    // Delete old session
    await sessionRepository.delete(oldToken);

    // Create new session
    const newToken = this.generateToken(user.id);
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 24);

    await sessionRepository.create({
      userId: user.id,
      token: newToken,
      expiresAt,
    });

    logger.info('Token refreshed', { userId: user.id });

    return {
      user,
      token: newToken,
      expiresAt,
    };
  }

  private generateToken(userId: string): string {
    // Simplified token generation - in real app would use jsonwebtoken library
    const timestamp = Date.now();
    const random = Math.random().toString(36).substring(2);
    return `${userId}.${timestamp}.${random}`;
  }

  private async verifyPassword(password: string, hash: string): Promise<boolean> {
    // Simplified password verification - in real app would use bcrypt
    // For demo purposes, just check if they match
    return password === hash;
  }
}

export const authService = new AuthService();

// Made with Bob
