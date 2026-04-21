/*
  Warnings:

  - You are about to drop the `Url` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE "Url";

-- CreateTable
CREATE TABLE "url" (
    "id" SERIAL NOT NULL,
    "clickCount" INTEGER NOT NULL DEFAULT 0,
    "longUrl" TEXT NOT NULL,
    "randomCode" TEXT NOT NULL,

    CONSTRAINT "url_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "url_randomCode_key" ON "url"("randomCode");
