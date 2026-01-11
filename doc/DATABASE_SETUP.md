# データベースセットアップガイド

## 概要

このドキュメントでは、営業日報システムのデータベース環境構築手順を説明します。

## 前提条件

- PostgreSQL 14以上がインストールされていること
- Node.js 20以上がインストールされていること
- npm または yarn がインストールされていること

## セットアップ手順

### 1. 環境変数の設定

#### 開発環境

`.env` ファイルを作成し、以下の環境変数を設定します：

```bash
# .env.example をコピー
cp .env.example .env
```

`.env` ファイルを編集し、データベース接続情報を設定：

```env
# Database
DATABASE_URL="postgresql://user:password@localhost:5432/daily_report_dev?schema=public"

# JWT Settings (本番環境では必ず変更してください)
JWT_SECRET="your-secret-key-here-change-in-production-min-32-chars"
JWT_EXPIRES_IN="1h"
JWT_REFRESH_SECRET="your-refresh-secret-key-here-change-in-production-min-32-chars"
JWT_REFRESH_EXPIRES_IN="30d"

# Application
NODE_ENV="development"
NEXT_PUBLIC_APP_URL="http://localhost:3000"

# Security
BCRYPT_ROUNDS="10"

# Rate Limiting
RATE_LIMIT_LOGIN="10"
RATE_LIMIT_API="100"
```

**セキュリティ注意事項:**

- JWT_SECRET および JWT_REFRESH_SECRET は必ず32文字以上のランダムな文字列を使用してください
- 以下のコマンドで安全なシークレットを生成できます：

```bash
openssl rand -base64 32
```

#### テスト環境

テスト用の環境変数は `.env.test` に設定されています。必要に応じて編集してください。

### 2. PostgreSQLデータベースの作成

```bash
# PostgreSQLに接続
psql -U postgres

# 開発用データベースを作成
CREATE DATABASE daily_report_dev;

# テスト用データベースを作成
CREATE DATABASE daily_report_test;

# ユーザーに権限を付与
GRANT ALL PRIVILEGES ON DATABASE daily_report_dev TO user;
GRANT ALL PRIVILEGES ON DATABASE daily_report_test TO user;

# 接続を終了
\q
```

### 3. Prismaクライアントの生成

```bash
npm run db:generate
```

### 4. データベースマイグレーション

```bash
# マイグレーションを実行
npm run db:migrate

# または、既存のスキーマを直接プッシュ（開発時のみ）
npm run db:push
```

### 5. データベース接続のテスト

```bash
npm run db:test
```

正常に接続できると、以下のような出力が表示されます：

```
🔍 Testing database connection...

📊 Database Configuration:
   Host: localhost
   Port: 5432
   Database: daily_report_dev
   User: user
   Schema: public

🔌 Attempting to connect to database...
✅ Database connection successful!

📌 PostgreSQL Version:
   PostgreSQL 14.x on ...

📋 Checking database tables...
✅ Found 7 tables:
   - salesperson
   - customer
   - daily_report
   - visit_record
   - problem
   - plan
   - comment
```

### 6. シードデータの投入

```bash
npm run db:seed
```

シードデータには以下が含まれます：

- 営業担当者（上長1名、部下3名）
- 顧客（5社）
- 日報（複数件、各ステータス含む）
- 訪問記録
- Problem/Plan
- コメント

**テストユーザー:**

```
上長:
  Email: sato@example.com
  Password: password123

営業担当者:
  Email: yamada@example.com
  Password: password123
```

### 7. Prisma Studio（オプション）

データベースの内容をGUIで確認・編集できます：

```bash
npm run db:studio
```

ブラウザで http://localhost:5555 が開きます。

## データベース管理コマンド

### マイグレーション関連

```bash
# 新しいマイグレーションを作成
npm run db:migrate

# 本番環境へマイグレーションをデプロイ
npm run db:migrate:deploy

# データベースをリセット（全データ削除 + マイグレーション再実行 + シード実行）
npm run db:migrate:reset
```

