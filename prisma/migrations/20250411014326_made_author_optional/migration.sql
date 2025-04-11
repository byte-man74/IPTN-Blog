-- DropForeignKey
ALTER TABLE "News" DROP CONSTRAINT "News_authorId_fkey";

-- AlterTable
ALTER TABLE "News" ALTER COLUMN "authorId" DROP NOT NULL;

-- AddForeignKey
ALTER TABLE "News" ADD CONSTRAINT "News_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
