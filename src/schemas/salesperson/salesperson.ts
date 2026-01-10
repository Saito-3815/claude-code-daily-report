import { z } from 'zod';
import { paginationQuerySchema } from '../common';

/**
 * 上長情報のスキーマ
 */
export const managerSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
});

/**
 * 営業担当者のスキーマ
 */
export const salespersonSchema = z.object({
  id: z.number().int().positive(),
  employee_code: z.string(),
  name: z.string(),
  email: z.string().email(),
  department: z.string(),
  manager: managerSchema.nullable(),
  is_active: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

/**
 * 営業担当者詳細のスキーマ（自分の情報用）
 */
export const salespersonMeSchema = salespersonSchema.extend({
  is_manager: z.boolean(),
  subordinate_count: z.number().int().nonnegative(),
});

/**
 * 部下情報のスキーマ
 */
export const subordinateSchema = z.object({
  id: z.number().int().positive(),
  employee_code: z.string(),
  name: z.string(),
  email: z.string().email(),
  department: z.string(),
  is_active: z.boolean(),
});

/**
 * 営業一覧取得クエリパラメータのスキーマ
 */
export const salespersonListQuerySchema = paginationQuerySchema.extend({
  employee_code: z.string().optional(),
  name: z.string().optional(),
  department: z.string().optional(),
  is_active: z.coerce.boolean().default(true),
});

/**
 * 営業登録リクエストのスキーマ
 */
export const createSalespersonRequestSchema = z.object({
  employee_code: z
    .string()
    .min(1, '社員番号を入力してください')
    .max(10, '社員番号は10文字以内で入力してください'),
  name: z
    .string()
    .min(1, '氏名を入力してください')
    .max(50, '氏名は50文字以内で入力してください'),
  email: z.string().email('正しいメールアドレス形式で入力してください'),
  password: z
    .string()
    .min(8, 'パスワードは8文字以上で入力してください')
    .max(128, 'パスワードは128文字以内で入力してください'),
  department: z.string().min(1, '部署を入力してください'),
  manager_id: z.number().int().positive().optional().nullable(),
  is_active: z.boolean().default(true),
});

/**
 * 営業更新リクエストのスキーマ
 */
export const updateSalespersonRequestSchema = createSalespersonRequestSchema
  .partial()
  .extend({
    password: z
      .string()
      .min(8, 'パスワードは8文字以上で入力してください')
      .max(128, 'パスワードは128文字以内で入力してください')
      .optional(),
  });

/**
 * 型エクスポート
 */
export type Manager = z.infer<typeof managerSchema>;
export type Salesperson = z.infer<typeof salespersonSchema>;
export type SalespersonMe = z.infer<typeof salespersonMeSchema>;
export type Subordinate = z.infer<typeof subordinateSchema>;
export type SalespersonListQuery = z.infer<typeof salespersonListQuerySchema>;
export type CreateSalespersonRequest = z.infer<
  typeof createSalespersonRequestSchema
>;
export type UpdateSalespersonRequest = z.infer<
  typeof updateSalespersonRequestSchema
>;
