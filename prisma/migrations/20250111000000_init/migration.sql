-- CreateTable
CREATE TABLE "salesperson" (
    "id" BIGSERIAL NOT NULL,
    "employee_code" VARCHAR(10) NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(128) NOT NULL,
    "manager_id" BIGINT,
    "department" VARCHAR(50) NOT NULL,
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "salesperson_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "customer" (
    "id" BIGSERIAL NOT NULL,
    "customer_code" VARCHAR(10) NOT NULL,
    "name" VARCHAR(100) NOT NULL,
    "postal_code" VARCHAR(8),
    "address" VARCHAR(255),
    "phone" VARCHAR(20),
    "industry" VARCHAR(50),
    "is_active" BOOLEAN NOT NULL DEFAULT true,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "customer_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "daily_report" (
    "id" BIGSERIAL NOT NULL,
    "salesperson_id" BIGINT NOT NULL,
    "report_date" DATE NOT NULL,
    "status" VARCHAR(20) NOT NULL DEFAULT 'draft',
    "submitted_at" TIMESTAMP(3),
    "confirmed_at" TIMESTAMP(3),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "daily_report_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "visit_record" (
    "id" BIGSERIAL NOT NULL,
    "daily_report_id" BIGINT NOT NULL,
    "customer_id" BIGINT NOT NULL,
    "visit_time" VARCHAR(5),
    "content" TEXT NOT NULL,
    "result" VARCHAR(20),
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "visit_record_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "problem" (
    "id" BIGSERIAL NOT NULL,
    "daily_report_id" BIGINT NOT NULL,
    "content" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "problem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "plan" (
    "id" BIGSERIAL NOT NULL,
    "daily_report_id" BIGINT NOT NULL,
    "content" TEXT NOT NULL,
    "display_order" INTEGER NOT NULL DEFAULT 0,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "plan_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "comment" (
    "id" BIGSERIAL NOT NULL,
    "salesperson_id" BIGINT NOT NULL,
    "commentable_type" VARCHAR(20) NOT NULL,
    "commentable_id" BIGINT NOT NULL,
    "content" TEXT NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "comment_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "salesperson_employee_code_key" ON "salesperson"("employee_code");

-- CreateIndex
CREATE UNIQUE INDEX "salesperson_email_key" ON "salesperson"("email");

-- CreateIndex
CREATE INDEX "salesperson_email_idx" ON "salesperson"("email");

-- CreateIndex
CREATE INDEX "salesperson_department_idx" ON "salesperson"("department");

-- CreateIndex
CREATE INDEX "salesperson_manager_id_idx" ON "salesperson"("manager_id");

-- CreateIndex
CREATE UNIQUE INDEX "customer_customer_code_key" ON "customer"("customer_code");

-- CreateIndex
CREATE INDEX "customer_name_idx" ON "customer"("name");

-- CreateIndex
CREATE INDEX "customer_industry_idx" ON "customer"("industry");

-- CreateIndex
CREATE INDEX "customer_is_active_idx" ON "customer"("is_active");

-- CreateIndex
CREATE INDEX "daily_report_salesperson_id_idx" ON "daily_report"("salesperson_id");

-- CreateIndex
CREATE INDEX "daily_report_report_date_idx" ON "daily_report"("report_date");

-- CreateIndex
CREATE INDEX "daily_report_status_idx" ON "daily_report"("status");

-- CreateIndex
CREATE UNIQUE INDEX "daily_report_salesperson_id_report_date_key" ON "daily_report"("salesperson_id", "report_date");

-- CreateIndex
CREATE INDEX "visit_record_daily_report_id_idx" ON "visit_record"("daily_report_id");

-- CreateIndex
CREATE INDEX "visit_record_customer_id_idx" ON "visit_record"("customer_id");

-- CreateIndex
CREATE INDEX "problem_daily_report_id_idx" ON "problem"("daily_report_id");

-- CreateIndex
CREATE INDEX "plan_daily_report_id_idx" ON "plan"("daily_report_id");

-- CreateIndex
CREATE INDEX "comment_salesperson_id_idx" ON "comment"("salesperson_id");

-- CreateIndex
CREATE INDEX "comment_commentable_type_commentable_id_idx" ON "comment"("commentable_type", "commentable_id");

-- AddForeignKey
ALTER TABLE "salesperson" ADD CONSTRAINT "salesperson_manager_id_fkey" FOREIGN KEY ("manager_id") REFERENCES "salesperson"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "daily_report" ADD CONSTRAINT "daily_report_salesperson_id_fkey" FOREIGN KEY ("salesperson_id") REFERENCES "salesperson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_record" ADD CONSTRAINT "visit_record_daily_report_id_fkey" FOREIGN KEY ("daily_report_id") REFERENCES "daily_report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "visit_record" ADD CONSTRAINT "visit_record_customer_id_fkey" FOREIGN KEY ("customer_id") REFERENCES "customer"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "problem" ADD CONSTRAINT "problem_daily_report_id_fkey" FOREIGN KEY ("daily_report_id") REFERENCES "daily_report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "plan" ADD CONSTRAINT "plan_daily_report_id_fkey" FOREIGN KEY ("daily_report_id") REFERENCES "daily_report"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "comment" ADD CONSTRAINT "comment_salesperson_id_fkey" FOREIGN KEY ("salesperson_id") REFERENCES "salesperson"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
