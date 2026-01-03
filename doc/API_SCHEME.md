# 営業日報システム API 仕様書

## 1. 概要

### 1.1 基本情報

| 項目           | 内容                             |
| -------------- | -------------------------------- |
| API バージョン | v1                               |
| ベース URL     | `https://api.example.com/api/v1` |
| プロトコル     | HTTPS                            |
| データ形式     | JSON                             |
| 文字コード     | UTF-8                            |

### 1.2 認証方式

Bearer Token 認証を使用。ログイン API 成功時に発行されるアクセストークンを Authorization ヘッダーに設定する。

```
Authorization: Bearer {access_token}
```

### 1.3 共通リクエストヘッダー

| ヘッダー名    | 必須 | 値                                      |
| ------------- | ---- | --------------------------------------- |
| Content-Type  | ○    | application/json                        |
| Authorization | ○    | Bearer {access_token}（認証必要な API） |
| Accept        | -    | application/json                        |

### 1.4 共通レスポンス形式

#### 成功時

```json
{
  "status": "success",
  "data": { ... }
}
```

#### エラー時

```json
{
  "status": "error",
  "error": {
    "code": "ERROR_CODE",
    "message": "エラーメッセージ",
    "details": [ ... ]
  }
}
```

### 1.5 共通エラーコード

| HTTP ステータス | エラーコード     | 説明                   |
| --------------- | ---------------- | ---------------------- |
| 400             | BAD_REQUEST      | リクエスト形式エラー   |
| 401             | UNAUTHORIZED     | 認証エラー             |
| 403             | FORBIDDEN        | 権限エラー             |
| 404             | NOT_FOUND        | リソースが存在しない   |
| 409             | CONFLICT         | データ競合（重複など） |
| 422             | VALIDATION_ERROR | バリデーションエラー   |
| 500             | INTERNAL_ERROR   | サーバー内部エラー     |

### 1.6 ページネーション

一覧取得 API では以下のクエリパラメータでページネーションを制御する。

| パラメータ | 型      | デフォルト | 説明                             |
| ---------- | ------- | ---------- | -------------------------------- |
| page       | integer | 1          | ページ番号                       |
| per_page   | integer | 20         | 1 ページあたりの件数（最大 100） |

レスポンスには以下のメタ情報が含まれる。

```json
{
  "status": "success",
  "data": [ ... ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total_pages": 5,
    "total_count": 100
  }
}
```

---

## 2. API 一覧

| カテゴリ | メソッド | エンドポイント                     | 概要                     |
| -------- | -------- | ---------------------------------- | ------------------------ |
| 認証     | POST     | /auth/login                        | ログイン                 |
| 認証     | POST     | /auth/logout                       | ログアウト               |
| 認証     | POST     | /auth/refresh                      | トークンリフレッシュ     |
| 日報     | GET      | /reports                           | 日報一覧取得             |
| 日報     | POST     | /reports                           | 日報作成                 |
| 日報     | GET      | /reports/{id}                      | 日報詳細取得             |
| 日報     | PUT      | /reports/{id}                      | 日報更新                 |
| 日報     | DELETE   | /reports/{id}                      | 日報削除                 |
| 日報     | POST     | /reports/{id}/submit               | 日報提出                 |
| 日報     | POST     | /reports/{id}/confirm              | 日報確認                 |
| 訪問記録 | POST     | /reports/{report_id}/visits        | 訪問記録追加             |
| 訪問記録 | PUT      | /reports/{report_id}/visits/{id}   | 訪問記録更新             |
| 訪問記録 | DELETE   | /reports/{report_id}/visits/{id}   | 訪問記録削除             |
| Problem  | POST     | /reports/{report_id}/problems      | Problem 追加             |
| Problem  | PUT      | /reports/{report_id}/problems/{id} | Problem 更新             |
| Problem  | DELETE   | /reports/{report_id}/problems/{id} | Problem 削除             |
| Plan     | POST     | /reports/{report_id}/plans         | Plan 追加                |
| Plan     | PUT      | /reports/{report_id}/plans/{id}    | Plan 更新                |
| Plan     | DELETE   | /reports/{report_id}/plans/{id}    | Plan 削除                |
| コメント | POST     | /comments                          | コメント投稿             |
| コメント | DELETE   | /comments/{id}                     | コメント削除             |
| 顧客     | GET      | /customers                         | 顧客一覧取得             |
| 顧客     | POST     | /customers                         | 顧客登録                 |
| 顧客     | GET      | /customers/{id}                    | 顧客詳細取得             |
| 顧客     | PUT      | /customers/{id}                    | 顧客更新                 |
| 営業     | GET      | /salespersons                      | 営業一覧取得             |
| 営業     | POST     | /salespersons                      | 営業登録                 |
| 営業     | GET      | /salespersons/{id}                 | 営業詳細取得             |
| 営業     | PUT      | /salespersons/{id}                 | 営業更新                 |
| 営業     | GET      | /salespersons/me                   | ログインユーザー情報取得 |
| 営業     | GET      | /salespersons/{id}/subordinates    | 部下一覧取得             |

