erDiagram
SALESPERSON ||--o{ DAILY_REPORT : "作成する"
SALESPERSON ||--o{ COMMENT : "投稿する"
SALESPERSON }o--|| SALESPERSON : "上長"

    DAILY_REPORT ||--|{ VISIT_RECORD : "含む"
    DAILY_REPORT ||--o{ PROBLEM : "持つ"
    DAILY_REPORT ||--o{ PLAN : "持つ"

    VISIT_RECORD }o--|| CUSTOMER : "訪問先"

    PROBLEM ||--o{ COMMENT : "付く"
    PLAN ||--o{ COMMENT : "付く"

    SALESPERSON {
        bigint id PK
        string employee_code UK "社員番号"
        string name "氏名"
        string email UK
        bigint manager_id FK "上長ID"
        string department "部署"
        boolean is_active "有効フラグ"
        datetime created_at
        datetime updated_at
    }

    CUSTOMER {
        bigint id PK
        string customer_code UK "顧客コード"
        string name "顧客名"
        string address "住所"
        string phone "電話番号"
        string industry "業種"
        boolean is_active "有効フラグ"
        datetime created_at
        datetime updated_at
    }

    DAILY_REPORT {
        bigint id PK
        bigint salesperson_id FK "作成者"
        date report_date "報告日"
        string status "ステータス(draft/submitted/reviewed)"
        datetime submitted_at "提出日時"
        datetime created_at
        datetime updated_at
    }

    VISIT_RECORD {
        bigint id PK
        bigint daily_report_id FK
        bigint customer_id FK "訪問先顧客"
        time visit_time "訪問時刻"
        text content "訪問内容"
        string result "結果(商談中/成約/見送り等)"
        datetime created_at
        datetime updated_at
    }

    PROBLEM {
        bigint id PK
        bigint daily_report_id FK
        text content "課題・相談内容"
        integer display_order "表示順"
        datetime created_at
        datetime updated_at
    }

    PLAN {
        bigint id PK
        bigint daily_report_id FK
        text content "明日やること"
        integer display_order "表示順"
        datetime created_at
        datetime updated_at
    }

    COMMENT {
        bigint id PK
        bigint salesperson_id FK "コメント者"
        string commentable_type "対象種別(Problem/Plan)"
        bigint commentable_id "対象ID"
        text content "コメント内容"
        datetime created_at
        datetime updated_at
    }

}
