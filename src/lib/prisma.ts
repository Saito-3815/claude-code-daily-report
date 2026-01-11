/**
 * Prisma Client Singleton
 *
 * This module provides a singleton instance of Prisma Client to prevent
 * connection pool exhaustion in development mode with hot reloading.
 *
 * Best Practices:
 * - Reuses the same Prisma Client instance across hot reloads in development
 * - Creates a fresh instance in production for each deployment
 * - Prevents "too many clients already" errors
 */

import { PrismaClient } from '@prisma/client';
import { isDevelopment } from './env';

/**
 * Global type augmentation for PrismaClient instance
 * This prevents TypeScript errors when storing Prisma Client in globalThis
 */
declare global {
  var prisma: PrismaClient | undefined;
}

/**
 * Prisma Client configuration options
 */
const prismaOptions = {
  // Log queries in development for debugging
  log: isDevelopment ? (['query', 'error', 'warn'] as const) : (['error'] as const),
};

/**
 * Create or retrieve Prisma Client singleton instance
 *
 * In development:
 * - Reuses existing instance from globalThis to survive hot reloads
 * - Prevents connection pool exhaustion
 *
 * In production:
 * - Creates new instance for each deployment
 * - No need to store in globalThis as there's no hot reload
 */
export const prisma = globalThis.prisma ?? new PrismaClient(prismaOptions);

/**
 * Store Prisma Client instance in globalThis during development
 * This ensures the same instance is reused across hot reloads
 */
if (isDevelopment) {
  globalThis.prisma = prisma;
}

/**
 * Database connection utilities
 */
export const db = {
  /**
   * Test database connection
   *
   * @returns {Promise<boolean>} True if connection is successful
   * @throws {Error} If connection fails
   */
  async testConnection(): Promise<boolean> {
    try {
      await prisma.$queryRaw`SELECT 1`;
      return true;
    } catch (error) {
      console.error('❌ Database connection failed:', error);
      throw error;
    }
  },

  /**
   * Disconnect from database
   * Should be called when shutting down the application
   */
  async disconnect(): Promise<void> {
    await prisma.$disconnect();
  },

  /**
   * Connect to database
   * Useful for explicit connection management
   */
  async connect(): Promise<void> {
    await prisma.$connect();
  },

  /**
   * Execute a transaction
   *
   * @param fn Transaction function
   * @returns Result of transaction
   */
  async transaction<T>(
    fn: (
      tx: Omit<
        PrismaClient,
        '$connect' | '$disconnect' | '$on' | '$transaction' | '$use' | '$extends'
      >
    ) => Promise<T>
  ): Promise<T> {
    return prisma.$transaction(fn);
  },
};

/**
 * Handle graceful shutdown
 * Disconnect from database when process exits
 */
if (typeof window === 'undefined') {
  process.on('beforeExit', async () => {
    await db.disconnect();
  });

  process.on('SIGINT', async () => {
    await db.disconnect();
    process.exit(0);
  });

  process.on('SIGTERM', async () => {
    await db.disconnect();
    process.exit(0);
  });
}