---

## 3. API 詳細

---

### 3.1 認証 API

---

#### POST /auth/login

ログイン認証を行い、アクセストークンを取得する。

##### リクエスト

```json
{
  "email": "yamada@example.com",
  "password": "password123"
}
```

| パラメータ | 型     | 必須 | 説明           |
| ---------- | ------ | ---- | -------------- |
| email      | string | ○    | メールアドレス |
| password   | string | ○    | パスワード     |

##### レスポンス（成功: 200）

```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
    "token_type": "Bearer",
    "expires_in": 3600,
    "user": {
      "id": 1,
      "employee_code": "E0001",
      "name": "山田太郎",
      "email": "yamada@example.com",
      "department": "営業部",
      "is_manager": false
    }
  }
}
```

##### エラーレスポンス（401）

```json
{
  "status": "error",
  "error": {
    "code": "UNAUTHORIZED",
    "message": "メールアドレスまたはパスワードが正しくありません"
  }
}
```

---

#### POST /auth/logout

ログアウトし、トークンを無効化する。

##### リクエストヘッダー

```
Authorization: Bearer {access_token}
```

##### レスポンス（成功: 200）

```json
{
  "status": "success",
  "data": {
    "message": "ログアウトしました"
  }
}
```

---

#### POST /auth/refresh

リフレッシュトークンを使用してアクセストークンを再発行する。

##### リクエスト

```json
{
  "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

##### レスポンス（成功: 200）

```json
{
  "status": "success",
  "data": {
    "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
    "token_type": "Bearer",
    "expires_in": 3600
  }
}
```

---

### 3.2 日報 API

---

#### GET /reports

日報一覧を取得する。

##### クエリパラメータ

| パラメータ     | 型      | 必須 | デフォルト | 説明                                              |
| -------------- | ------- | ---- | ---------- | ------------------------------------------------- |
| page           | integer | -    | 1          | ページ番号                                        |
| per_page       | integer | -    | 20         | 1 ページあたりの件数                              |
| salesperson_id | integer | -    | -          | 営業担当者 ID（上長のみ指定可）                   |
| status         | string  | -    | -          | ステータス（draft/submitted/confirmed）           |
| date_from      | string  | -    | -          | 報告日（開始）YYYY-MM-DD                          |
| date_to        | string  | -    | -          | 報告日（終了）YYYY-MM-DD                          |
| scope          | string  | -    | own        | 取得範囲（own: 自分のみ, subordinates: 部下含む） |

##### レスポンス（成功: 200）

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "report_date": "2024-01-15",
      "status": "submitted",
      "submitted_at": "2024-01-15T18:00:00+09:00",
      "visit_count": 3,
      "salesperson": {
        "id": 1,
        "name": "山田太郎"
      },
      "has_unread_comments": true,
      "created_at": "2024-01-15T09:00:00+09:00",
      "updated_at": "2024-01-15T18:00:00+09:00"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total_pages": 5,
    "total_count": 100
  }
}
```

