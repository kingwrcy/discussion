-- CreateEnum
CREATE TYPE "EmailReason" AS ENUM ('REGISTER', 'RESET_PASSWORD', 'CHANGE_EMAIL');

-- CreateTable
CREATE TABLE "EmailCode" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "key" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "validAt" TIMESTAMP(3) NOT NULL,
    "used" BOOLEAN NOT NULL DEFAULT false,
    "reason" "EmailReason" NOT NULL,
    "targetEmail" TEXT NOT NULL,

    CONSTRAINT "EmailCode_pkey" PRIMARY KEY ("id")
);
