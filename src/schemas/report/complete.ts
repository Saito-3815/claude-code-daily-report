import { z } from 'zod';
import {
  createReportRequestBaseSchema,
  updateReportRequestBaseSchema,
  reportDetailBaseSchema,
} from './daily-report';
import { createVisitRecordRequestSchema, visitRecordSchema } from '../visit';
import { createProblemRequestSchema, problemSchema } from '../problem';
import { createPlanRequestSchema, planSchema } from '../plan';

/**
 * 完全な日報作成リクエストのスキーマ（訪問記録、Problem、Planを含む）
 */
export const createReportRequestSchema = createReportRequestBaseSchema.extend({
  visits: z
    .array(createVisitRecordRequestSchema)
    .optional()
    .default([]),
  problems: z
    .array(createProblemRequestSchema)
    .optional()
    .default([]),
  plans: z
    .array(createPlanRequestSchema)
    .optional()
    .default([]),
});

/**
 * 完全な日報更新リクエストのスキーマ（訪問記録、Problem、Planを含む）
 */
export const updateReportRequestSchema = updateReportRequestBaseSchema.extend({
  visits: z.array(
    createVisitRecordRequestSchema.extend({
      id: z.number().int().positive().optional(),
    })
  ).optional(),
  problems: z.array(
    createProblemRequestSchema.extend({
      id: z.number().int().positive().optional(),
    })
  ).optional(),
  plans: z.array(
    createPlanRequestSchema.extend({
      id: z.number().int().positive().optional(),
    })
  ).optional(),
});

/**
 * 完全な日報詳細レスポンスのスキーマ（訪問記録、Problem、Planを含む）
 */
export const reportDetailSchema = reportDetailBaseSchema.extend({
  visits: z.array(visitRecordSchema),
  problems: z.array(problemSchema),
  plans: z.array(planSchema),
});

/**
 * 型エクスポート
 */
export type CreateReportRequest = z.infer<typeof createReportRequestSchema>;
export type UpdateReportRequest = z.infer<typeof updateReportRequestSchema>;
export type ReportDetail = z.infer<typeof reportDetailSchema>;
