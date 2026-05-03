import { Request, Response } from 'express';
import { userRepository } from '../repositories/userRepository';
import { auditRepository } from '../repositories/auditRepository';
import { logger } from '../lib/logger';

class ProfileController {
  async getProfile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;

      // VIOLATION: Rule 1.1 - Controller directly calling repository instead of going through service
      // This is a plausible violation - developer shortcuts the service layer for a "simple read operation"
      const user = await userRepository.findById(id);

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
      logger.error('Failed to get profile', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: req.params.id,
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve profile',
      });
    }
  }

  async updateProfile(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const updateData = {
        firstName: req.body.firstName,
        lastName: req.body.lastName,
      };

      // VIOLATION: Rule 1.1 - Controller directly calling repository instead of going through service
      const user = await userRepository.update(id, updateData);

      if (!user) {
        res.status(404).json({
          success: false,
          error: 'User not found',
        });
        return;
      }

      // Create audit log
      await auditRepository.create({
        userId: id,
        action: 'PROFILE_UPDATED',
        resourceType: 'user',
        resourceId: id,
        metadata: { updates: updateData },
      });

      // Don't send password hash in response
      const { passwordHash, ...userResponse } = user;

      res.status(200).json({
        success: true,
        data: userResponse,
      });
    } catch (error) {
      logger.error('Failed to update profile', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: req.params.id,
      });

      res.status(400).json({
        success: false,
        error: error instanceof Error ? error.message : 'Failed to update profile',
      });
    }
  }

  async getActivityLog(req: Request, res: Response): Promise<void> {
    try {
      const { id } = req.params;
      const limit = parseInt(req.query.limit as string) || 50;

      const auditLogs = await auditRepository.findByUserId(id, limit);

      res.status(200).json({
        success: true,
        data: auditLogs,
      });
    } catch (error) {
      logger.error('Failed to get activity log', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: req.params.id,
      });

      res.status(500).json({
        success: false,
        error: 'Failed to retrieve activity log',
      });
    }
  }
}

export const profileController = new ProfileController();

// Made with Bob
