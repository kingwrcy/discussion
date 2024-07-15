-- AlterTable
ALTER TABLE "Post" ADD COLUMN     "hide" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "hideContent" TEXT,
ADD COLUMN     "payPoint" INTEGER NOT NULL DEFAULT 0;

-- CreateTable
CREATE TABLE "pay" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "pid" TEXT NOT NULL,
    "uid" TEXT NOT NULL,
    "point" INTEGER NOT NULL,

    CONSTRAINT "pay_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "pay" ADD CONSTRAINT "pay_pid_fkey" FOREIGN KEY ("pid") REFERENCES "Post"("pid") ON DELETE RESTRICT ON UPDATE CASCADE;
