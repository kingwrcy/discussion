/*
  Warnings:

  - A unique constraint covering the columns `[enName]` on the table `Tag` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "enName" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "Tag_enName_key" ON "Tag"("enName");
