# 営業日報システム

営業担当者が日々の活動を報告し、上長がフィードバックを行うための日報管理システム

## 使用技術

- **言語**: TypeScript
- **フレームワーク**: Next.js (App Router)
- **UIコンポーネント**: shadcn/ui + Tailwind CSS
- **APIスキーマ定義**: OpenAPI (Zodによる検証)
- **DBスキーマ定義**: Prisma.js
- **テスト**: Vitest
- **デプロイ**: Google Cloud Run

## セットアップ

### 依存関係のインストール

```bash
npm install
```

## 開発

### 開発サーバーの起動

```bash
npm run dev
```

### リント

```bash
# リントチェック
npm run lint

# リント自動修正
npm run lint:fix
```

### フォーマット

```bash
# コードフォーマット
npm run format

# フォーマットチェック
npm run format:check
```

## テスト

### テストの実行

```bash
# 全テストを実行
npm test

# ウォッチモードでテストを実行
npm run test:watch

# UIモードでテストを実行
npm run test:ui

# カバレッジレポートを生成
npm run test:coverage
```

### テストの書き方

テストファイルは `*.test.ts` または `*.spec.ts` の拡張子で作成します。

#### 基本的なテスト例

```typescript
import { describe, it, expect } from 'vitest';

describe('Example Test', () => {
  it('should pass basic assertion', () => {
    expect(1 + 1).toBe(2);
  });
});
```

#### Reactコンポーネントのテスト例

```typescript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@/test/utils';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('should render correctly', () => {
    render(<MyComponent />);
    expect(screen.getByText('Hello')).toBeInTheDocument();
  });
});
```

### テストカバレッジ目標

- ライン: 80%以上
- 関数: 80%以上
- ブランチ: 80%以上
- ステートメント: 80%以上

## ドキュメント

- [要件定義書](./CLAUDE.md)
- [画面設計書](./doc/SCREEN_DESIGN.md)
- [API仕様書](./doc/API_SCHEME.md)
- [テスト仕様書](./doc/TEST_DEFINITION.md)

## ライセンス

ISC
