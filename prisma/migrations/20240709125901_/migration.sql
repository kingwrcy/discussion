-- CreateTable
CREATE TABLE "Title" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "count" INTEGER NOT NULL DEFAULT 0,
    "style" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Title_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_TitleToUser" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Title_title_key" ON "Title"("title");

-- CreateIndex
CREATE UNIQUE INDEX "_TitleToUser_AB_unique" ON "_TitleToUser"("A", "B");

-- CreateIndex
CREATE INDEX "_TitleToUser_B_index" ON "_TitleToUser"("B");

-- AddForeignKey
ALTER TABLE "_TitleToUser" ADD CONSTRAINT "_TitleToUser_A_fkey" FOREIGN KEY ("A") REFERENCES "Title"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_TitleToUser" ADD CONSTRAINT "_TitleToUser_B_fkey" FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
