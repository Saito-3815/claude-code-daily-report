import { render, RenderOptions } from '@testing-library/react';
import { ReactElement } from 'react';

/**
 * テスト用のカスタムレンダー関数
 * 必要に応じてプロバイダーやラッパーを追加できます
 */
export function renderWithProviders(ui: ReactElement, options?: Omit<RenderOptions, 'wrapper'>) {
  return render(ui, { ...options });
}

export * from '@testing-library/react';
export { default as userEvent } from '@testing-library/user-event';
