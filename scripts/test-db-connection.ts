/* eslint-disable no-console */
/**
 * Database Connection Test Script
 *
 * This script tests the database connection and displays connection information.
 * Usage: npm run db:test
 */

// Load environment variables from .env file
import { config } from 'dotenv';
config();

import { db, prisma } from '../src/lib/prisma';
import { env } from '../src/lib/env';

async function testDatabaseConnection(): Promise<void> {
  console.log('🔍 Testing database connection...\n');

  try {
    // Display connection information (without password)
    const dbUrl = new URL(env.DATABASE_URL);
    console.log('📊 Database Configuration:');
    console.log(`   Host: ${dbUrl.hostname}`);
    console.log(`   Port: ${dbUrl.port}`);
    console.log(`   Database: ${dbUrl.pathname.slice(1).split('?')[0]}`);
    console.log(`   User: ${dbUrl.username}`);
    console.log(`   Schema: ${dbUrl.searchParams.get('schema') || 'public'}\n`);

    // Test connection
    console.log('🔌 Attempting to connect to database...');
    const isConnected = await db.testConnection();

    if (isConnected) {
      console.log('✅ Database connection successful!\n');

      // Get database version
      const version = await prisma.$queryRaw<Array<{ version: string }>>`SELECT version()`;
      console.log('📌 PostgreSQL Version:');
      console.log(`   ${version[0]?.version}\n`);

      // Check if tables exist
      console.log('📋 Checking database tables...');
      const tables = await prisma.$queryRaw<
        Array<{ tablename: string }>
      >`SELECT tablename FROM pg_tables WHERE schemaname = 'public' ORDER BY tablename`;

      if (tables.length === 0) {
        console.log('⚠️  No tables found. Run migrations first:');
        console.log('   npx prisma migrate dev\n');
      } else {
        console.log(`✅ Found ${tables.length} tables:`);
        tables.forEach((table) => {
          console.log(`   - ${table.tablename}`);
        });
        console.log('');
      }

      // Get table record counts
      if (tables.length > 0) {
        console.log('📊 Record counts:');
        try {
          const [
            salespersonCount,
            customerCount,
            dailyReportCount,
            visitRecordCount,
            problemCount,
            planCount,
            commentCount,
          ] = await Promise.all([
            prisma.salesperson.count(),
            prisma.customer.count(),
            prisma.dailyReport.count(),
            prisma.visitRecord.count(),
            prisma.problem.count(),
            prisma.plan.count(),
            prisma.comment.count(),
          ]);

          console.log(`   Salespersons: ${salespersonCount}`);
          console.log(`   Customers: ${customerCount}`);
          console.log(`   Daily Reports: ${dailyReportCount}`);
          console.log(`   Visit Records: ${visitRecordCount}`);
          console.log(`   Problems: ${problemCount}`);
          console.log(`   Plans: ${planCount}`);
          console.log(`   Comments: ${commentCount}`);
          console.log('');

          if (salespersonCount === 0 && customerCount === 0 && dailyReportCount === 0) {
            console.log('💡 Database is empty. Run seed script:');
            console.log('   npm run db:seed\n');
          }
        } catch {
          console.log('⚠️  Could not get record counts. Tables may not be created yet.\n');
        }
      }

      console.log('✅ All checks passed!');
    }
  } catch (error) {
    console.error('❌ Database connection test failed:');
    if (error instanceof Error) {
      console.error(`   ${error.message}\n`);
    } else {
      console.error('   Unknown error occurred\n');
    }

    console.log('🔧 Troubleshooting:');
    console.log('   1. Ensure PostgreSQL is running');
    console.log('   2. Verify DATABASE_URL in .env file');
    console.log('   3. Check database credentials');
    console.log('   4. Ensure database exists');
    console.log('   5. Run: npx prisma migrate dev\n');

    process.exit(1);
  } finally {
    await db.disconnect();
  }
}

// Run the test
testDatabaseConnection().catch((error) => {
  console.error('Fatal error:', error);
  process.exit(1);
});
