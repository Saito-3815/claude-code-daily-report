/* eslint-disable no-console */
/**
 * Database Seed Script
 *
 * This script populates the database with initial test data.
 * Usage: npm run db:seed
 *
 * Data includes:
 * - Salespersons (managers and subordinates)
 * - Customers
 * - Daily Reports with Visit Records, Problems, and Plans
 * - Comments
 */

// Load environment variables from .env file
import { config } from 'dotenv';
config();

import { PrismaClient } from '@prisma/client';
import * as crypto from 'crypto';

const prisma = new PrismaClient();

/**
 * Hash password using a simple method for seed data
 * In production, use bcrypt
 */
function hashPassword(password: string): string {
  // For seed data, we'll use a simple hash
  // In production, this should use bcrypt from the actual auth service
  return crypto.createHash('sha256').update(password).digest('hex');
}

/**
 * Main seed function
 */
async function main() {
  console.log('🌱 Starting database seed...\n');

  // Clear existing data in correct order (respecting foreign key constraints)
  console.log('🗑️  Clearing existing data...');
  await prisma.comment.deleteMany();
  await prisma.plan.deleteMany();
  await prisma.problem.deleteMany();
  await prisma.visitRecord.deleteMany();
  await prisma.dailyReport.deleteMany();
  await prisma.customer.deleteMany();
  await prisma.salesperson.deleteMany();
  console.log('✅ Existing data cleared\n');

  // Create Salespersons
  console.log('👥 Creating salespersons...');

  // Manager (no manager_id)
  const manager = await prisma.salesperson.create({
    data: {
      employeeCode: 'E0001',
      name: '佐藤部長',
      email: 'sato@example.com',
      password: hashPassword('password123'),
      department: '営業部',
      isActive: true,
    },
  });
  console.log(`   ✓ Created manager: ${manager.name}`);

  // Subordinates
  const yamada = await prisma.salesperson.create({
    data: {
      employeeCode: 'E0002',
      name: '山田太郎',
      email: 'yamada@example.com',
      password: hashPassword('password123'),
      department: '営業部',
      managerId: manager.id,
      isActive: true,
    },
  });
  console.log(`   ✓ Created salesperson: ${yamada.name}`);

  const suzuki = await prisma.salesperson.create({
    data: {
      employeeCode: 'E0003',
      name: '鈴木花子',
      email: 'suzuki@example.com',
      password: hashPassword('password123'),
      department: '営業部',
      managerId: manager.id,
      isActive: true,
    },
  });
  console.log(`   ✓ Created salesperson: ${suzuki.name}`);

  const tanaka = await prisma.salesperson.create({
    data: {
      employeeCode: 'E0004',
      name: '田中一郎',
      email: 'tanaka@example.com',
      password: hashPassword('password123'),
      department: '営業部',
      managerId: manager.id,
      isActive: true,
    },
  });
  console.log(`   ✓ Created salesperson: ${tanaka.name}\n`);

  // Create Customers
  console.log('🏢 Creating customers...');

  const customers = await Promise.all([
    prisma.customer.create({
      data: {
        customerCode: 'C0001',
        name: '株式会社ABC',
        postalCode: '100-0001',
        address: '東京都千代田区千代田1-1-1',
        phone: '03-1234-5678',
        industry: '製造業',
        isActive: true,
      },
    }),
    prisma.customer.create({
      data: {
        customerCode: 'C0002',
        name: '株式会社XYZ',
        postalCode: '100-0002',
        address: '東京都千代田区丸の内1-1-1',
        phone: '03-2345-6789',
        industry: '小売業',
        isActive: true,
      },
    }),
    prisma.customer.create({
      data: {
        customerCode: 'C0003',
        name: '株式会社DEF',
        postalCode: '100-0003',
        address: '東京都千代田区大手町1-1-1',
        phone: '03-3456-7890',
        industry: 'IT',
        isActive: true,
      },
    }),
    prisma.customer.create({
      data: {
        customerCode: 'C0004',
        name: '株式会社GHI',
        postalCode: '100-0004',
        address: '東京都港区六本木1-1-1',
        phone: '03-4567-8901',
        industry: 'サービス業',
        isActive: true,
      },
    }),
    prisma.customer.create({
      data: {
        customerCode: 'C0005',
        name: '株式会社JKL',
        postalCode: '100-0005',
        address: '東京都渋谷区渋谷1-1-1',
        phone: '03-5678-9012',
        industry: '建設業',
        isActive: true,
      },
    }),
  ]);
  console.log(`   ✓ Created ${customers.length} customers\n`);

  // Create Daily Reports with Visit Records, Problems, and Plans
  console.log('📝 Creating daily reports...');

  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  const twoDaysAgo = new Date(today);
  twoDaysAgo.setDate(twoDaysAgo.getDate() - 2);

  // Yamada's report from 2 days ago (confirmed)
  const report1 = await prisma.dailyReport.create({
    data: {
      salespersonId: yamada.id,
      reportDate: twoDaysAgo,
      status: 'confirmed',
      submittedAt: new Date(twoDaysAgo.getTime() + 18 * 60 * 60 * 1000), // 18:00
      confirmedAt: new Date(twoDaysAgo.getTime() + 19 * 60 * 60 * 1000), // 19:00
      visitRecords: {
        create: [
          {
            customerId: customers[0].id,
            visitTime: '09:00',
            result: 'negotiating',
            content: '新製品の提案を実施。次回見積提出予定。',
          },
          {
            customerId: customers[1].id,
            visitTime: '14:00',
            result: 'closed',
            content: '契約締結。来月からサービス開始。',
          },
        ],
      },
      problems: {
        create: [
          {
            content: '競合他社の値下げにより、価格面での優位性が低下している。',
            displayOrder: 1,
          },
        ],
      },
      plans: {
        create: [
          {
            content: 'ABC社へ見積書を提出',
            displayOrder: 1,
          },
          {
            content: 'DEF社へアポイント電話',
            displayOrder: 2,
          },
        ],
      },
    },
    include: {
      problems: true,
      plans: true,
    },
  });
  console.log(`   ✓ Created report for ${yamada.name} (${twoDaysAgo.toISOString().split('T')[0]})`);

  // Add comment to Yamada's problem
  await prisma.comment.create({
    data: {
      salespersonId: manager.id,
      commentableType: 'Problem',
      commentableId: report1.problems[0].id,
      content: '来週のMTGで対策を検討しましょう。',
    },
  });

  // Yamada's report from yesterday (submitted)
  await prisma.dailyReport.create({
    data: {
      salespersonId: yamada.id,
      reportDate: yesterday,
      status: 'submitted',
      submittedAt: new Date(yesterday.getTime() + 18 * 60 * 60 * 1000),
      visitRecords: {
        create: [
          {
            customerId: customers[2].id,
            visitTime: '10:00',
            result: 'info_gathering',
            content: '新規案件のヒアリング実施。',
          },
          {
            customerId: customers[3].id,
            visitTime: '15:00',
            result: 'negotiating',
            content: '提案内容の説明と質疑応答。',
          },
        ],
      },
      problems: {
        create: [
          {
            content: '新規顧客開拓の時間が十分に取れていない。',
            displayOrder: 1,
          },
        ],
      },
      plans: {
        create: [
          {
            content: 'GHI社へ提案書を提出',
            displayOrder: 1,
          },
        ],
      },
    },
  });
  console.log(`   ✓ Created report for ${yamada.name} (${yesterday.toISOString().split('T')[0]})`);

  // Suzuki's report from yesterday (submitted)
  await prisma.dailyReport.create({
    data: {
      salespersonId: suzuki.id,
      reportDate: yesterday,
      status: 'submitted',
      submittedAt: new Date(yesterday.getTime() + 17 * 60 * 60 * 1000),
      visitRecords: {
        create: [
          {
            customerId: customers[4].id,
            visitTime: '11:00',
            result: 'closed',
            content: '新規契約締結成功。',
          },
          {
            customerId: customers[0].id,
            visitTime: '14:00',
            result: 'negotiating',
            content: '追加提案の検討依頼を受ける。',
          },
          {
            customerId: customers[1].id,
            visitTime: '16:00',
            result: 'info_gathering',
            content: '来期の予算確認。',
          },
        ],
      },
      problems: {
        create: [
          {
            content: '既存顧客からの問い合わせ対応に時間を取られている。',
            displayOrder: 1,
          },
        ],
      },
      plans: {
        create: [
          {
            content: 'ABC社へフォローアップ訪問',
            displayOrder: 1,
          },
          {
            content: 'XYZ社へ提案資料送付',
            displayOrder: 2,
          },
        ],
      },
    },
  });
  console.log(`   ✓ Created report for ${suzuki.name} (${yesterday.toISOString().split('T')[0]})`);

  // Tanaka's draft report for today
  await prisma.dailyReport.create({
    data: {
      salespersonId: tanaka.id,
      reportDate: today,
      status: 'draft',
      visitRecords: {
        create: [
          {
            customerId: customers[2].id,
            visitTime: '09:30',
            result: 'negotiating',
            content: '下書き中の訪問記録',
          },
        ],
      },
    },
  });
  console.log(
    `   ✓ Created draft report for ${tanaka.name} (${today.toISOString().split('T')[0]})\n`
  );

  // Summary
  console.log('📊 Seed Summary:');
  const counts = {
    salespersons: await prisma.salesperson.count(),
    customers: await prisma.customer.count(),
    dailyReports: await prisma.dailyReport.count(),
    visitRecords: await prisma.visitRecord.count(),
    problems: await prisma.problem.count(),
    plans: await prisma.plan.count(),
    comments: await prisma.comment.count(),
  };

  console.log(`   Salespersons: ${counts.salespersons}`);
  console.log(`   Customers: ${counts.customers}`);
  console.log(`   Daily Reports: ${counts.dailyReports}`);
  console.log(`   Visit Records: ${counts.visitRecords}`);
  console.log(`   Problems: ${counts.problems}`);
  console.log(`   Plans: ${counts.plans}`);
  console.log(`   Comments: ${counts.comments}\n`);

  console.log('✅ Seed completed successfully!\n');
  console.log('📝 Test Credentials:');
  console.log('   Manager:');
  console.log('     Email: sato@example.com');
  console.log('     Password: password123');
  console.log('   Salesperson:');
  console.log('     Email: yamada@example.com');
  console.log('     Password: password123\n');
}

main()
  .catch((error) => {
    console.error('❌ Seed failed:', error);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
