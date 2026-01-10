import { z } from 'zod';

/**
 * 成功レスポンスのスキーマ
 */
export const successResponseSchema = <T extends z.ZodTypeAny>(dataSchema: T) =>
  z.object({
    status: z.literal('success'),
    data: dataSchema,
  });

/**
 * エラー詳細のスキーマ
 */
export const errorDetailSchema = z.object({
  field: z.string().optional(),
  message: z.string(),
});

/**
 * エラーレスポンスのスキーマ
 */
export const errorResponseSchema = z.object({
  status: z.literal('error'),
  error: z.object({
    code: z.string(),
    message: z.string(),
    details: z.array(errorDetailSchema).optional(),
  }),
});

/**
 * ページネーションメタ情報のスキーマ
 */
export const paginationMetaSchema = z.object({
  current_page: z.number().int().positive(),
  per_page: z.number().int().positive(),
  total_pages: z.number().int().nonnegative(),
  total_count: z.number().int().nonnegative(),
});

/**
 * ページネーション付きレスポンスのスキーマ
 */
export const paginatedResponseSchema = <T extends z.ZodTypeAny>(
  dataSchema: T
) =>
  z.object({
    status: z.literal('success'),
    data: z.array(dataSchema),
    meta: paginationMetaSchema,
  });

/**
 * ページネーションクエリパラメータのスキーマ
 */
export const paginationQuerySchema = z.object({
  page: z.coerce.number().int().positive().default(1),
  per_page: z.coerce.number().int().positive().max(100).default(20),
});

/**
 * 型エクスポート
 */
export type ErrorDetail = z.infer<typeof errorDetailSchema>;
export type ErrorResponse = z.infer<typeof errorResponseSchema>;
export type PaginationMeta = z.infer<typeof paginationMetaSchema>;
export type PaginationQuery = z.infer<typeof paginationQuerySchema>;
