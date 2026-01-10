import { z } from 'zod';

/**
 * 日報ステータスの定義
 */
export const ReportStatus = {
  DRAFT: 'draft',
  SUBMITTED: 'submitted',
  CONFIRMED: 'confirmed',
} as const;

export const reportStatusSchema = z.enum([
  ReportStatus.DRAFT,
  ReportStatus.SUBMITTED,
  ReportStatus.CONFIRMED,
]);

/**
 * 日報取得範囲の定義
 */
export const ReportScope = {
  OWN: 'own',
  SUBORDINATES: 'subordinates',
} as const;

export const reportScopeSchema = z.enum([ReportScope.OWN, ReportScope.SUBORDINATES]);

/**
 * 型エクスポート
 */
export type ReportStatus = (typeof ReportStatus)[keyof typeof ReportStatus];
export type ReportScope = (typeof ReportScope)[keyof typeof ReportScope];
