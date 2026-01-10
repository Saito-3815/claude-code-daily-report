import { z } from 'zod';

/**
 * ログアウトレスポンスのスキーマ
 */
export const logoutResponseDataSchema = z.object({
  message: z.string(),
});

/**
 * 型エクスポート
 */
export type LogoutResponseData = z.infer<typeof logoutResponseDataSchema>;
