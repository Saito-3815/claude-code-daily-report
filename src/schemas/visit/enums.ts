import { z } from 'zod';

/**
 * 訪問結果の定義
 */
export const VisitResult = {
  NEGOTIATING: 'negotiating',
  CLOSED: 'closed',
  REJECTED: 'rejected',
  INFO_GATHERING: 'info_gathering',
} as const;

export const visitResultSchema = z.enum([
  VisitResult.NEGOTIATING,
  VisitResult.CLOSED,
  VisitResult.REJECTED,
  VisitResult.INFO_GATHERING,
]);

/**
 * 型エクスポート
 */
export type VisitResult = (typeof VisitResult)[keyof typeof VisitResult];