---

#### POST /reports

新規日報を作成する。

##### リクエスト

```json
{
  "report_date": "2024-01-15",
  "visits": [
    {
      "customer_id": 1,
      "visit_time": "09:00",
      "result": "negotiating",
      "content": "新製品の提案を実施。次回見積提出予定。"
    },
    {
      "customer_id": 2,
      "visit_time": "11:00",
      "result": "closed",
      "content": "契約締結。来月からサービス開始。"
    }
  ],
  "problems": [
    {
      "content": "競合他社の値下げにより、価格面での優位性が低下している。",
      "display_order": 1
    }
  ],
  "plans": [
    {
      "content": "ABC社へ見積書を提出",
      "display_order": 1
    },
    {
      "content": "DEF社へアポイント電話",
      "display_order": 2
    }
  ]
}
```

| パラメータ               | 型      | 必須 | 説明                                               |
| ------------------------ | ------- | ---- | -------------------------------------------------- |
| report_date              | string  | ○    | 報告日（YYYY-MM-DD）                               |
| visits                   | array   | -    | 訪問記録の配列                                     |
| visits[].customer_id     | integer | ○    | 顧客 ID                                            |
| visits[].visit_time      | string  | -    | 訪問時刻（HH:MM）                                  |
| visits[].result          | string  | -    | 結果（negotiating/closed/rejected/info_gathering） |
| visits[].content         | string  | ○    | 訪問内容（最大 2000 文字）                         |
| problems                 | array   | -    | Problem の配列                                     |
| problems[].content       | string  | ○    | 課題・相談内容（最大 2000 文字）                   |
| problems[].display_order | integer | -    | 表示順                                             |
| plans                    | array   | -    | Plan の配列                                        |
| plans[].content          | string  | ○    | 明日やること（最大 2000 文字）                     |
| plans[].display_order    | integer | -    | 表示順                                             |

##### レスポンス（成功: 201）

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "report_date": "2024-01-15",
    "status": "draft",
    "salesperson": {
      "id": 1,
      "name": "山田太郎"
    },
    "visits": [
      {
        "id": 1,
        "customer": {
          "id": 1,
          "customer_code": "C0001",
          "name": "株式会社ABC"
        },
        "visit_time": "09:00",
        "result": "negotiating",
        "content": "新製品の提案を実施。次回見積提出予定。"
      }
    ],
    "problems": [
      {
        "id": 1,
        "content": "競合他社の値下げにより、価格面での優位性が低下している。",
        "display_order": 1,
        "comments": []
      }
    ],
    "plans": [
      {
        "id": 1,
        "content": "ABC社へ見積書を提出",
        "display_order": 1,
        "comments": []
      }
    ],
    "created_at": "2024-01-15T09:00:00+09:00",
    "updated_at": "2024-01-15T09:00:00+09:00"
  }
}
```

##### エラーレスポンス（409: 重複）

```json
{
  "status": "error",
  "error": {
    "code": "CONFLICT",
    "message": "指定された日付の日報は既に存在します"
  }
}
```

---

#### GET /reports/{id}

日報詳細を取得する。

##### パスパラメータ

| パラメータ | 型      | 必須 | 説明    |
| ---------- | ------- | ---- | ------- |
| id         | integer | ○    | 日報 ID |

##### レスポンス（成功: 200）

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "report_date": "2024-01-15",
    "status": "submitted",
    "submitted_at": "2024-01-15T18:00:00+09:00",
    "salesperson": {
      "id": 1,
      "employee_code": "E0002",
      "name": "山田太郎",
      "department": "営業部",
      "manager": {
        "id": 2,
        "name": "佐藤部長"
      }
    },
    "visits": [
      {
        "id": 1,
        "customer": {
          "id": 1,
          "customer_code": "C0001",
          "name": "株式会社ABC",
          "industry": "製造業"
        },
        "visit_time": "09:00",
        "result": "negotiating",
        "result_label": "商談中",
        "content": "新製品の提案を実施。次回見積提出予定。"
      },
      {
        "id": 2,
        "customer": {
          "id": 2,
          "customer_code": "C0002",
          "name": "株式会社XYZ",
          "industry": "小売業"
        },
        "visit_time": "11:00",
        "result": "closed",
        "result_label": "成約",
        "content": "契約締結。来月からサービス開始。"
      }
    ],
    "problems": [
      {
        "id": 1,
        "content": "競合他社の値下げにより、価格面での優位性が低下している。",
        "display_order": 1,
        "comments": [
          {
            "id": 1,
            "content": "来週のMTGで対策を検討しましょう。",
            "commenter": {
              "id": 2,
              "name": "佐藤部長"
            },
            "created_at": "2024-01-15T18:30:00+09:00"
          }
        ]
      }
    ],
    "plans": [
      {
        "id": 1,
        "content": "ABC社へ見積書を提出",
        "display_order": 1,
        "comments": []
      },
      {
        "id": 2,
        "content": "DEF社へアポイント電話",
        "display_order": 2,
        "comments": []
      }
    ],
    "created_at": "2024-01-15T09:00:00+09:00",
    "updated_at": "2024-01-15T18:30:00+09:00"
  }
}
```

