import { z } from 'zod';
import { visitResultSchema } from './enums';

/**
 * 顧客基本情報のスキーマ
 */
export const customerBasicSchema = z.object({
  id: z.number().int().positive(),
  customer_code: z.string(),
  name: z.string(),
});

/**
 * 顧客詳細情報のスキーマ
 */
export const customerDetailSchema = customerBasicSchema.extend({
  industry: z.string().nullable(),
});

/**
 * 訪問記録のスキーマ
 */
export const visitRecordSchema = z.object({
  id: z.number().int().positive(),
  customer: customerDetailSchema,
  visit_time: z
    .string()
    .regex(/^\d{2}:\d{2}$/)
    .nullable(),
  result: visitResultSchema.nullable(),
  result_label: z.string().nullable(),
  content: z.string().max(2000, '訪問内容は2000文字以内で入力してください'),
});

/**
 * 訪問記録作成リクエストのスキーマ
 */
export const createVisitRecordRequestSchema = z.object({
  customer_id: z.number().int().positive({ message: '顧客を選択してください' }),
  visit_time: z
    .string()
    .regex(/^\d{2}:\d{2}$/, '訪問時刻はHH:MM形式で入力してください')
    .optional()
    .nullable(),
  result: visitResultSchema.optional().nullable(),
  content: z
    .string()
    .min(1, '訪問内容を入力してください')
    .max(2000, '訪問内容は2000文字以内で入力してください'),
});

/**
 * 訪問記録更新リクエストのスキーマ
 */
export const updateVisitRecordRequestSchema = createVisitRecordRequestSchema;

/**
 * 訪問記録削除レスポンスのスキーマ
 */
export const deleteVisitRecordResponseDataSchema = z.object({
  message: z.string(),
});

/**
 * 型エクスポート
 */
export type CustomerBasic = z.infer<typeof customerBasicSchema>;
export type CustomerDetail = z.infer<typeof customerDetailSchema>;
export type VisitRecord = z.infer<typeof visitRecordSchema>;
export type CreateVisitRecordRequest = z.infer<typeof createVisitRecordRequestSchema>;
export type UpdateVisitRecordRequest = z.infer<typeof updateVisitRecordRequestSchema>;
export type DeleteVisitRecordResponseData = z.infer<typeof deleteVisitRecordResponseDataSchema>;
