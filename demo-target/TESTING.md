# Testing the Demo Project

This guide explains how to test the User Management Service demo project.

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn

## Quick Start

### 1. Install Dependencies

```bash
cd demo-target
npm install
```

### 2. Build the TypeScript Code

```bash
npm run build
```

This compiles TypeScript to JavaScript in the `dist/` directory.

### 3. Run the Service

```bash
npm start
```

Or for development with auto-reload:

```bash
npm run dev
```

The service will start on port 3000 (or the port specified in the PORT environment variable).

## Testing the API Endpoints

### Health Check

```bash
curl http://localhost:3000/health
```

Expected response:
```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "database": "connected"
}
```

### Register a New User

```bash
curl -X POST http://localhost:3000/api/users/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "username": "johndoe",
    "password": "SecurePass123",
    "firstName": "John",
    "lastName": "Doe"
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "id": "...",
    "email": "john.doe@example.com",
    "username": "johndoe",
    "firstName": "John",
    "lastName": "Doe",
    "createdAt": "...",
    "updatedAt": "...",
    "isActive": true
  }
}
```

### Login

```bash
curl -X POST http://localhost:3000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "john.doe@example.com",
    "password": "SecurePass123"
  }'
```

Expected response:
```json
{
  "success": true,
  "data": {
    "user": {...},
    "token": "...",
    "expiresAt": "..."
  }
}
```

### Get User Profile

```bash
curl http://localhost:3000/api/profile/USER_ID
```

### Update Profile

```bash
curl -X PUT http://localhost:3000/api/profile/USER_ID \
  -H "Content-Type: application/json" \
  -d '{
    "firstName": "Jane",
    "lastName": "Smith"
  }'
```

### List Users

```bash
curl http://localhost:3000/api/users?limit=10&offset=0
```

### Logout

```bash
curl -X POST http://localhost:3000/api/auth/logout \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Environment Variables

Create a `.env` file in the `demo-target/` directory for configuration:

```env
# Server
PORT=3000
NODE_ENV=development

# Database (simulated)
DB_HOST=localhost
DB_PORT=5432
DB_NAME=userdb
DB_USER=postgres
DB_PASSWORD=your_db_password

# JWT
JWT_SECRET=your_jwt_secret_key
JWT_EXPIRES_IN=24h

# Email Service
EMAIL_API_KEY=your_email_api_key
EMAIL_API_URL=https://api.emailservice.example.com
EMAIL_FROM=noreply@example.com

# External APIs
USER_VALIDATION_API=https://validation.example.com
ANALYTICS_API=https://analytics.example.com
```

## Important Notes

### Simulated Database

This demo uses a **simulated database** for demonstration purposes. The database connection and queries are mocked. In a real application, you would:

1. Install a database driver (e.g., `pg` for PostgreSQL, `mysql2` for MySQL)
2. Replace the simulated `db` implementation in `src/lib/database.ts`
3. Create actual database tables
4. Implement real SQL queries

### No Real External Services

The service makes calls to external APIs (email service, validation service) but these are simulated. The HTTP calls will fail in a real environment unless you:

1. Set up actual external services
2. Configure their URLs in environment variables
3. Handle authentication properly

### Password Hashing

The demo uses **simplified password handling** (plain text comparison). In production:

1. Install `bcrypt`: `npm install bcrypt @types/bcrypt`
2. Hash passwords before storing: `await bcrypt.hash(password, 10)`
3. Compare passwords: `await bcrypt.compare(password, hash)`

## Testing the Violations

The codebase contains 4 deliberate architectural violations for testing DriftGuard:

1. **Controller bypassing service** - `src/controllers/profileController.ts`
2. **Direct HTTP call** - `src/services/emailService.ts`
3. **Hardcoded secret** - `src/services/authService.ts`
4. **Console.log usage** - `src/repositories/auditRepository.ts`

See `VIOLATIONS.md` for detailed information about each violation.

## Troubleshooting

### TypeScript Compilation Errors

If you see TypeScript errors about missing modules:

```bash
npm install
```

Make sure all dependencies are installed.

### Port Already in Use

If port 3000 is already in use:

```bash
PORT=3001 npm start
```

Or set the PORT environment variable in your `.env` file.

### Module Not Found Errors

Make sure you're running commands from the `demo-target/` directory:

```bash
cd demo-target
npm install
npm run build
npm start
```

## Development Workflow

1. Make code changes in `src/`
2. Run `npm run build` to compile
3. Run `npm start` to test
4. Or use `npm run dev` for auto-reload during development

## Next Steps

- Use DriftGuard's reviewer mode to detect the planted violations
- Use DriftGuard's refactor mode to fix the violations
- Use DriftGuard's suggest mode to propose new architectural rules