---

#### PUT /reports/{id}

日報を更新する。ステータスが「confirmed」の場合は更新不可。

##### パスパラメータ

| パラメータ | 型      | 必須 | 説明    |
| ---------- | ------- | ---- | ------- |
| id         | integer | ○    | 日報 ID |

##### リクエスト

```json
{
  "visits": [
    {
      "id": 1,
      "customer_id": 1,
      "visit_time": "09:30",
      "result": "negotiating",
      "content": "新製品の提案を実施。次回見積提出予定。（更新）"
    }
  ],
  "problems": [
    {
      "id": 1,
      "content": "競合他社の値下げにより、価格面での優位性が低下している。対策を検討中。",
      "display_order": 1
    }
  ],
  "plans": [
    {
      "content": "新規追加のPlan",
      "display_order": 3
    }
  ]
}
```

##### レスポンス（成功: 200）

日報詳細と同じ形式。

##### エラーレスポンス（403: 権限エラー）

```json
{
  "status": "error",
  "error": {
    "code": "FORBIDDEN",
    "message": "確認済の日報は編集できません"
  }
}
```

---

#### DELETE /reports/{id}

日報を削除する。ステータスが「draft」の場合のみ削除可能。

##### パスパラメータ

| パラメータ | 型      | 必須 | 説明    |
| ---------- | ------- | ---- | ------- |
| id         | integer | ○    | 日報 ID |

##### レスポンス（成功: 200）

```json
{
  "status": "success",
  "data": {
    "message": "日報を削除しました"
  }
}
```

---

#### POST /reports/{id}/submit

日報を提出する（ステータスを「submitted」に変更）。

##### パスパラメータ

| パラメータ | 型      | 必須 | 説明    |
| ---------- | ------- | ---- | ------- |
| id         | integer | ○    | 日報 ID |

##### リクエスト

なし（空のボディまたは空オブジェクト）

##### レスポンス（成功: 200）

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "status": "submitted",
    "submitted_at": "2024-01-15T18:00:00+09:00"
  }
}
```

##### エラーレスポンス（422: バリデーションエラー）

```json
{
  "status": "error",
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "提出できません",
    "details": ["訪問記録を1件以上入力してください"]
  }
}
```

---

#### POST /reports/{id}/confirm

日報を確認済にする（上長のみ実行可能）。

##### パスパラメータ

| パラメータ | 型      | 必須 | 説明    |
| ---------- | ------- | ---- | ------- |
| id         | integer | ○    | 日報 ID |

##### レスポンス（成功: 200）

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "status": "confirmed",
    "confirmed_at": "2024-01-15T19:00:00+09:00"
  }
}
```

---

### 3.3 訪問記録 API

---

#### POST /reports/{report_id}/visits

