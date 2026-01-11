/**
 * Prisma Client Tests
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma, db } from '../prisma';
import { setupDatabase, cleanupDatabase } from '@/test/db-setup';

describe('Prisma Client', () => {
  let isConnected = false;

  beforeAll(async () => {
    // Setup database connection
    // If database is not available, tests will be skipped
    isConnected = await setupDatabase();
  });

  afterAll(async () => {
    // Clean up connection if it was established
    if (isConnected) {
      await cleanupDatabase();
    }
  });

  it('should be defined', () => {
    expect(prisma).toBeDefined();
    expect(db).toBeDefined();
  });

  it.skipIf(!isConnected)('should test database connection successfully', async () => {
    const result = await db.testConnection();
    expect(result).toBe(true);
  });

  it.skipIf(!isConnected)('should execute raw query', async () => {
    const result = await prisma.$queryRaw<Array<{ result: number }>>`SELECT 1 as result`;
    expect(result).toHaveLength(1);
    expect(result[0].result).toBe(1);
  });

  it('should have transaction method', () => {
    expect(typeof db.transaction).toBe('function');
  });

  it.skipIf(!isConnected)('should execute transaction', async () => {
    const result = await db.transaction(async (tx) => {
      const count = await tx.salesperson.count();
      return count;
    });

    expect(typeof result).toBe('number');
    expect(result).toBeGreaterThanOrEqual(0);
  });

  describe('Database Utilities', () => {
    it('should have connect method', () => {
      expect(typeof db.connect).toBe('function');
    });

    it('should have disconnect method', () => {
      expect(typeof db.disconnect).toBe('function');
    });

    it('should have testConnection method', () => {
      expect(typeof db.testConnection).toBe('function');
    });
  });

  describe('Database Models', () => {
    it('should have Salesperson model', () => {
      expect(prisma.salesperson).toBeDefined();
    });

    it('should have Customer model', () => {
      expect(prisma.customer).toBeDefined();
    });

    it('should have DailyReport model', () => {
      expect(prisma.dailyReport).toBeDefined();
    });

    it('should have VisitRecord model', () => {
      expect(prisma.visitRecord).toBeDefined();
    });

    it('should have Problem model', () => {
      expect(prisma.problem).toBeDefined();
    });

    it('should have Plan model', () => {
      expect(prisma.plan).toBeDefined();
    });

    it('should have Comment model', () => {
      expect(prisma.comment).toBeDefined();
    });
  });

  describe('Database Operations', () => {
    it.skipIf(!isConnected)('should count salespersons', async () => {
      const count = await prisma.salesperson.count();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it.skipIf(!isConnected)('should count customers', async () => {
      const count = await prisma.customer.count();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });

    it.skipIf(!isConnected)('should count daily reports', async () => {
      const count = await prisma.dailyReport.count();
      expect(typeof count).toBe('number');
      expect(count).toBeGreaterThanOrEqual(0);
    });
  });
});
