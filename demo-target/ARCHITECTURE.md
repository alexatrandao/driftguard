# Architecture Rules

This document defines the architectural rules for the User Management Service. All code must comply with these rules unless explicitly documented as an exception.

## 1. Layering & Dependencies

### Rule 1.1: Controller-Service Boundary

**Rule**: Controllers must only call services, never repositories or data access layers directly.

**Rationale**: Maintaining a clear separation between the presentation layer (controllers) and data access layer (repositories) ensures business logic remains centralized in services. This prevents duplication of business rules, makes testing easier, and allows the data layer to evolve independently. Controllers should focus solely on HTTP concerns (request/response handling, status codes, headers) while services handle all business logic and data orchestration.

**Exception**: In rare cases where a controller needs to perform a simple, read-only query with zero business logic (e.g., health check endpoints that query database connectivity), direct repository access may be permitted if documented with a comment explaining why the service layer is bypassed.

### Rule 1.2: Repository Isolation

**Rule**: Services may call repositories and other services, but repositories must never call services or other repositories.

**Rationale**: Repositories should be pure data access objects with no business logic or cross-cutting concerns. Allowing repositories to call services creates circular dependencies and makes the codebase difficult to reason about. Repositories should focus exclusively on CRUD operations and data mapping. If complex operations require multiple repositories, that orchestration belongs in a service.

**Exception**: None. This rule has no exceptions. If you find yourself needing to call a service from a repository, the logic belongs in a service layer instead.

## 2. Module Boundaries

### Rule 2.1: Public Service Interfaces

**Rule**: Cross-module communication must go through public service interfaces, not internal implementations or direct repository access.

**Rationale**: Modules should expose well-defined public APIs through their service layer. This encapsulation allows modules to change their internal implementation (including repository structure, caching strategies, or data models) without affecting consumers. Direct access to another module's repositories or internal utilities creates tight coupling and makes refactoring dangerous.

**Exception**: Within the same bounded context (e.g., user authentication and user profile management), shared repositories may be accessed if both modules are maintained by the same team and have a documented shared data model. This exception must be explicitly noted in both modules' documentation.

## 3. External HTTP Communication

### Rule 3.1: Centralized HTTP Client

**Rule**: All external HTTP calls must use the centralized HTTP client in `lib/httpClient.ts`, not direct use of fetch, axios, or other HTTP libraries.

**Rationale**: A centralized HTTP client provides consistent error handling, logging, timeout configuration, retry logic, and request/response transformation across the entire application. It also makes it easier to add cross-cutting concerns like authentication headers, correlation IDs, or circuit breakers. Direct use of HTTP libraries leads to inconsistent behavior and makes it difficult to debug external API issues.

**Exception**: Test code and development utilities (e.g., health check scripts, database seeders) may use HTTP libraries directly if they are not part of the production application runtime.

### Rule 3.2: Externalized API Configuration

**Rule**: External API endpoints must be configured via environment variables, not hardcoded in source files.

**Rationale**: Hardcoded URLs make it impossible to test against different environments (development, staging, production) without code changes. They also create security risks when internal URLs are exposed in version control. Environment-based configuration allows the same codebase to work across all environments and makes it easy to redirect traffic during incidents or migrations.

**Exception**: Well-known, stable public API endpoints that never change (e.g., "https://api.github.com") may be hardcoded if they are truly environment-agnostic. However, even in these cases, configuration is preferred for consistency.

## 4. Secrets & Configuration Management

### Rule 4.1: Externalized Secrets

**Rule**: Secrets, API keys, and sensitive configuration must be loaded from environment variables via `lib/config.ts`, never hardcoded in source files.

**Rationale**: Hardcoded secrets in source code create severe security vulnerabilities. They are exposed in version control history, visible to anyone with repository access, and difficult to rotate. Secrets must be managed through secure configuration systems (environment variables, secret managers, or configuration services) and loaded at runtime. The config module provides a single point of control for all configuration and makes it easy to audit what secrets are being used.

**Exception**: Placeholder values for local development (e.g., "your-api-key-here", "REPLACE_ME") are acceptable in example configuration files (.env.example) but must never contain real secrets. Test code may use hardcoded fake secrets if they are clearly marked as test data.

## 5. Logging & Observability

### Rule 5.1: Centralized Logging

**Rule**: All logging must use the centralized logger from `lib/logger.ts`, not console.log, console.error, or direct logging library calls.

**Rationale**: A centralized logger ensures consistent log formatting, appropriate log levels, structured logging (JSON output), and proper integration with log aggregation systems. Console.log statements are difficult to filter, lack context (timestamps, request IDs, severity), and cannot be easily disabled in production. The centralized logger also makes it possible to add cross-cutting concerns like log sampling, PII redaction, or dynamic log level adjustment.

**Exception**: Application startup code (before the logger is initialized) may use console.log for critical bootstrap errors. Build scripts, CLI tools, and development utilities outside the main application may use console.log if they are not part of the production runtime.

---

## Compliance

All pull requests must comply with these architectural rules. The DriftGuard system will automatically review code changes for compliance. Violations must be either fixed or explicitly documented with an approved exception before merging.