訪問記録を追加する。

##### パスパラメータ

| パラメータ | 型      | 必須 | 説明    |
| ---------- | ------- | ---- | ------- |
| report_id  | integer | ○    | 日報 ID |

##### リクエスト

```json
{
  "customer_id": 3,
  "visit_time": "14:00",
  "result": "info_gathering",
  "content": "情報収集のためのヒアリングを実施。"
}
```

##### レスポンス（成功: 201）

```json
{
  "status": "success",
  "data": {
    "id": 3,
    "customer": {
      "id": 3,
      "customer_code": "C0003",
      "name": "株式会社DEF"
    },
    "visit_time": "14:00",
    "result": "info_gathering",
    "content": "情報収集のためのヒアリングを実施。",
    "created_at": "2024-01-15T14:30:00+09:00"
  }
}
```

---

#### PUT /reports/{report_id}/visits/{id}

訪問記録を更新する。

##### パスパラメータ

| パラメータ | 型      | 必須 | 説明        |
| ---------- | ------- | ---- | ----------- |
| report_id  | integer | ○    | 日報 ID     |
| id         | integer | ○    | 訪問記録 ID |

##### リクエスト

```json
{
  "customer_id": 3,
  "visit_time": "14:30",
  "result": "negotiating",
  "content": "情報収集のためのヒアリングを実施。次回提案予定。"
}
```

##### レスポンス（成功: 200）

訪問記録追加と同じ形式。

---

#### DELETE /reports/{report_id}/visits/{id}

訪問記録を削除する。

##### パスパラメータ

| パラメータ | 型      | 必須 | 説明        |
| ---------- | ------- | ---- | ----------- |
| report_id  | integer | ○    | 日報 ID     |
| id         | integer | ○    | 訪問記録 ID |

##### レスポンス（成功: 200）

```json
{
  "status": "success",
  "data": {
    "message": "訪問記録を削除しました"
  }
}
```

---

### 3.4 Problem/Plan API

Problem API と Plan API は同じ構造のため、まとめて記載する。

---

#### POST /reports/{report_id}/problems

#### POST /reports/{report_id}/plans

Problem/Plan を追加する。

##### リクエスト

```json
{
  "content": "新しい課題または予定の内容",
  "display_order": 1
}
```

| パラメータ    | 型      | 必須 | 説明                   |
| ------------- | ------- | ---- | ---------------------- |
| content       | string  | ○    | 内容（最大 2000 文字） |
| display_order | integer | -    | 表示順                 |

