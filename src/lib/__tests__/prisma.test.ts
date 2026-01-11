/**
 * Prisma Client Tests
 */

import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { prisma, db } from '../prisma';

describe('Prisma Client', () => {
  let isConnected = false;

  beforeAll(async () => {
    // Try to connect to the database
    // In test environment, database may not be available
    try {
      await db.connect();
      isConnected = true;
    } catch (error) {
      console.warn('Database connection failed in test environment:', error);
      isConnected = false;
    }
  });

  afterAll(async () => {
    // Clean up connection if it was established
    if (isConnected) {
      await db.disconnect();
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
