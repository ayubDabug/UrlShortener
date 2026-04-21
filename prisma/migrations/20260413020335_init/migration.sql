/*
  Warnings:

  - A unique constraint covering the columns `[randomCode]` on the table `Url` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `randomCode` to the `Url` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Url" ADD COLUMN     "randomCode" INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "Url_randomCode_key" ON "Url"("randomCode");
