/*
  Warnings:

  - Added the required column `updatedAt` to the `TodaysTheme` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TodaysTheme" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;