##### レスポンス（成功: 201）

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "content": "新しい課題または予定の内容",
    "display_order": 1,
    "comments": [],
    "created_at": "2024-01-15T10:00:00+09:00"
  }
}
```

---

#### PUT /reports/{report_id}/problems/{id}

#### PUT /reports/{report_id}/plans/{id}

Problem/Plan を更新する。

##### リクエスト

```json
{
  "content": "更新された内容",
  "display_order": 2
}
```

---

#### DELETE /reports/{report_id}/problems/{id}

#### DELETE /reports/{report_id}/plans/{id}

Problem/Plan を削除する。

##### レスポンス（成功: 200）

```json
{
  "status": "success",
  "data": {
    "message": "削除しました"
  }
}
```

---

### 3.5 コメント API

---

#### POST /comments

コメントを投稿する（上長のみ実行可能）。

##### リクエスト

```json
{
  "commentable_type": "Problem",
  "commentable_id": 1,
  "content": "来週のMTGで対策を検討しましょう。"
}
```

| パラメータ       | 型      | 必須 | 説明                           |
| ---------------- | ------- | ---- | ------------------------------ |
| commentable_type | string  | ○    | 対象種別（Problem / Plan）     |
| commentable_id   | integer | ○    | 対象 ID                        |
| content          | string  | ○    | コメント内容（最大 1000 文字） |

##### レスポンス（成功: 201）

```json
{
  "status": "success",
  "data": {
    "id": 1,
    "commentable_type": "Problem",
    "commentable_id": 1,
    "content": "来週のMTGで対策を検討しましょう。",
    "commenter": {
      "id": 2,
      "name": "佐藤部長"
    },
    "created_at": "2024-01-15T18:30:00+09:00"
  }
}
```

---

#### DELETE /comments/{id}

コメントを削除する（投稿者本人のみ実行可能）。

##### パスパラメータ

| パラメータ | 型      | 必須 | 説明        |
| ---------- | ------- | ---- | ----------- |
| id         | integer | ○    | コメント ID |

##### レスポンス（成功: 200）

```json
{
  "status": "success",
  "data": {
    "message": "コメントを削除しました"
  }
}
```

---

### 3.6 顧客 API

---

#### GET /customers

顧客一覧を取得する。

##### クエリパラメータ

| パラメータ    | 型      | 必須 | デフォルト | 説明                   |
| ------------- | ------- | ---- | ---------- | ---------------------- |
| page          | integer | -    | 1          | ページ番号             |
| per_page      | integer | -    | 20         | 1 ページあたりの件数   |
| customer_code | string  | -    | -          | 顧客コード（部分一致） |
| name          | string  | -    | -          | 顧客名（部分一致）     |
| industry      | string  | -    | -          | 業種                   |
| is_active     | boolean | -    | true       | 有効フラグ             |

##### レスポンス（成功: 200）

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "customer_code": "C0001",
      "name": "株式会社ABC",
      "industry": "製造業",
      "address": "東京都千代田区...",
      "phone": "03-1234-5678",
      "is_active": true,
      "created_at": "2024-01-01T00:00:00+09:00",
      "updated_at": "2024-01-01T00:00:00+09:00"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total_pages": 3,
    "total_count": 50
  }
}
```

---

#### POST /customers

顧客を登録する（管理者のみ実行可能）。

##### リクエスト

```json
{
  "customer_code": "C0003",
  "name": "株式会社DEF",
  "industry": "IT",
  "postal_code": "100-0001",
  "address": "東京都千代田区...",
  "phone": "03-3456-7890",
  "is_active": true
}
```

| パラメータ    | 型      | 必須 | 説明                             |
| ------------- | ------- | ---- | -------------------------------- |
| customer_code | string  | ○    | 顧客コード（最大 10 文字、一意） |
| name          | string  | ○    | 顧客名（最大 100 文字）          |
| industry      | string  | -    | 業種                             |
| postal_code   | string  | -    | 郵便番号（XXX-XXXX 形式）        |
| address       | string  | -    | 住所（最大 255 文字）            |
| phone         | string  | -    | 電話番号（最大 20 文字）         |
| is_active     | boolean | -    | 有効フラグ（デフォルト: true）   |

##### レスポンス（成功: 201）

```json
{
  "status": "success",
  "data": {
    "id": 3,
    "customer_code": "C0003",
    "name": "株式会社DEF",
    "industry": "IT",
    "postal_code": "100-0001",
    "address": "東京都千代田区...",
    "phone": "03-3456-7890",
    "is_active": true,
    "created_at": "2024-01-15T10:00:00+09:00",
    "updated_at": "2024-01-15T10:00:00+09:00"
  }
}
```

---

#### GET /customers/{id}

顧客詳細を取得する。

##### パスパラメータ

| パラメータ | 型      | 必須 | 説明    |
| ---------- | ------- | ---- | ------- |
| id         | integer | ○    | 顧客 ID |

##### レスポンス（成功: 200）

顧客登録のレスポンスと同じ形式。

---

#### PUT /customers/{id}

顧客情報を更新する（管理者のみ実行可能）。

##### パスパラメータ

| パラメータ | 型      | 必須 | 説明    |
| ---------- | ------- | ---- | ------- |
| id         | integer | ○    | 顧客 ID |

##### リクエスト

```json
{
  "name": "株式会社DEF（更新）",
  "phone": "03-9999-9999",
  "is_active": true
}
```

##### レスポンス（成功: 200）

顧客登録のレスポンスと同じ形式。

