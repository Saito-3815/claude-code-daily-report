/**
 * Database Setup Utilities Tests
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';

describe('Database Setup Utilities', () => {
  beforeEach(() => {
    // Clear all mocks before each test
    vi.clearAllMocks();
  });

  describe('Module Exports', () => {
    it('should export isDatabaseAvailable function', async () => {
      const { isDatabaseAvailable } = await import('../db-setup');
      expect(typeof isDatabaseAvailable).toBe('function');
    });

    it('should export setupDatabase function', async () => {
      const { setupDatabase } = await import('../db-setup');
      expect(typeof setupDatabase).toBe('function');
    });

    it('should export cleanupDatabase function', async () => {
      const { cleanupDatabase } = await import('../db-setup');
      expect(typeof cleanupDatabase).toBe('function');
    });

    it('should export clearDatabase function', async () => {
      const { clearDatabase } = await import('../db-setup');
      expect(typeof clearDatabase).toBe('function');
    });
  });

  describe('clearDatabase', () => {
    it('should throw error if not in test environment', async () => {
      // Save original NODE_ENV
      const originalEnv = process.env.NODE_ENV;

      try {
        // Set to non-test environment
        process.env.NODE_ENV = 'development';

        // Re-import to get fresh instance
        const { clearDatabase } = await import('../db-setup');

        // Should throw error
        await expect(clearDatabase()).rejects.toThrow(
          'clearDatabase() can only be called in test environment'
        );
      } finally {
        // Restore original NODE_ENV
        process.env.NODE_ENV = originalEnv;
      }
    });
  });
});
