/*
  Warnings:

  - Made the column `fromUid` on table `inviteCode` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "invitedById" INTEGER;

-- AlterTable
ALTER TABLE "inviteCode" ALTER COLUMN "fromUid" SET NOT NULL,
ALTER COLUMN "toUid" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_invitedById_fkey" FOREIGN KEY ("invitedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "inviteCode" ADD CONSTRAINT "inviteCode_fromUid_fkey" FOREIGN KEY ("fromUid") REFERENCES "User"("uid") ON DELETE RESTRICT ON UPDATE CASCADE;
