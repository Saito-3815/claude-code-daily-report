# Testing Guide

This document explains the testing strategy and how to run tests for the Daily Report System.

## Test Strategy

Our testing approach follows the strategy outlined in `doc/TEST_DEFINITION.md`:

1. **Unit Tests**: Test individual modules and functions in isolation
2. **Integration Tests**: Test API endpoints and database operations
3. **System Tests**: Test complete workflows and performance
4. **Acceptance Tests**: Test business scenarios

## Test Environments

### Local Development (without database)

By default, tests can run without a database server. Database integration tests will be automatically skipped.

```bash
# Run all tests
npm test

# Run tests with coverage
npm run test:coverage

# Run tests in watch mode
npm run test:watch
```

**Expected behavior**:

- Unit tests (env validation, schema validation): ✅ Pass
- Database integration tests: ⚠️ Skipped (no database available)
- Coverage: ~60% (database code paths not covered)

### Local Development (with database)

To run full integration tests locally, start a PostgreSQL server:

```bash
# Using Docker (recommended)
docker run --name postgres-test \
  -e POSTGRES_USER=test_user \
  -e POSTGRES_PASSWORD=test_password \
  -e POSTGRES_DB=daily_report_test \
  -p 5432:5432 \
  -d postgres:16-alpine

# Run migrations
npx prisma migrate deploy

# Run tests
npm test
```

**Expected behavior**:

- All tests: ✅ Pass
- Database integration tests: ✅ Pass
- Coverage: ~80% (full coverage)

### CI Environment

GitHub Actions automatically sets up a PostgreSQL server and runs all tests.

**Expected behavior**:

- All tests: ✅ Pass
- Database integration tests: ✅ Pass
- Coverage: ~80% (full coverage)

## Test Files Structure

```
src/
├── lib/
│   ├── __tests__/
│   │   ├── env.test.ts          # Environment validation tests
│   │   └── prisma.test.ts       # Database integration tests
├── test/
│   ├── setup.ts                 # Global test setup
│   └── db-setup.ts              # Database test utilities
```

## Coverage Thresholds

### Current (Issue #5: Database Setup)

```typescript
{
  lines: 60,
  functions: 60,
  branches: 60,
  statements: 60
}
```

**Rationale**: This is the initial database setup phase. Integration tests are implemented but intentionally skip when no database is available in local development. This allows developers to run tests quickly without requiring database setup.

### Target (Future Phases)

```typescript
{
  lines: 80,
  functions: 80,
  branches: 80,
  statements: 80
}
```

**Timeline**: Coverage threshold will be increased to 80% when:

1. Full business logic services are implemented
2. Complete API endpoint tests are added
3. All integration tests can reliably run in both local and CI environments

## Writing Tests

### Unit Tests (No Database Required)

```typescript
import { describe, it, expect } from 'vitest';

describe('MyModule', () => {
  it('should do something', () => {
    expect(true).toBe(true);
  });
});
```

### Integration Tests (Database Required)

```typescript
import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { setupDatabase, cleanupDatabase } from '@/test/db-setup';
import { prisma } from '@/lib/prisma';

describe('Database Operations', () => {
  let isConnected = false;

  beforeAll(async () => {
    isConnected = await setupDatabase();
  });

  afterAll(async () => {
    if (isConnected) {
      await cleanupDatabase();
    }
  });

  it.skipIf(!isConnected)('should query database', async () => {
    const count = await prisma.salesperson.count();
    expect(count).toBeGreaterThanOrEqual(0);
  });
});
```

**Key points**:

- Use `setupDatabase()` in `beforeAll()` to check database availability
- Use `it.skipIf(!isConnected)` to skip tests when database is unavailable
- Use `cleanupDatabase()` in `afterAll()` to cleanup resources

## Database Test Utilities

### `setupDatabase()`

Establishes database connection and returns whether the database is available.

```typescript
const isConnected = await setupDatabase();
```

### `cleanupDatabase()`

Disconnects from database and cleans up resources.

```typescript
await cleanupDatabase();
```

### `clearDatabase()`

**DANGER**: Deletes all data from the test database. Only available in test environment.

```typescript
await clearDatabase();
```

## Troubleshooting

### Tests are skipping

**Problem**: Database integration tests show as "skipped"

**Solution**:

1. Check if PostgreSQL is running: `pg_isready -h localhost -p 5432`
2. Verify `.env.test` has correct DATABASE_URL
3. Run migrations: `npx prisma migrate deploy`

### Coverage is below threshold

**Problem**: Coverage is below 60%

**Possible causes**:

1. New code added without tests
2. Database tests are skipped (expected in local development)

**Solutions**:

1. Add tests for new code
2. Run tests with database available (see "Local Development (with database)")
3. Check CI results - coverage should be higher in CI

### Environment variable errors

**Problem**: Tests fail with "Invalid environment variables"

**Solution**:

1. Ensure `.env.test` exists and has all required variables
2. Check that `NODE_ENV=test` is set
3. Verify JWT secrets are at least 32 characters long

## CI/CD

### GitHub Actions

Tests run automatically on:

- Push to `main` or `develop` branches
- Pull requests to `main` or `develop` branches

Workflow steps:

1. Setup PostgreSQL service
2. Install dependencies
3. Generate Prisma Client
4. Run migrations
5. Run tests with coverage
6. Upload coverage to Codecov

### Coverage Reports

Coverage reports are automatically uploaded to Codecov after each CI run.

## Best Practices

1. **Write unit tests first**: Test business logic without database dependencies
2. **Use integration tests sparingly**: Only for testing database operations
3. **Keep tests isolated**: Each test should be independent
4. **Clean up resources**: Always disconnect from database in `afterAll()`
5. **Use meaningful test names**: Describe what is being tested
6. **Test edge cases**: Not just happy paths
7. **Mock external dependencies**: Use Vitest mocks for external services

## Next Steps

- [ ] Implement service layer with business logic
- [ ] Add API endpoint tests
- [ ] Increase coverage threshold to 80%
- [ ] Add E2E tests with Playwright
- [ ] Set up test data fixtures
- [ ] Implement test data factories
