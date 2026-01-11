/**
 * Database Test Setup
 *
 * This module provides utilities for setting up and tearing down
 * database connections in tests. It handles environment-specific
 * behavior and provides clear logging for debugging.
 */

import { prisma, db } from '@/lib/prisma';

/**
 * Check if database is available for testing
 *
 * This function attempts to connect to the database and returns
 * whether the connection was successful. It's used to determine
 * if database tests should be run or skipped.
 *
 * @returns {Promise<boolean>} True if database is available
 */
export async function isDatabaseAvailable(): Promise<boolean> {
  try {
    await db.connect();
    await db.testConnection();
    return true;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.warn('⚠️  Database not available for testing:', errorMessage);
    console.warn(
      '💡 Tip: Database tests will be skipped. To run database tests, ensure PostgreSQL is running.'
    );
    return false;
  }
}

/**
 * Setup database for testing
 *
 * Call this in beforeAll() hooks to establish database connection
 * and optionally seed test data.
 *
 * @returns {Promise<boolean>} True if setup was successful
 */
export async function setupDatabase(): Promise<boolean> {
  const isAvailable = await isDatabaseAvailable();

  if (isAvailable) {
    console.log('✅ Database connected successfully for testing');
  }

  return isAvailable;
}

/**
 * Cleanup database after testing
 *
 * Call this in afterAll() hooks to disconnect from database
 * and clean up resources.
 */
export async function cleanupDatabase(): Promise<void> {
  try {
    await db.disconnect();
    console.log('✅ Database disconnected successfully');
  } catch (error) {
    console.warn('⚠️  Error disconnecting from database:', error);
  }
}

/**
 * Clear all data from test database
 *
 * DANGER: This deletes ALL data from the database.
 * Only use in test environment!
 *
 * @throws {Error} If not in test environment
 */
export async function clearDatabase(): Promise<void> {
  if (process.env.NODE_ENV !== 'test') {
    throw new Error('clearDatabase() can only be called in test environment');
  }

  // Delete in correct order to respect foreign key constraints
  await prisma.comment.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.visitRecord.deleteMany();
  await prisma.dailyReport.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.salesperson.deleteMany();
}
