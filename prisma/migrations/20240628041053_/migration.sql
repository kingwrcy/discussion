-- CreateTable
CREATE TABLE "inviteCode" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "endAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fromUid" TEXT,
    "toUid" TEXT NOT NULL,
    "content" TEXT NOT NULL,

    CONSTRAINT "inviteCode_pkey" PRIMARY KEY ("id")
);
