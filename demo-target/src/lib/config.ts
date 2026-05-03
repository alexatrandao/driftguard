import dotenv from 'dotenv';

// Load environment variables from .env file
dotenv.config();

interface Config {
  port: number;
  nodeEnv: string;
  database: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  email: {
    apiKey: string;
    apiUrl: string;
    fromAddress: string;
  };
  externalApis: {
    userValidationService: string;
    analyticsService: string;
  };
}

function getEnvVar(key: string, defaultValue?: string): string {
  const value = process.env[key];
  if (!value && !defaultValue) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value || defaultValue!;
}

function getEnvVarAsNumber(key: string, defaultValue?: number): number {
  const value = process.env[key];
  if (!value && defaultValue === undefined) {
    throw new Error(`Missing required environment variable: ${key}`);
  }
  return value ? parseInt(value, 10) : defaultValue!;
}

export const config: Config = {
  port: getEnvVarAsNumber('PORT', 3000),
  nodeEnv: getEnvVar('NODE_ENV', 'development'),
  database: {
    host: getEnvVar('DB_HOST', 'localhost'),
    port: getEnvVarAsNumber('DB_PORT', 5432),
    name: getEnvVar('DB_NAME', 'userdb'),
    user: getEnvVar('DB_USER', 'postgres'),
    password: getEnvVar('DB_PASSWORD', 'PLACEHOLDER_DB_PASSWORD'),
  },
  jwt: {
    secret: getEnvVar('JWT_SECRET', 'PLACEHOLDER_JWT_SECRET'),
    expiresIn: getEnvVar('JWT_EXPIRES_IN', '24h'),
  },
  email: {
    apiKey: getEnvVar('EMAIL_API_KEY', 'PLACEHOLDER_EMAIL_API_KEY'),
    apiUrl: getEnvVar('EMAIL_API_URL', 'https://api.emailservice.example.com'),
    fromAddress: getEnvVar('EMAIL_FROM', 'noreply@example.com'),
  },
  externalApis: {
    userValidationService: getEnvVar('USER_VALIDATION_API', 'https://validation.example.com'),
    analyticsService: getEnvVar('ANALYTICS_API', 'https://analytics.example.com'),
  },
};

// Made with Bob
