-- AlterTable
ALTER TABLE "User" ADD COLUMN     "secretKey" TEXT;

UPDATE "User"
SET "secretKey" = md5(random()::text);
