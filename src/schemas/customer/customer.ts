import { z } from 'zod';
import { paginationQuerySchema } from '../common';

/**
 * 顧客のスキーマ
 */
export const customerSchema = z.object({
  id: z.number().int().positive(),
  customer_code: z.string(),
  name: z.string(),
  industry: z.string().nullable(),
  postal_code: z.string().nullable(),
  address: z.string().nullable(),
  phone: z.string().nullable(),
  is_active: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

/**
 * 顧客一覧取得クエリパラメータのスキーマ
 */
export const customerListQuerySchema = paginationQuerySchema.extend({
  customer_code: z.string().optional(),
  name: z.string().optional(),
  industry: z.string().optional(),
  is_active: z.coerce.boolean().default(true),
});

/**
 * 顧客登録リクエストのスキーマ
 */
export const createCustomerRequestSchema = z.object({
  customer_code: z
    .string()
    .min(1, '顧客コードを入力してください')
    .max(10, '顧客コードは10文字以内で入力してください'),
  name: z
    .string()
    .min(1, '顧客名を入力してください')
    .max(100, '顧客名は100文字以内で入力してください'),
  industry: z.string().optional().nullable(),
  postal_code: z
    .string()
    .regex(/^\d{3}-\d{4}$/, '正しい郵便番号形式で入力してください')
    .optional()
    .nullable(),
  address: z.string().max(255, '住所は255文字以内で入力してください').optional().nullable(),
  phone: z.string().max(20, '電話番号は20文字以内で入力してください').optional().nullable(),
  is_active: z.boolean().default(true),
});

/**
 * 顧客更新リクエストのスキーマ
 */
export const updateCustomerRequestSchema = createCustomerRequestSchema.partial().extend({
  name: z
    .string()
    .min(1, '顧客名を入力してください')
    .max(100, '顧客名は100文字以内で入力してください')
    .optional(),
});

/**
 * 型エクスポート
 */
export type Customer = z.infer<typeof customerSchema>;
export type CustomerListQuery = z.infer<typeof customerListQuerySchema>;
export type CreateCustomerRequest = z.infer<typeof createCustomerRequestSchema>;
export type UpdateCustomerRequest = z.infer<typeof updateCustomerRequestSchema>;