### データ管理

```bash
# シードデータを投入
npm run db:seed

# Prisma Studioを起動
npm run db:studio

# データベース接続テスト
npm run db:test
```

### スキーマ管理

```bash
# Prismaクライアントを再生成
npm run db:generate

# スキーマをデータベースにプッシュ（開発時のみ）
npm run db:push
```

## トラブルシューティング

### 1. データベース接続エラー

**エラー:** `Error: P1001: Can't reach database server`

**解決方法:**

- PostgreSQLが起動しているか確認: `pg_isready`
- DATABASE_URLの接続情報が正しいか確認
- ファイアウォールでポート5432が開いているか確認

### 2. 認証エラー

**エラー:** `Error: P1001: authentication failed`

**解決方法:**

- ユーザー名とパスワードが正しいか確認
- PostgreSQLのユーザー権限を確認
- `pg_hba.conf` の設定を確認

### 3. データベースが存在しない

**エラー:** `Error: P1003: Database does not exist`

**解決方法:**

```bash
createdb daily_report_dev
```

### 4. マイグレーションエラー

**エラー:** マイグレーションが失敗する

**解決方法:**

```bash
# データベースをリセット（開発環境のみ）
npm run db:migrate:reset

# または手動でマイグレーション履歴をクリア
npx prisma migrate reset
```

### 5. スキーマとデータベースの不整合

**エラー:** `Error: P3006: Migration is in a failed state`

**解決方法:**

```bash
# マイグレーション履歴を確認
npx prisma migrate status

# 失敗したマイグレーションを解決
npx prisma migrate resolve --rolled-back <migration-name>

# または完全にリセット（開発環境のみ）
npm run db:migrate:reset
```

## ベストプラクティス

### 1. 環境変数の管理

- `.env` ファイルは絶対にGitにコミットしないこと
- `.env.example` はコミットして、必要な環境変数を文書化すること
- 本番環境では必ずセキュアなシークレットを使用すること

### 2. マイグレーション

- 本番環境へのマイグレーション前に必ずバックアップを取ること
- マイグレーション名は説明的にすること
- マイグレーションファイルは削除しないこと

### 3. シードデータ

- シードスクリプトは冪等性を保つこと（何度実行しても安全）
- 本番環境では慎重に使用すること
- テストデータと本番データを明確に区別すること

### 4. データベース接続

- 接続プールのサイズに注意すること
- 適切にコネクションをクローズすること
- トランザクションは必要最小限の範囲で使用すること

## セキュリティ

### 環境変数のセキュリティ

1. **JWT_SECRET / JWT_REFRESH_SECRET**
   - 最低32文字以上のランダムな文字列を使用
   - 本番環境では環境変数管理サービス（AWS Secrets Manager等）を使用
   - 定期的にローテーションすること

2. **DATABASE_URL**
   - パスワードは強力なものを使用
   - 接続文字列に機密情報が含まれるため、ログに出力しないこと
   - SSL接続を使用すること（本番環境）

3. **BCRYPT_ROUNDS**
   - 本番環境では10以上を推奨
   - パフォーマンスとセキュリティのバランスを考慮

### データベースセキュリティ

1. **アクセス制御**
   - 最小権限の原則に従うこと
   - アプリケーション用のユーザーは必要最小限の権限のみ付与
   - 本番環境ではスーパーユーザーを使用しないこと

2. **ネットワークセキュリティ**
   - データベースへのアクセスは信頼できるIPアドレスのみに制限
   - VPC内に配置すること（クラウド環境）
   - SSL/TLS接続を必須にすること

3. **監査ログ**
   - データベースへのアクセスログを有効にすること
   - 定期的にログを確認すること

## 参考資料

- [Prisma Documentation](https://www.prisma.io/docs)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [Next.js Database Integration](https://nextjs.org/docs/app/building-your-application/data-fetching)
