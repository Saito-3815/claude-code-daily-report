# API スキーマ定義（Zod）

このディレクトリには、営業日報システムのAPIスキーマ定義が含まれています。[Zod](https://zod.dev/)を使用して、TypeScriptの型安全性を確保しながらランタイムバリデーションを実現しています。

## ディレクトリ構造

```
src/schemas/
├── common/          # 共通スキーマ（レスポンス、エラー、ページネーション）
├── auth/            # 認証関連スキーマ
├── report/          # 日報関連スキーマ
├── visit/           # 訪問記録スキーマ
├── problem/         # Problemスキーマ
├── plan/            # Planスキーマ
├── comment/         # コメントスキーマ
├── customer/        # 顧客スキーマ
├── salesperson/     # 営業担当者スキーマ
├── utils/           # バリデーションヘルパー関数
└── index.ts         # 全スキーマのエクスポート
```

## 使用方法

### 基本的な使い方

```typescript
import { loginRequestSchema, type LoginRequest } from '@/schemas/auth';
import { validate } from '@/schemas/utils';

// バリデーション
const result = validate(loginRequestSchema, {
  email: 'user@example.com',
  password: 'password123',
});

if (result.success) {
  // 型安全なデータを使用
  const data: LoginRequest = result.data;
  console.log(data.email); // user@example.com
} else {
  // バリデーションエラーを処理
  console.error(result.errors);
}
```

### APIハンドラーでの使用例

```typescript
import { createReportRequestSchema } from '@/schemas/report';
import { validateBody, successResponseSchema } from '@/schemas';

export async function POST(request: Request) {
  const body = await request.json();

  // リクエストボディのバリデーション
  const result = validateBody(createReportRequestSchema, body);

  if (!result.success) {
    return Response.json(
      { status: 'error', error: { code: 'VALIDATION_ERROR', details: result.errors } },
      { status: 422 }
    );
  }

  // ビジネスロジック
  const report = await createReport(result.data);

  // レスポンスの返却
  return Response.json(
    successResponseSchema(reportDetailSchema).parse({
      status: 'success',
      data: report,
    }),
    { status: 201 }
  );
}
```

### クエリパラメータのバリデーション

```typescript
import { reportListQuerySchema } from '@/schemas/report';
import { validateQuery } from '@/schemas/utils';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const query = Object.fromEntries(searchParams.entries());

  const result = validateQuery(reportListQuerySchema, query);

  if (!result.success) {
    return Response.json(
      { status: 'error', error: { code: 'VALIDATION_ERROR', details: result.errors } },
      { status: 422 }
    );
  }

  // バリデーション済みのクエリパラメータを使用
  const reports = await getReports(result.data);

  return Response.json({
    status: 'success',
    data: reports,
  });
}
```

## 主要なスキーマ

### 共通スキーマ

- `successResponseSchema<T>` - 成功レスポンスのラッパー
- `errorResponseSchema` - エラーレスポンス
- `paginatedResponseSchema<T>` - ページネーション付きレスポンス
- `paginationQuerySchema` - ページネーションクエリパラメータ

### 認証スキーマ

- `loginRequestSchema` - ログインリクエスト
- `loginResponseDataSchema` - ログインレスポンス
- `refreshRequestSchema` - トークンリフレッシュリクエスト

### 日報スキーマ

- `createReportRequestSchema` - 日報作成（訪問記録、Problem、Plan含む）
- `updateReportRequestSchema` - 日報更新
- `reportDetailSchema` - 日報詳細レスポンス
- `reportListItemSchema` - 日報一覧項目
- `reportListQuerySchema` - 日報一覧クエリパラメータ

### その他のスキーマ

各エンティティ（訪問記録、Problem、Plan、コメント、顧客、営業担当者）についても同様のCRUDスキーマが定義されています。

## 列挙値

システムで使用される列挙値も型安全に定義されています：

```typescript
import { ReportStatus, VisitResult, CommentableType } from '@/schemas';

// 日報ステータス
ReportStatus.DRAFT      // 'draft'
ReportStatus.SUBMITTED  // 'submitted'
ReportStatus.CONFIRMED  // 'confirmed'

// 訪問結果
VisitResult.NEGOTIATING     // 'negotiating'
VisitResult.CLOSED          // 'closed'
VisitResult.REJECTED        // 'rejected'
VisitResult.INFO_GATHERING  // 'info_gathering'

// コメント対象種別
CommentableType.PROBLEM  // 'Problem'
CommentableType.PLAN     // 'Plan'
```

## バリデーションヘルパー

`utils/validation.ts` には便利なヘルパー関数が用意されています：

- `validate<T>(schema, data)` - 汎用バリデーション
- `validateBody<T>(schema, body)` - リクエストボディのバリデーション
- `validateQuery<T>(schema, query)` - クエリパラメータのバリデーション
- `validateParams<T>(schema, params)` - パスパラメータのバリデーション

## TypeScript型の自動推論

Zodスキーマから自動的にTypeScript型が生成されます：

```typescript
import { z } from 'zod';
import { loginRequestSchema } from '@/schemas/auth';

// 型を自動推論
type LoginRequest = z.infer<typeof loginRequestSchema>;

// または、エクスポートされた型を直接使用
import type { LoginRequest } from '@/schemas/auth';
```

## テスト

スキーマのテストは Vitest を使用して実装できます：

```typescript
import { describe, it, expect } from 'vitest';
import { loginRequestSchema } from '@/schemas/auth';

describe('loginRequestSchema', () => {
  it('should validate correct login data', () => {
    const result = loginRequestSchema.safeParse({
      email: 'user@example.com',
      password: 'password123',
    });

    expect(result.success).toBe(true);
  });

  it('should reject invalid email format', () => {
    const result = loginRequestSchema.safeParse({
      email: 'invalid-email',
      password: 'password123',
    });

    expect(result.success).toBe(false);
  });
});
```

## 参考資料

- [Zod公式ドキュメント](https://zod.dev/)
- [API仕様書](../../../doc/API_SCHEME.md)
