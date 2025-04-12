/*
  Warnings:

  - The primary key for the `Seo` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - Made the column `newsId` on table `Seo` required. This step will fail if there are existing NULL values in that column.

*/
-- DropIndex
DROP INDEX "Seo_id_idx";

-- AlterTable
ALTER TABLE "Seo" DROP CONSTRAINT "Seo_pkey",
ADD COLUMN     "metaDescription" TEXT,
ADD COLUMN     "metaTitle" TEXT,
ALTER COLUMN "id" DROP DEFAULT,
ALTER COLUMN "id" SET DATA TYPE TEXT,
ALTER COLUMN "newsId" SET NOT NULL,
ADD CONSTRAINT "Seo_pkey" PRIMARY KEY ("id");
DROP SEQUENCE "Seo_id_seq";
