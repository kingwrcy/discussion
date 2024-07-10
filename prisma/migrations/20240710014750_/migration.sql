-- AlterEnum
ALTER TYPE "PointReason" ADD VALUE 'SEND';

-- AlterTable
ALTER TABLE "PointHistory" ADD COLUMN     "remark" TEXT;
