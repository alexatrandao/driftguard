import { userRepository, User, CreateUserData, UpdateUserData } from '../repositories/userRepository';
import { auditRepository } from '../repositories/auditRepository';
import { emailService } from './emailService';
import { validationService } from './validationService';
import { logger } from '../lib/logger';

export interface UserRegistrationData {
  email: string;
  username: string;
  password: string;
  firstName: string;
  lastName: string;
}

class UserService {
  async registerUser(registrationData: UserRegistrationData): Promise<User> {
    logger.info('Registering new user', { email: registrationData.email, username: registrationData.username });

    // Validate input
    const validation = validationService.validateUserRegistration(registrationData);
    if (!validation.isValid) {
      logger.warn('User registration validation failed', { errors: validation.errors });
      throw new Error(`Validation failed: ${validation.errors.join(', ')}`);
    }

    // Check if email already exists
    const existingUserByEmail = await userRepository.findByEmail(registrationData.email);
    if (existingUserByEmail) {
      logger.warn('User registration failed: email already exists', { email: registrationData.email });
      throw new Error('Email already registered');
    }

    // Check if username already exists
    const existingUserByUsername = await userRepository.findByUsername(registrationData.username);
    if (existingUserByUsername) {
      logger.warn('User registration failed: username already exists', { username: registrationData.username });
      throw new Error('Username already taken');
    }

    // Hash password (simplified - in real app would use bcrypt)
    const passwordHash = await this.hashPassword(registrationData.password);

    // Create user
    const userData: CreateUserData = {
      email: registrationData.email,
      username: registrationData.username,
      passwordHash,
      firstName: registrationData.firstName,
      lastName: registrationData.lastName,
    };

    const user = await userRepository.create(userData);

    // Create audit log
    await auditRepository.create({
      userId: user.id,
      action: 'USER_REGISTERED',
      resourceType: 'user',
      resourceId: user.id,
      metadata: { email: user.email, username: user.username },
    });

    // Send welcome email
    try {
      await emailService.sendWelcomeEmail(user.email, user.username);
    } catch (error) {
      logger.error('Failed to send welcome email', {
        error: error instanceof Error ? error.message : 'Unknown error',
        userId: user.id,
      });
      // Don't fail registration if email fails
    }

    logger.info('User registered successfully', { userId: user.id, email: user.email });

    return user;
  }

  async getUserById(id: string): Promise<User | null> {
    logger.debug('Getting user by ID', { id });
    return await userRepository.findById(id);
  }

  async getUserByEmail(email: string): Promise<User | null> {
    logger.debug('Getting user by email', { email });
    return await userRepository.findByEmail(email);
  }

  async getUserByUsername(username: string): Promise<User | null> {
    logger.debug('Getting user by username', { username });
    return await userRepository.findByUsername(username);
  }

  async updateUser(id: string, updateData: UpdateUserData, updatedBy: string): Promise<User | null> {
    logger.info('Updating user', { id, updatedBy });

    // Validate email if provided
    if (updateData.email) {
      const emailValidation = validationService.validateEmail(updateData.email);
      if (!emailValidation.isValid) {
        throw new Error(`Invalid email: ${emailValidation.errors.join(', ')}`);
      }

      // Check if email is already taken by another user
      const existingUser = await userRepository.findByEmail(updateData.email);
      if (existingUser && existingUser.id !== id) {
        throw new Error('Email already registered');
      }
    }

    // Validate username if provided
    if (updateData.username) {
      const usernameValidation = validationService.validateUsername(updateData.username);
      if (!usernameValidation.isValid) {
        throw new Error(`Invalid username: ${usernameValidation.errors.join(', ')}`);
      }

      // Check if username is already taken by another user
      const existingUser = await userRepository.findByUsername(updateData.username);
      if (existingUser && existingUser.id !== id) {
        throw new Error('Username already taken');
      }
    }

    const user = await userRepository.update(id, updateData);

    if (user) {
      // Create audit log
      await auditRepository.create({
        userId: updatedBy,
        action: 'USER_UPDATED',
        resourceType: 'user',
        resourceId: id,
        metadata: { updates: updateData },
      });

      logger.info('User updated successfully', { userId: id });
    }

    return user;
  }

  async deleteUser(id: string, deletedBy: string): Promise<boolean> {
    logger.info('Deleting user', { id, deletedBy });

    const success = await userRepository.delete(id);

    if (success) {
      // Create audit log
      await auditRepository.create({
        userId: deletedBy,
        action: 'USER_DELETED',
        resourceType: 'user',
        resourceId: id,
      });

      logger.info('User deleted successfully', { userId: id });
    }

    return success;
  }

  async listUsers(limit: number = 50, offset: number = 0): Promise<User[]> {
    logger.debug('Listing users', { limit, offset });
    return await userRepository.list(limit, offset);
  }

  private async hashPassword(password: string): Promise<string> {
    // Simplified password hashing - in real app would use bcrypt
    // For demo purposes, just return the password (NOT SECURE!)
    return password;
  }
}

export const userService = new UserService();

// Made with Bob
