import { z } from 'zod';

/**
 * Planのスキーマ
 */
export const planSchema = z.object({
  id: z.number().int().positive(),
  content: z.string().max(2000, '明日やることは2000文字以内で入力してください'),
  display_order: z.number().int().nonnegative(),
  comments: z.array(z.any()), // コメントは別スキーマで定義
  created_at: z.string().datetime().optional(),
});

/**
 * Plan作成リクエストのスキーマ
 */
export const createPlanRequestSchema = z.object({
  content: z
    .string()
    .min(1, '明日やることを入力してください')
    .max(2000, '明日やることは2000文字以内で入力してください'),
  display_order: z.number().int().nonnegative().optional(),
});

/**
 * Plan更新リクエストのスキーマ
 */
export const updatePlanRequestSchema = createPlanRequestSchema;

/**
 * Plan削除レスポンスのスキーマ
 */
export const deletePlanResponseDataSchema = z.object({
  message: z.string(),
});

/**
 * 型エクスポート
 */
export type Plan = z.infer<typeof planSchema>;
export type CreatePlanRequest = z.infer<typeof createPlanRequestSchema>;
export type UpdatePlanRequest = z.infer<typeof updatePlanRequestSchema>;
export type DeletePlanResponseData = z.infer<
  typeof deletePlanResponseDataSchema
>;
