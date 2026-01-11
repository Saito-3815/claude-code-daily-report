/**
 * Environment Variables Validation Tests
 */

import { describe, it, expect, beforeEach, afterEach } from 'vitest';

describe('Environment Variables Validation', () => {
  const originalEnv = process.env;

  beforeEach(() => {
    // Reset modules to ensure fresh import
    vi.resetModules();
    // Create a copy of the original environment
    process.env = { ...originalEnv };
  });

  afterEach(() => {
    // Restore original environment
    process.env = originalEnv;
  });

  it('should validate required DATABASE_URL', async () => {
    process.env.DATABASE_URL = '';

    await expect(async () => {
      await import('../env');
    }).rejects.toThrow();
  });

  it('should validate JWT_SECRET minimum length', async () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/test';
    process.env.JWT_SECRET = 'short'; // Less than 32 characters

    await expect(async () => {
      await import('../env');
    }).rejects.toThrow();
  });

  it('should validate JWT_REFRESH_SECRET minimum length', async () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/test';
    process.env.JWT_SECRET = 'a'.repeat(32);
    process.env.JWT_REFRESH_SECRET = 'short'; // Less than 32 characters

    await expect(async () => {
      await import('../env');
    }).rejects.toThrow();
  });

  it('should accept valid environment variables', async () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/test';
    process.env.JWT_SECRET = 'a'.repeat(32);
    process.env.JWT_REFRESH_SECRET = 'b'.repeat(32);
    process.env.NODE_ENV = 'test';
    process.env.BCRYPT_ROUNDS = '10';
    process.env.RATE_LIMIT_LOGIN = '10';
    process.env.RATE_LIMIT_API = '100';

    const { env } = await import('../env');

    expect(env.DATABASE_URL).toBe('postgresql://user:pass@localhost:5432/test');
    expect(env.JWT_SECRET).toBe('a'.repeat(32));
    expect(env.NODE_ENV).toBe('test');
    expect(env.BCRYPT_ROUNDS).toBe(10);
  });

  it('should transform string numbers to actual numbers', async () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/test';
    process.env.JWT_SECRET = 'a'.repeat(32);
    process.env.JWT_REFRESH_SECRET = 'b'.repeat(32);
    process.env.BCRYPT_ROUNDS = '8';
    process.env.RATE_LIMIT_LOGIN = '5';
    process.env.RATE_LIMIT_API = '50';

    const { env } = await import('../env');

    expect(typeof env.BCRYPT_ROUNDS).toBe('number');
    expect(env.BCRYPT_ROUNDS).toBe(8);
    expect(typeof env.RATE_LIMIT_LOGIN).toBe('number');
    expect(env.RATE_LIMIT_LOGIN).toBe(5);
    expect(typeof env.RATE_LIMIT_API).toBe('number');
    expect(env.RATE_LIMIT_API).toBe(50);
  });

  it('should validate BCRYPT_ROUNDS range', async () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/test';
    process.env.JWT_SECRET = 'a'.repeat(32);
    process.env.JWT_REFRESH_SECRET = 'b'.repeat(32);
    process.env.BCRYPT_ROUNDS = '3'; // Less than 4

    await expect(async () => {
      await import('../env');
    }).rejects.toThrow();
  });

  it('should set default values for optional fields', async () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/test';
    process.env.JWT_SECRET = 'a'.repeat(32);
    process.env.JWT_REFRESH_SECRET = 'b'.repeat(32);
    // Don't set optional fields

    const { env } = await import('../env');

    expect(env.JWT_EXPIRES_IN).toBe('1h');
    expect(env.JWT_REFRESH_EXPIRES_IN).toBe('30d');
    expect(env.NEXT_PUBLIC_APP_URL).toBe('http://localhost:3000');
  });

  it('should validate NODE_ENV enum values', async () => {
    process.env.DATABASE_URL = 'postgresql://user:pass@localhost:5432/test';
    process.env.JWT_SECRET = 'a'.repeat(32);
    process.env.JWT_REFRESH_SECRET = 'b'.repeat(32);
    process.env.NODE_ENV = 'invalid';

    await expect(async () => {
      await import('../env');
    }).rejects.toThrow();
  });
});
