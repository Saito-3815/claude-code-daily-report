# Issue#5 実装サマリー

## 実装内容

環境変数設定とデータベース接続設定を実装しました。

## 実装ファイル

### 1. 環境変数ファイル

#### `.env.example`

すべての必要な環境変数のテンプレート

#### `.env`

ローカル開発用の環境変数（セキュアなランダム文字列を使用）

#### `.env.test`

テスト用の環境変数（開発環境とは異なるデータベースとシークレットを使用）

### 2. 環境変数バリデーション

#### `src/lib/env.ts`

Zodを使用した環境変数のバリデーション

**機能:**

- すべての環境変数の型チェックと検証
- JWT_SECRETとJWT_REFRESH_SECRETの最小文字数（32文字）チェック
- DATABASE_URLのURL形式チェック
- NODE_ENVの列挙値チェック（development, test, production）
- 数値型への自動変換（BCRYPT*ROUNDS、RATE_LIMIT*\*）
- デフォルト値の設定
- 起動時の環境変数検証

### 3. Prismaクライアント

#### `src/lib/prisma.ts`

Prismaクライアントのシングルトンインスタンス

**機能:**

- シングルトンパターンによる接続プールの最適化
- 開発環境でのホットリロード対応（globalThis使用）
- データベース接続テストユーティリティ
- トランザクション管理ユーティリティ
- グレースフルシャットダウン処理
- 環境別ログ設定

### 4. データベース関連スクリプト

#### `scripts/test-db-connection.ts`

データベース接続テストスクリプト

**機能:**

- 接続情報の表示
- PostgreSQLバージョンの確認
- テーブル一覧の表示
- レコード数の表示
- トラブルシューティング情報の提供

#### `prisma/seed.ts`

シードデータスクリプト

**シードデータ:**

- 営業担当者4名（上長1名、部下3名）
- 顧客5社
- 日報4件（各ステータス含む）
- 訪問記録複数件
- Problem/Plan複数件
- コメント1件

**テストユーザー:**

```
上長:
  Email: sato@example.com
  Password: password123

営業担当者:
  Email: yamada@example.com
  Password: password123
```

### 5. テストファイル

#### `src/lib/__tests__/env.test.ts`

環境変数バリデーションのテスト

**テストケース:**

- 必須環境変数のチェック
- JWT_SECRETの最小文字数チェック
- 数値型への変換チェック
- デフォルト値のチェック
- 列挙値のチェック

#### `src/lib/__tests__/prisma.test.ts`

Prismaクライアントのテスト

**テストケース:**

- データベース接続テスト
- モデルの存在チェック
- トランザクション機能のテスト
- クエリ実行テスト

### 6. ドキュメント

#### `doc/DATABASE_SETUP.md`

データベースセットアップガイド

**内容:**

- 環境変数の設定手順
- データベースの作成手順
- マイグレーション手順
- シードデータの投入手順
- トラブルシューティング
- ベストプラクティス
- セキュリティガイドライン

## npmスクリプト

以下のスクリプトを`package.json`に追加しました：

```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:migrate": "prisma migrate dev",
    "db:migrate:deploy": "prisma migrate deploy",
    "db:migrate:reset": "prisma migrate reset",
    "db:push": "prisma db push",
    "db:seed": "tsx prisma/seed.ts",
    "db:studio": "prisma studio",
    "db:test": "tsx scripts/test-db-connection.ts",
    "postinstall": "prisma generate"
  }
}
```

## セキュリティ対策

### 1. 環境変数の保護

- `.env`と`.env.test`を`.gitignore`に追加
- JWT_SECRETとJWT_REFRESH_SECRETは32文字以上のランダム文字列を使用
- `openssl rand -base64 32`で生成したセキュアなシークレット

### 2. バリデーション

- Zodによる型安全な環境変数検証
- 起動時の自動検証により、設定ミスを早期検出
- 詳細なエラーメッセージによる問題の特定

### 3. データベース接続

- 環境別のデータベース分離（development, test, production）
- 接続プールの適切な管理
- グレースフルシャットダウン

## 使用方法

### 1. 初回セットアップ

```bash
# 依存関係のインストール
npm install

# 環境変数の設定
cp .env.example .env
# .envファイルを編集してDATABASE_URLを設定

# Prismaクライアント生成
npm run db:generate

# データベースマイグレーション
npm run db:migrate

# シードデータ投入
npm run db:seed

# データベース接続テスト
npm run db:test
```

### 2. 日常的な使用

```bash
# 開発サーバー起動
npm run dev

# Prisma Studio（データベースGUI）
npm run db:studio

# データベース接続確認
npm run db:test

# シードデータの再投入
npm run db:seed
```

## テスト実行

```bash
# 環境変数バリデーションテスト
npm test src/lib/__tests__/env.test.ts

# Prismaクライアントテスト
npm test src/lib/__tests__/prisma.test.ts

# すべてのテスト
npm test
```

## トラブルシューティング

詳細なトラブルシューティング情報は`doc/DATABASE_SETUP.md`を参照してください。

### よくある問題

1. **データベース接続エラー**
   - PostgreSQLが起動しているか確認
   - DATABASE_URLが正しいか確認
   - `npm run db:test`で接続確認

2. **環境変数エラー**
   - `.env`ファイルが存在するか確認
   - 必須環境変数がすべて設定されているか確認
   - JWT_SECRETが32文字以上か確認

3. **マイグレーションエラー**
   - `npm run db:migrate:reset`でリセット
   - データベースの権限を確認

## 参考資料

- [Prisma Documentation](https://www.prisma.io/docs)
- [Zod Documentation](https://zod.dev/)
- [Next.js Environment Variables](https://nextjs.org/docs/app/building-your-application/configuring/environment-variables)
- [DATABASE_SETUP.md](../doc/DATABASE_SETUP.md)

## 受け入れ条件の確認

✅ データベース接続が正常に確立される

- `npm run db:test`で確認可能
- Prismaクライアントシングルトンによる安定した接続管理

✅ 環境変数が適切にバリデーションされる

- Zodによる型安全な検証
- 起動時の自動バリデーション
- 詳細なエラーメッセージ

✅ シードデータが正常に投入される

- `npm run db:seed`で実行
- 冪等性を保つ設計（何度実行しても安全）
- テストユーザーとサンプルデータの投入

✅ セキュリティ要件

- `.env`が`.gitignore`に含まれている
- JWT_SECRETは32文字以上のランダム文字列
- JWT_REFRESH_SECRETも32文字以上のランダム文字列
- 環境別に異なるシークレットを使用

## 次のステップ

Issue#5の実装は完了しました。次は以下のステップに進むことができます：

1. **Issue#6**: 認証API実装（JWT認証、ログイン、ログアウト）
2. **Issue#7**: 営業担当者管理API実装
3. **Issue#8**: 顧客管理API実装

データベース接続とシードデータが準備できたので、これらのAPIを実装・テストすることができます。
