import { Request, Response } from 'express';
import { authService, LoginCredentials } from '../services/authService';
import { logger } from '../lib/logger';

class AuthController {
  async login(req: Request, res: Response): Promise<void> {
    try {
      const credentials: LoginCredentials = {
        email: req.body.email,
        password: req.body.password,
      };

      const ipAddress = req.ip;
      const userAgent = req.headers['user-agent'];

      const authResult = await authService.login(credentials, ipAddress, userAgent);

      // Don't send password hash in response
      const { passwordHash, ...userResponse } = authResult.user;

      res.status(200).json({
        success: true,
        data: {
          user: userResponse,
          token: authResult.token,
          expiresAt: authResult.expiresAt,
        },
      });
    } catch (error) {
      logger.error('Login failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
        email: req.body.email,
      });

      res.status(401).json({
        success: false,
        error: error instanceof Error ? error.message : 'Login failed',
      });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        res.status(400).json({
          success: false,
          error: 'No token provided',
        });
        return;
      }

      await authService.logout(token);

      res.status(200).json({
        success: true,
        message: 'Logged out successfully',
      });
    } catch (error) {
      logger.error('Logout failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Logout failed',
      });
    }
  }

  async refreshToken(req: Request, res: Response): Promise<void> {
    try {
      const oldToken = req.headers.authorization?.replace('Bearer ', '');

      if (!oldToken) {
        res.status(400).json({
          success: false,
          error: 'No token provided',
        });
        return;
      }

      const authResult = await authService.refreshToken(oldToken);

      if (!authResult) {
        res.status(401).json({
          success: false,
          error: 'Invalid or expired token',
        });
        return;
      }

      // Don't send password hash in response
      const { passwordHash, ...userResponse } = authResult.user;

      res.status(200).json({
        success: true,
        data: {
          user: userResponse,
          token: authResult.token,
          expiresAt: authResult.expiresAt,
        },
      });
    } catch (error) {
      logger.error('Token refresh failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Token refresh failed',
      });
    }
  }

  async validateToken(req: Request, res: Response): Promise<void> {
    try {
      const token = req.headers.authorization?.replace('Bearer ', '');

      if (!token) {
        res.status(400).json({
          success: false,
          error: 'No token provided',
        });
        return;
      }

      const user = await authService.validateToken(token);

      if (!user) {
        res.status(401).json({
          success: false,
          error: 'Invalid or expired token',
        });
        return;
      }

      // Don't send password hash in response
      const { passwordHash, ...userResponse } = user;

      res.status(200).json({
        success: true,
        data: {
          user: userResponse,
          valid: true,
        },
      });
    } catch (error) {
      logger.error('Token validation failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Token validation failed',
      });
    }
  }
}

export const authController = new AuthController();

// Made with Bob
