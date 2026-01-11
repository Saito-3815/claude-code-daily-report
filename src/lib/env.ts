/**
 * Environment Variables Validation
 *
 * This module validates all required environment variables using Zod schema.
 * It ensures that the application has all necessary configuration before startup.
 */

// Load environment variables from .env file
// This is safe for Next.js as it will use built-in env loading when available
import { config } from 'dotenv';

// Load the appropriate .env file based on NODE_ENV
const envFile = process.env.NODE_ENV === 'test' ? '.env.test' : '.env';
config({ path: envFile });

import { z } from 'zod';

/**
 * Environment variables schema definition
 */
const envSchema = z.object({
  // Database
  DATABASE_URL: z
    .string()
    .min(1, 'DATABASE_URL is required')
    .url('DATABASE_URL must be a valid URL'),

  // JWT Settings
  JWT_SECRET: z.string().min(32, 'JWT_SECRET must be at least 32 characters for security'),
  JWT_EXPIRES_IN: z.string().default('1h'),
  JWT_REFRESH_SECRET: z
    .string()
    .min(32, 'JWT_REFRESH_SECRET must be at least 32 characters for security'),
  JWT_REFRESH_EXPIRES_IN: z.string().default('30d'),

  // Application
  NODE_ENV: z.enum(['development', 'test', 'production']).default('development'),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .url('NEXT_PUBLIC_APP_URL must be a valid URL')
    .default('http://localhost:3000'),

  // Security
  BCRYPT_ROUNDS: z
    .string()
    .regex(/^\d+$/, 'BCRYPT_ROUNDS must be a number')
    .transform(Number)
    .pipe(z.number().min(4).max(12))
    .default('10' as unknown as number),

  // Rate Limiting
  RATE_LIMIT_LOGIN: z
    .string()
    .regex(/^\d+$/, 'RATE_LIMIT_LOGIN must be a number')
    .transform(Number)
    .pipe(z.number().positive())
    .default('10' as unknown as number),
  RATE_LIMIT_API: z
    .string()
    .regex(/^\d+$/, 'RATE_LIMIT_API must be a number')
    .transform(Number)
    .pipe(z.number().positive())
    .default('100' as unknown as number),
});

/**
 * Type definition for validated environment variables
 */
export type Env = z.infer<typeof envSchema>;

/**
 * Validates environment variables
 *
 * @throws {Error} If validation fails
 * @returns {Env} Validated environment variables
 */
function validateEnv(): Env {
  const parsed = envSchema.safeParse(process.env);

  if (!parsed.success) {
    console.error('❌ Invalid environment variables:');
    console.error(JSON.stringify(parsed.error.format(), null, 2));
    throw new Error('Invalid environment variables');
  }

  return parsed.data;
}

/**
 * Validated environment variables
 * Exported as a singleton to ensure validation happens once
 */
export const env = validateEnv();

/**
 * Check if running in production
 */
export const isProduction = env.NODE_ENV === 'production';

/**
 * Check if running in development
 */
export const isDevelopment = env.NODE_ENV === 'development';

/**
 * Check if running in test
 */
export const isTest = env.NODE_ENV === 'test';