---

### 3.7 営業 API

---

#### GET /salespersons

営業一覧を取得する（管理者のみ実行可能）。

##### クエリパラメータ

| パラメータ    | 型      | 必須 | デフォルト | 説明                 |
| ------------- | ------- | ---- | ---------- | -------------------- |
| page          | integer | -    | 1          | ページ番号           |
| per_page      | integer | -    | 20         | 1 ページあたりの件数 |
| employee_code | string  | -    | -          | 社員番号（部分一致） |
| name          | string  | -    | -          | 氏名（部分一致）     |
| department    | string  | -    | -          | 部署                 |
| is_active     | boolean | -    | true       | 有効フラグ           |

##### レスポンス（成功: 200）

```json
{
  "status": "success",
  "data": [
    {
      "id": 1,
      "employee_code": "E0001",
      "name": "佐藤部長",
      "email": "sato@example.com",
      "department": "営業部",
      "manager": null,
      "is_active": true,
      "created_at": "2024-01-01T00:00:00+09:00",
      "updated_at": "2024-01-01T00:00:00+09:00"
    },
    {
      "id": 2,
      "employee_code": "E0002",
      "name": "山田太郎",
      "email": "yamada@example.com",
      "department": "営業部",
      "manager": {
        "id": 1,
        "name": "佐藤部長"
      },
      "is_active": true,
      "created_at": "2024-01-01T00:00:00+09:00",
      "updated_at": "2024-01-01T00:00:00+09:00"
    }
  ],
  "meta": {
    "current_page": 1,
    "per_page": 20,
    "total_pages": 1,
    "total_count": 10
  }
}
```

---

#### POST /salespersons

営業を登録する（管理者のみ実行可能）。

##### リクエスト

```json
{
  "employee_code": "E0003",
  "name": "鈴木花子",
  "email": "suzuki@example.com",
  "password": "password123",
  "department": "営業部",
  "manager_id": 1,
  "is_active": true
}
```

| パラメータ    | 型      | 必須 | 説明                           |
| ------------- | ------- | ---- | ------------------------------ |
| employee_code | string  | ○    | 社員番号（最大 10 文字、一意） |
| name          | string  | ○    | 氏名（最大 50 文字）           |
| email         | string  | ○    | メールアドレス（一意）         |
| password      | string  | ○    | パスワード（8 文字以上）       |
| department    | string  | ○    | 部署                           |
| manager_id    | integer | -    | 上長 ID                        |
| is_active     | boolean | -    | 有効フラグ（デフォルト: true） |

##### レスポンス（成功: 201）

```json
{
  "status": "success",
  "data": {
    "id": 3,
    "employee_code": "E0003",
    "name": "鈴木花子",
    "email": "suzuki@example.com",
    "department": "営業部",
    "manager": {
      "id": 1,
      "name": "佐藤部長"
    },
    "is_active": true,
    "created_at": "2024-01-15T10:00:00+09:00",
    "updated_at": "2024-01-15T10:00:00+09:00"
  }
}
```

---

#### GET /salespersons/{id}

営業詳細を取得する。

##### パスパラメータ

| パラメータ | 型      | 必須 | 説明    |
| ---------- | ------- | ---- | ------- |
| id         | integer | ○    | 営業 ID |

##### レスポンス（成功: 200）

営業登録のレスポンスと同じ形式。

---

#### PUT /salespersons/{id}

営業情報を更新する（管理者のみ実行可能）。

##### パスパラメータ

| パラメータ | 型      | 必須 | 説明    |
| ---------- | ------- | ---- | ------- |
| id         | integer | ○    | 営業 ID |

##### リクエスト

```json
{
  "name": "鈴木花子",
  "email": "suzuki@example.com",
  "password": "newpassword456",
  "department": "営業部",
  "manager_id": 1,
  "is_active": true
}
```

※ password は省略可能（省略時は変更なし）

##### レスポンス（成功: 200）

営業登録のレスポンスと同じ形式。

---

#### GET /salespersons/me

