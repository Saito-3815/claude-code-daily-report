// Set NODE_ENV to test before any other imports
// This ensures that environment variables are loaded from .env.test
process.env.NODE_ENV = 'test';

import '@testing-library/jest-dom';
import { cleanup } from '@testing-library/react';
import { afterEach } from 'vitest';

// 各テスト後にクリーンアップを実行
afterEach(() => {
  cleanup();
});

// グローバルな設定やモックをここに追加
