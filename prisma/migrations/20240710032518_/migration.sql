update "inviteCode" set "toUid" = null where "toUid" = '';
-- AddForeignKey
ALTER TABLE "inviteCode" ADD CONSTRAINT "inviteCode_toUid_fkey" FOREIGN KEY ("toUid") REFERENCES "User"("uid") ON DELETE SET NULL ON UPDATE CASCADE;
