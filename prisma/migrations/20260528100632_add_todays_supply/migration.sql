-- CreateTable
CREATE TABLE "TodaysSupply" (
    "id" SERIAL NOT NULL,
    "date" TEXT NOT NULL,
    "data" JSONB NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TodaysSupply_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TodaysSupply_date_key" ON "TodaysSupply"("date");
