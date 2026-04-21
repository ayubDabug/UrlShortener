-- CreateTable
CREATE TABLE "Url" (
    "id" SERIAL NOT NULL,
    "clickCount" INTEGER NOT NULL,
    "longUrl" TEXT NOT NULL,
    "shortUrl" TEXT NOT NULL,

    CONSTRAINT "Url_pkey" PRIMARY KEY ("id")
);
