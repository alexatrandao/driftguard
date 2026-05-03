import express, { Request, Response } from 'express';
import { config } from './lib/config';
import { logger } from './lib/logger';
import { db } from './lib/database';
import { userController } from './controllers/userController';
import { authController } from './controllers/authController';
import { profileController } from './controllers/profileController';

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging middleware
app.use((req: Request, res: Response, next) => {
  logger.info('Incoming request', {
    method: req.method,
    path: req.path,
    ip: req.ip,
  });
  next();
});

// Health check endpoint
app.get('/health', (req: Request, res: Response) => {
  res.status(200).json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    database: db.isConnected() ? 'connected' : 'disconnected',
  });
});

// User routes
app.post('/api/users/register', (req, res) => userController.register(req, res));
app.get('/api/users/:id', (req, res) => userController.getUser(req, res));
app.put('/api/users/:id', (req, res) => userController.updateUser(req, res));
app.delete('/api/users/:id', (req, res) => userController.deleteUser(req, res));
app.get('/api/users', (req, res) => userController.listUsers(req, res));

// Auth routes
app.post('/api/auth/login', (req, res) => authController.login(req, res));
app.post('/api/auth/logout', (req, res) => authController.logout(req, res));
app.post('/api/auth/refresh', (req, res) => authController.refreshToken(req, res));
app.post('/api/auth/validate', (req, res) => authController.validateToken(req, res));

// Profile routes
app.get('/api/profile/:id', (req, res) => profileController.getProfile(req, res));
app.put('/api/profile/:id', (req, res) => profileController.updateProfile(req, res));
app.get('/api/profile/:id/activity', (req, res) => profileController.getActivityLog(req, res));

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: 'Route not found',
  });
});

// Error handler
app.use((err: Error, req: Request, res: Response, next: any) => {
  logger.error('Unhandled error', {
    error: err.message,
    stack: err.stack,
    path: req.path,
  });

  res.status(500).json({
    success: false,
    error: 'Internal server error',
  });
});

// Start server
async function startServer() {
  try {
    // Connect to database
    await db.connect();

    // Start listening
    app.listen(config.port, () => {
      logger.info('Server started', {
        port: config.port,
        nodeEnv: config.nodeEnv,
      });
    });
  } catch (error) {
    logger.error('Failed to start server', {
      error: error instanceof Error ? error.message : 'Unknown error',
    });
    process.exit(1);
  }
}

// Handle shutdown gracefully
process.on('SIGTERM', async () => {
  logger.info('SIGTERM received, shutting down gracefully');
  await db.disconnect();
  process.exit(0);
});

process.on('SIGINT', async () => {
  logger.info('SIGINT received, shutting down gracefully');
  await db.disconnect();
  process.exit(0);
});

// Start the server
startServer();

// Made with Bob
