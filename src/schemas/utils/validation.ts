import { z } from 'zod';

/**
 * バリデーション結果の型
 */
export type ValidationResult<T> =
  | { success: true; data: T }
  | { success: false; errors: ValidationError[] };

/**
 * バリデーションエラーの型
 */
export interface ValidationError {
  field?: string;
  message: string;
}

/**
 * Zodスキーマを使ってデータをバリデーションする
 * @param schema Zodスキーマ
 * @param data バリデーション対象のデータ
 * @returns バリデーション結果
 */
export function validate<T>(schema: z.ZodSchema<T>, data: unknown): ValidationResult<T> {
  const result = schema.safeParse(data);

  if (result.success) {
    return { success: true, data: result.data };
  }

  const errors: ValidationError[] = result.error.errors.map((error) => ({
    field: error.path.join('.'),
    message: error.message,
  }));

  return { success: false, errors };
}

/**
 * クエリパラメータをバリデーションする
 * @param schema Zodスキーマ
 * @param query クエリパラメータオブジェクト
 * @returns バリデーション結果
 */
export function validateQuery<T>(
  schema: z.ZodSchema<T>,
  query: Record<string, unknown>
): ValidationResult<T> {
  return validate(schema, query);
}

/**
 * リクエストボディをバリデーションする
 * @param schema Zodスキーマ
 * @param body リクエストボディ
 * @returns バリデーション結果
 */
export function validateBody<T>(schema: z.ZodSchema<T>, body: unknown): ValidationResult<T> {
  return validate(schema, body);
}

/**
 * パスパラメータをバリデーションする
 * @param schema Zodスキーマ
 * @param params パスパラメータオブジェクト
 * @returns バリデーション結果
 */
export function validateParams<T>(
  schema: z.ZodSchema<T>,
  params: Record<string, unknown>
): ValidationResult<T> {
  return validate(schema, params);
}
