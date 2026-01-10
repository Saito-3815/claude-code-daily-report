import { z } from 'zod';
import { reportStatusSchema, reportScopeSchema } from './enums';
import { paginationQuerySchema } from '../common';

/**
 * 営業担当者の基本情報スキーマ
 */
export const salespersonBasicSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
});

/**
 * 営業担当者詳細情報スキーマ（上長情報含む）
 */
export const salespersonDetailSchema = z.object({
  id: z.number().int().positive(),
  employee_code: z.string(),
  name: z.string(),
  department: z.string(),
  manager: z
    .object({
      id: z.number().int().positive(),
      name: z.string(),
    })
    .nullable(),
});

/**
 * 日報一覧項目のスキーマ
 */
export const reportListItemSchema = z.object({
  id: z.number().int().positive(),
  report_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: reportStatusSchema,
  submitted_at: z.string().datetime().nullable(),
  visit_count: z.number().int().nonnegative(),
  salesperson: salespersonBasicSchema,
  has_unread_comments: z.boolean(),
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

/**
 * 日報一覧取得クエリパラメータのスキーマ
 */
export const reportListQuerySchema = paginationQuerySchema.extend({
  salesperson_id: z.coerce.number().int().positive().optional(),
  status: reportStatusSchema.optional(),
  date_from: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  date_to: z.string().regex(/^\d{4}-\d{2}-\d{2}$/).optional(),
  scope: reportScopeSchema.default('own'),
});

/**
 * 日報詳細のスキーマ（訪問記録、Problem、Planを含む）
 * 注: 訪問記録、Problem、Planは別ファイルで定義
 */
export const reportDetailBaseSchema = z.object({
  id: z.number().int().positive(),
  report_date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/),
  status: reportStatusSchema,
  submitted_at: z.string().datetime().nullable(),
  salesperson: salespersonDetailSchema,
  created_at: z.string().datetime(),
  updated_at: z.string().datetime(),
});

/**
 * 日報作成リクエストのスキーマ
 */
export const createReportRequestBaseSchema = z.object({
  report_date: z
    .string()
    .regex(/^\d{4}-\d{2}-\d{2}$/, '日付はYYYY-MM-DD形式で入力してください'),
});

/**
 * 日報更新リクエストのスキーマ
 */
export const updateReportRequestBaseSchema = z.object({});

/**
 * 日報提出レスポンスのスキーマ
 */
export const submitReportResponseDataSchema = z.object({
  id: z.number().int().positive(),
  status: z.literal('submitted'),
  submitted_at: z.string().datetime(),
});

/**
 * 日報確認レスポンスのスキーマ
 */
export const confirmReportResponseDataSchema = z.object({
  id: z.number().int().positive(),
  status: z.literal('confirmed'),
  confirmed_at: z.string().datetime(),
});

/**
 * 型エクスポート
 */
export type SalespersonBasic = z.infer<typeof salespersonBasicSchema>;
export type SalespersonDetail = z.infer<typeof salespersonDetailSchema>;
export type ReportListItem = z.infer<typeof reportListItemSchema>;
export type ReportListQuery = z.infer<typeof reportListQuerySchema>;
export type ReportDetailBase = z.infer<typeof reportDetailBaseSchema>;
export type CreateReportRequestBase = z.infer<
  typeof createReportRequestBaseSchema
>;
export type UpdateReportRequestBase = z.infer<
  typeof updateReportRequestBaseSchema
>;
export type SubmitReportResponseData = z.infer<
  typeof submitReportResponseDataSchema
>;
export type ConfirmReportResponseData = z.infer<
  typeof confirmReportResponseDataSchema
>;
