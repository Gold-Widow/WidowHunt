/*
  Warnings:

  - Added the required column `permissions` to the `userEntry` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "userEntry" ADD COLUMN     "permissions" JSONB NOT NULL;
