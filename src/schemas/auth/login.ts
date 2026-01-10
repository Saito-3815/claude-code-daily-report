import { z } from 'zod';

/**
 * ログインリクエストのスキーマ
 */
export const loginRequestSchema = z.object({
  email: z.string().email('正しいメールアドレス形式で入力してください'),
  password: z.string().min(1, 'パスワードを入力してください'),
});

/**
 * ユーザー情報のスキーマ
 */
export const userSchema = z.object({
  id: z.number().int().positive(),
  employee_code: z.string(),
  name: z.string(),
  email: z.string().email(),
  department: z.string(),
  is_manager: z.boolean(),
});

/**
 * ログインレスポンスのスキーマ
 */
export const loginResponseDataSchema = z.object({
  access_token: z.string(),
  refresh_token: z.string(),
  token_type: z.literal('Bearer'),
  expires_in: z.number().int().positive(),
  user: userSchema,
});

/**
 * 型エクスポート
 */
export type LoginRequest = z.infer<typeof loginRequestSchema>;
export type User = z.infer<typeof userSchema>;
export type LoginResponseData = z.infer<typeof loginResponseDataSchema>;
