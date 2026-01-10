import { z } from 'zod';

/**
 * コメント対象種別の定義
 */
export const CommentableType = {
  PROBLEM: 'Problem',
  PLAN: 'Plan',
} as const;

export const commentableTypeSchema = z.enum([CommentableType.PROBLEM, CommentableType.PLAN]);

/**
 * 型エクスポート
 */
export type CommentableType = (typeof CommentableType)[keyof typeof CommentableType];
