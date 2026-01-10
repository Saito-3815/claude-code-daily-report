import { z } from 'zod';
import { commentableTypeSchema } from './enums';

/**
 * コメント投稿者のスキーマ
 */
export const commenterSchema = z.object({
  id: z.number().int().positive(),
  name: z.string(),
});

/**
 * コメントのスキーマ
 */
export const commentSchema = z.object({
  id: z.number().int().positive(),
  content: z.string().max(1000, 'コメントは1000文字以内で入力してください'),
  commenter: commenterSchema,
  created_at: z.string().datetime(),
});

/**
 * コメント投稿リクエストのスキーマ
 */
export const createCommentRequestSchema = z.object({
  commentable_type: commentableTypeSchema,
  commentable_id: z.number().int().positive({ message: '対象IDを指定してください' }),
  content: z
    .string()
    .min(1, 'コメントを入力してください')
    .max(1000, 'コメントは1000文字以内で入力してください'),
});

/**
 * コメント削除レスポンスのスキーマ
 */
export const deleteCommentResponseDataSchema = z.object({
  message: z.string(),
});

/**
 * 型エクスポート
 */
export type Commenter = z.infer<typeof commenterSchema>;
export type Comment = z.infer<typeof commentSchema>;
export type CreateCommentRequest = z.infer<typeof createCommentRequestSchema>;
export type DeleteCommentResponseData = z.infer<typeof deleteCommentResponseDataSchema>;