ログイン中のユーザー情報を取得する。

##### レスポンス（成功: 200）

```json
{
  "status": "success",
  "data": {
    "id": 2,
    "employee_code": "E0002",
    "name": "山田太郎",
    "email": "yamada@example.com",
    "department": "営業部",
    "manager": {
      "id": 1,
      "name": "佐藤部長"
    },
    "is_manager": false,
    "subordinate_count": 0,
    "is_active": true,
    "created_at": "2024-01-01T00:00:00+09:00",
    "updated_at": "2024-01-01T00:00:00+09:00"
  }
}
```

---

#### GET /salespersons/{id}/subordinates

部下一覧を取得する。

##### パスパラメータ

| パラメータ | 型      | 必須 | 説明    |
| ---------- | ------- | ---- | ------- |
| id         | integer | ○    | 営業 ID |

##### レスポンス（成功: 200）

```json
{
  "status": "success",
  "data": [
    {
      "id": 2,
      "employee_code": "E0002",
      "name": "山田太郎",
      "email": "yamada@example.com",
      "department": "営業部",
      "is_active": true
    },
    {
      "id": 3,
      "employee_code": "E0003",
      "name": "鈴木花子",
      "email": "suzuki@example.com",
      "department": "営業部",
      "is_active": true
    }
  ]
}
```

---

## 4. 列挙値一覧

### 4.1 日報ステータス

| 値        | 表示名 | 説明           |
| --------- | ------ | -------------- |
| draft     | 下書き | 作成中、未提出 |
| submitted | 提出済 | 上長確認待ち   |
| confirmed | 確認済 | 上長確認完了   |

### 4.2 訪問結果

| 値             | 表示名   | 説明                 |
| -------------- | -------- | -------------------- |
| negotiating    | 商談中   | 商談継続中           |
| closed         | 成約     | 契約成立             |
| rejected       | 見送り   | 失注・見送り         |
| info_gathering | 情報収集 | ヒアリング・情報収集 |

### 4.3 コメント対象種別

| 値      | 説明         |
| ------- | ------------ |
| Problem | 課題・相談   |
| Plan    | 明日やること |

---

## 5. セキュリティ要件

### 5.1 認証・認可

| 項目             | 要件                                                  |
| ---------------- | ----------------------------------------------------- |
| トークン有効期限 | アクセストークン: 1 時間、リフレッシュトークン: 30 日 |
| パスワード要件   | 8 文字以上、英数字混在推奨                            |
| パスワード保存   | bcrypt でハッシュ化                                   |
| ログイン試行制限 | 5 回失敗で 15 分間ロック                              |

### 5.2 権限制御

| 操作                 | 営業担当者 | 上長 | 管理者 |
| -------------------- | ---------- | ---- | ------ |
| 自分の日報作成・編集 | ○          | ○    | ○      |
| 部下の日報閲覧       | ×          | ○    | ○      |
| 日報確認             | ×          | ○    | ○      |
| コメント投稿         | ×          | ○    | ○      |
| 顧客マスタ閲覧       | ○          | ○    | ○      |
| 顧客マスタ編集       | ×          | ×    | ○      |
| 営業マスタ管理       | ×          | ×    | ○      |

### 5.3 データアクセス制御

- 営業担当者は自分の日報のみアクセス可能
- 上長は直属の部下の日報のみアクセス可能
- 管理者は全データにアクセス可能

---

## 6. レート制限

| エンドポイント   | 制限               |
| ---------------- | ------------------ |
| POST /auth/login | 10 回/分/IP        |
| その他の API     | 100 回/分/ユーザー |

レート制限超過時は 429 Too Many Requests を返す。

```json
{
  "status": "error",
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "リクエスト回数が制限を超えました。しばらく待ってから再試行してください。",
    "retry_after": 60
  }
}
```

---

## 7. 変更履歴

| バージョン | 日付       | 変更内容 |
| ---------- | ---------- | -------- |
| 1.0.0      | 2024-01-15 | 初版作成 |
