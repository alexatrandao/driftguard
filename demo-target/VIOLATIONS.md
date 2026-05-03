# Planted Architectural Violations

This document lists the deliberate architectural violations planted in the demo-target codebase for testing DriftGuard's detection capabilities.

## Summary

**Total Violations**: 4  
**Rules Violated**: 3 different rules  
**Files Affected**: 3 files

---

## Violation 1: Controller Bypassing Service Layer

**File**: `src/controllers/profileController.ts`  
**Lines**: 14, 52  
**Rule Violated**: Rule 1.1 - Controller-Service Boundary  
**Severity**: High

### Description
The `profileController` directly calls `userRepository.findById()` and `userRepository.update()` instead of going through the `userService`.

### Code Location
```typescript
// Line 14 in getProfile()
const user = await userRepository.findById(id);

// Line 52 in updateProfile()
const user = await userRepository.update(id, updateData);
```

### Why This is Plausible
This is a realistic violation where a developer shortcuts the service layer for what they perceive as a "simple read operation" or "quick update." They might think: "Why add an extra layer when I'm just fetching/updating a user by ID?"

### Expected Fix
The controller should call `userService.getUserById()` and `userService.updateUser()` instead of directly accessing the repository.

---

## Violation 2: Direct HTTP Call Instead of Centralized Client

**File**: `src/services/emailService.ts`  
**Line**: 42  
**Rule Violated**: Rule 3.1 - Centralized HTTP Client  
**Severity**: Medium

### Description
The `emailService` uses native `fetch()` directly instead of using the centralized `httpClient` from `lib/httpClient.ts`.

### Code Location
```typescript
// Line 42 in sendEmail()
const response = await fetch(config.email.apiUrl + '/send', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${config.email.apiKey}`,
  },
  body: JSON.stringify({...}),
});
```

### Why This is Plausible
This is a common violation where a developer uses native fetch for "just one quick API call" without realizing the importance of consistent HTTP handling. They might think the centralized client is overkill for a simple POST request.

### Expected Fix
Replace the fetch call with `httpClient.post()`:
```typescript
const response = await httpClient.post(config.email.apiUrl + '/send', {
  from: config.email.fromAddress,
  to: emailData.to,
  subject: emailData.subject,
  body: emailData.body,
  html: emailData.isHtml,
}, {
  headers: {
    'Authorization': `Bearer ${config.email.apiKey}`,
  },
});
```

---

## Violation 3: Hardcoded Secret

**File**: `src/services/authService.ts`  
**Line**: 20  
**Rule Violated**: Rule 4.1 - Externalized Secrets  
**Severity**: Critical

### Description
The `authService` contains a hardcoded JWT secret string instead of loading it from the config module.

### Code Location
```typescript
// Line 20
private readonly JWT_SECRET = 'super-secret-jwt-key-12345';
```

### Why This is Plausible
This is an extremely common violation where a developer hardcodes a secret during development/testing and forgets to externalize it before committing. They might plan to "fix it later" but it slips through code review.

### Expected Fix
Remove the hardcoded constant and use the config value:
```typescript
// Use config.jwt.secret instead of the hardcoded JWT_SECRET
```

---

## Violation 4: Console.log Instead of Centralized Logger

**File**: `src/repositories/auditRepository.ts`  
**Lines**: 27, 50, 59  
**Rule Violated**: Rule 5.1 - Centralized Logging  
**Severity**: Low to Medium

### Description
The `auditRepository` uses `console.log()` for debugging instead of the centralized logger from `lib/logger.ts`.

### Code Location
```typescript
// Line 27 in create()
console.log('Creating audit log:', {...});

// Line 50 in findByUserId()
console.log(`Fetching audit logs for user: ${userId}`);

// Line 59 in findByResource()
console.log(`Fetching audit logs for resource: ${resourceType}/${resourceId}`);
```

### Why This is Plausible
This is a very common violation where a developer adds quick debug logging using console.log and forgets to replace it with the proper logger or remove it before committing. It often happens during troubleshooting sessions.

### Expected Fix
Replace all console.log calls with logger.debug():
```typescript
logger.debug('Creating audit log', {...});
logger.debug('Fetching audit logs for user', { userId });
logger.debug('Fetching audit logs for resource', { resourceType, resourceId });
```

---

## Testing Notes

These violations are designed to be:
1. **Realistic**: The kind of mistakes real developers make
2. **Detectable**: Clear violations of documented architectural rules
3. **Varied**: Covering different rule categories (layering, HTTP, secrets, logging)
4. **Plausible**: Not "crime in plain sight" - they could slip through code review

The violations test DriftGuard's ability to:
- Detect layering violations (controllers calling repositories)
- Identify improper HTTP client usage
- Find hardcoded secrets
- Catch logging anti-patterns

---

## Verification Checklist

- [x] Violation 1: Controller bypassing service layer (Rule 1.1)
- [x] Violation 2: Direct HTTP call (Rule 3.1)
- [x] Violation 3: Hardcoded secret (Rule 4.1)
- [x] Violation 4: Console.log usage (Rule 5.1)
- [x] All violations are in different files
- [x] At least 3 different rules are violated
- [x] All violations are plausible real-world mistakes