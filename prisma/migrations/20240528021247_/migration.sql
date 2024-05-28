-- CreateEnum
CREATE TYPE "MessageType" AS ENUM ('MENTIONED', 'COMMENT', 'SIGNIN', 'LIKE', 'DISLIKE');

-- AlterTable
ALTER TABLE "Message" ADD COLUMN     "relationId" TEXT,
ADD COLUMN     "type" "MessageType";
