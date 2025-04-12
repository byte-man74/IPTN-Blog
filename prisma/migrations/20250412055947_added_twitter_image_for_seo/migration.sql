/*
  Warnings:

  - You are about to drop the column `canonicalUrl` on the `Seo` table. All the data in the column will be lost.
  - You are about to drop the column `description` on the `Seo` table. All the data in the column will be lost.
  - You are about to drop the column `keywords` on the `Seo` table. All the data in the column will be lost.
  - You are about to drop the column `title` on the `Seo` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Seo" DROP COLUMN "canonicalUrl",
DROP COLUMN "description",
DROP COLUMN "keywords",
DROP COLUMN "title",
ADD COLUMN     "twitterImage" TEXT;
