import { Request, Response } from 'express';
import { userService, UserRegistrationData } from '../services/userService';
import { logger } from '../lib/logger';

class UserController {
  async register(req: Request, res: Response): Promise<void> {
    try {
      const registrationData: UserRegistrationData = {
        email: req.body.email,
        username: req.body.username,
        password: req.body.password,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      };

      const user = await userService.registerUser(registrationData);

      // Don't send password hash in response
      const { passwordHash, ...userResponse } = user;

      res.status(201).json({
        success: true,
        data: userResponse,
      });
    } catch (error) {
      logger.error('User registration failed', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Registration failed',
      });
    }
  }

  async getUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const user = await userService.getUserById(id);

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      // Don't send password hash in response
      const { passwordHash, ...userResponse } = user;

      res.status(200).json({
        success: true,
        data: userResponse,
      });
    } catch (error) {
      logger.error('Failed to get user', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: req.params.id,
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve user',
      });
    }
  }

  async updateUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = req.body;
      
      // In a real app, would get authenticated user ID from session/token
      const updatedBy = req.headers['x-user-id'] as string || 'system';

      const user = await userService.updateUser(id, updateData, updatedBy);

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      // Don't send password hash in response
      const { passwordHash, ...userResponse } = user;

      res.status(200).json({
        success: true,
        data: userResponse,
      });
    } catch (error) {
      logger.error('Failed to update user', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: req.params.id,
      });

      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update user',
      });
    }
  }

  async deleteUser(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      
      // In a real app, would get authenticated user ID from session/token
      const deletedBy = req.headers['x-user-id'] as string || 'system';

      const success = await userService.deleteUser(id, deletedBy);

      if (!success) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      res.status(200).json({
        success: true,
        message: 'User deleted successfully',
      });
    } catch (error) {
      logger.error('Failed to delete user', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: req.params.id,
      });

      res.status(500).json({
        success: false,
        error: 'Failed to delete user',
      });
    }
  }

  async listUsers(req: Request, res: Response): Promise<void> {
    try {
      const limit = parseInt(req.query.limit as string) || 50;
      const offset = parseInt(req.query.offset as string) || 0;

      const users = await userService.listUsers(limit, offset);

      // Don't send password hashes in response
      const usersResponse = users.map(user => {
        const { passwordHash, ...userWithoutPassword } = user;
        return userWithoutPassword;
      });

      res.status(200).json({
        success: true,
        data: usersResponse,
        pagination: {
          limit,
          offset,
          count: usersResponse.length,
        },
      });
    } catch (error) {
      logger.error('Failed to list users', {
        error: error instanceof Error ? error.message : 'Unknown error',
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve users',
      });
    }
  }
}

export const userController = new UserController();

// Made with Bob
