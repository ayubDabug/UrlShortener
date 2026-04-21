/*
  Warnings:

  - You are about to drop the column `shortUrl` on the `Url` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Url" DROP COLUMN "shortUrl",
ALTER COLUMN "clickCount" SET DEFAULT 0,
ALTER COLUMN "randomCode" SET DATA TYPE TEXT;
