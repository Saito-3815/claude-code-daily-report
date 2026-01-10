import { z } from 'zod';

/**
 * トークンリフレッシュリクエストのスキーマ
 */
export const refreshRequestSchema = z.object({
  refresh_token: z.string().min(1, 'リフレッシュトークンを入力してください'),
});

/**
 * トークンリフレッシュレスポンスのスキーマ
 */
export const refreshResponseDataSchema = z.object({
  access_token: z.string(),
  token_type: z.literal('Bearer'),
  expires_in: z.number().int().positive(),
});

/**
 * 型エクスポート
 */
export type RefreshRequest = z.infer<typeof refreshRequestSchema>;
export type RefreshResponseData = z.infer<typeof refreshResponseDataSchema>;
