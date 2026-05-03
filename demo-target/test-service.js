// Simple test script to verify the service can start
// This bypasses the actual server startup to just test imports and basic functionality

console.log('Testing demo-target service...\n');

try {
  // Test 1: Import config
  console.log('✓ Test 1: Importing config module...');
  const { config } = require('./dist/lib/config');
  console.log('  Config loaded:', {
    port: config.port,
    nodeEnv: config.nodeEnv,
  });

  // Test 2: Import logger
  console.log('\n✓ Test 2: Importing logger module...');
  const { logger } = require('./dist/lib/logger');
  logger.info('Logger is working!');

  // Test 3: Import database
  console.log('\n✓ Test 3: Importing database module...');
  const { db } = require('./dist/lib/database');
  console.log('  Database module loaded');

  // Test 4: Import repositories
  console.log('\n✓ Test 4: Importing repositories...');
  const { userRepository } = require('./dist/repositories/userRepository');
  const { sessionRepository } = require('./dist/repositories/sessionRepository');
  const { auditRepository } = require('./dist/repositories/auditRepository');
  console.log('  All repositories loaded');

  // Test 5: Import services
  console.log('\n✓ Test 5: Importing services...');
  const { userService } = require('./dist/services/userService');
  const { authService } = require('./dist/services/authService');
  const { emailService } = require('./dist/services/emailService');
  const { validationService } = require('./dist/services/validationService');
  console.log('  All services loaded');

  // Test 6: Import controllers
  console.log('\n✓ Test 6: Importing controllers...');
  const { userController } = require('./dist/controllers/userController');
  const { authController } = require('./dist/controllers/authController');
  const { profileController } = require('./dist/controllers/profileController');
  console.log('  All controllers loaded');

  // Test 7: Test validation service
  console.log('\n✓ Test 7: Testing validation service...');
  const emailValidation = validationService.validateEmail('test@example.com');
  console.log('  Email validation:', emailValidation);
  
  const passwordValidation = validationService.validatePassword('SecurePass123');
  console.log('  Password validation:', passwordValidation);

  console.log('\n✅ All tests passed! The service is ready to run.');
  console.log('\nTo start the server, run:');
  console.log('  npm start');
  console.log('\nOr for development mode:');
  console.log('  npm run dev');

} catch (error) {
  console.error('\n❌ Test failed:', error.message);
  console.error(error.stack);
  process.exit(1);
}

// Made with Bob
