import { logger } from '../lib/logger';

export interface ValidationResult {
  isValid: boolean;
  errors: string[];
}

class ValidationService {
  validateEmail(email: string): ValidationResult {
    const errors: string[] = [];
    
    if (!email) {
      errors.push('Email is required');
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      errors.push('Invalid email format');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  validateUsername(username: string): ValidationResult {
    const errors: string[] = [];
    
    if (!username) {
      errors.push('Username is required');
    } else if (username.length < 3) {
      errors.push('Username must be at least 3 characters');
    } else if (username.length > 30) {
      errors.push('Username must be at most 30 characters');
    } else if (!/^[a-zA-Z0-9_-]+$/.test(username)) {
      errors.push('Username can only contain letters, numbers, hyphens, and underscores');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  validatePassword(password: string): ValidationResult {
    const errors: string[] = [];
    
    if (!password) {
      errors.push('Password is required');
    } else if (password.length < 8) {
      errors.push('Password must be at least 8 characters');
    } else if (!/[A-Z]/.test(password)) {
      errors.push('Password must contain at least one uppercase letter');
    } else if (!/[a-z]/.test(password)) {
      errors.push('Password must contain at least one lowercase letter');
    } else if (!/[0-9]/.test(password)) {
      errors.push('Password must contain at least one number');
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  validateName(name: string, fieldName: string): ValidationResult {
    const errors: string[] = [];
    
    if (!name) {
      errors.push(`${fieldName} is required`);
    } else if (name.length < 1) {
      errors.push(`${fieldName} must not be empty`);
    } else if (name.length > 50) {
      errors.push(`${fieldName} must be at most 50 characters`);
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  validateUserRegistration(data: {
    email: string;
    username: string;
    password: string;
    firstName: string;
    lastName: string;
  }): ValidationResult {
    const allErrors: string[] = [];

    const emailValidation = this.validateEmail(data.email);
    allErrors.push(...emailValidation.errors);

    const usernameValidation = this.validateUsername(data.username);
    allErrors.push(...usernameValidation.errors);

    const passwordValidation = this.validatePassword(data.password);
    allErrors.push(...passwordValidation.errors);

    const firstNameValidation = this.validateName(data.firstName, 'First name');
    allErrors.push(...firstNameValidation.errors);

    const lastNameValidation = this.validateName(data.lastName, 'Last name');
    allErrors.push(...lastNameValidation.errors);

    if (allErrors.length > 0) {
      logger.debug('User registration validation failed', { errors: allErrors });
    }

    return {
      isValid: allErrors.length === 0,
      errors: allErrors,
    };
  }
}

export const validationService = new ValidationService();

// Made with Bob
