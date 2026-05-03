import { config } from '../lib/config';
import { logger } from '../lib/logger';

export interface EmailData {
  to: string;
  subject: string;
  body: string;
  isHtml?: boolean;
}

interface EmailApiResponse {
  messageId: string;
  status?: string;
}

class EmailService {
  async sendWelcomeEmail(email: string, username: string): Promise<void> {
    logger.info('Sending welcome email', { email, username });

    const emailData: EmailData = {
      to: email,
      subject: 'Welcome to User Management Service',
      body: `Hello ${username},\n\nWelcome to our service! We're excited to have you on board.\n\nBest regards,\nThe Team`,
      isHtml: false,
    };

    await this.sendEmail(emailData);
  }

  async sendPasswordResetEmail(email: string, resetToken: string): Promise<void> {
    logger.info('Sending password reset email', { email });

    const emailData: EmailData = {
      to: email,
      subject: 'Password Reset Request',
      body: `You have requested to reset your password.\n\nReset token: ${resetToken}\n\nIf you did not request this, please ignore this email.`,
      isHtml: false,
    };

    await this.sendEmail(emailData);
  }

  async sendEmail(emailData: EmailData): Promise<void> {
    try {
      // VIOLATION: Rule 3.1 - Using fetch directly instead of centralized httpClient
      // This is a plausible violation - developer uses native fetch for "just one quick API call"
      const response = await fetch(config.email.apiUrl + '/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${config.email.apiKey}`,
        },
        body: JSON.stringify({
          from: config.email.fromAddress,
          to: emailData.to,
          subject: emailData.subject,
          body: emailData.body,
          html: emailData.isHtml,
        }),
      });

      if (!response.ok) {
        throw new Error(`Email API returned status ${response.status}`);
      }

      const result = await response.json() as EmailApiResponse;
      logger.info('Email sent successfully', { to: emailData.to, messageId: result.messageId });
    } catch (error) {
      logger.error('Failed to send email', {
        error: error instanceof Error ? error.message : 'Unknown error',
        to: emailData.to,
      });
      throw error;
    }
  }
}

export const emailService = new EmailService();

// Made with Bob
