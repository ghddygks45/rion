-- CreateTable
CREATE TABLE "TodaysTheme" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TodaysTheme_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TodaysTheme_date_type_key" ON "TodaysTheme"("date", "type");
