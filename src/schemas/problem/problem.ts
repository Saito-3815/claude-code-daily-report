import { z } from 'zod';

/**
 * Problemのスキーマ
 */
export const problemSchema = z.object({
  id: z.number().int().positive(),
  content: z.string().max(2000, '課題・相談は2000文字以内で入力してください'),
  display_order: z.number().int().nonnegative(),
  comments: z.array(z.any()), // コメントは別スキーマで定義
  created_at: z.string().datetime().optional(),
});

/**
 * Problem作成リクエストのスキーマ
 */
export const createProblemRequestSchema = z.object({
  content: z
    .string()
    .min(1, '課題・相談を入力してください')
    .max(2000, '課題・相談は2000文字以内で入力してください'),
  display_order: z.number().int().nonnegative().optional(),
});

/**
 * Problem更新リクエストのスキーマ
 */
export const updateProblemRequestSchema = createProblemRequestSchema;

/**
 * Problem削除レスポンスのスキーマ
 */
export const deleteProblemResponseDataSchema = z.object({
  message: z.string(),
});

/**
 * 型エクスポート
 */
export type Problem = z.infer<typeof problemSchema>;
export type CreateProblemRequest = z.infer<typeof createProblemRequestSchema>;
export type UpdateProblemRequest = z.infer<typeof updateProblemRequestSchema>;
export type DeleteProblemResponseData = z.infer<typeof deleteProblemResponseDataSchema>;
