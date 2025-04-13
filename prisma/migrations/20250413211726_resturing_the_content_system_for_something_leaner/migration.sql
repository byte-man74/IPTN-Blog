/*
  Warnings:

  - You are about to drop the column `navBarKeyCategories` on the `SiteConfiguration` table. All the data in the column will be lost.
  - You are about to drop the column `navBarSubCategories` on the `SiteConfiguration` table. All the data in the column will be lost.
  - You are about to drop the `HomePageSection` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "HomePageSection" DROP CONSTRAINT "HomePageSection_heroCenterId_fkey";

-- DropForeignKey
ALTER TABLE "HomePageSection" DROP CONSTRAINT "HomePageSection_heroRightId_fkey";

-- DropForeignKey
ALTER TABLE "HomePageSection" DROP CONSTRAINT "HomePageSection_heroTopLeftId_fkey";

-- DropForeignKey
ALTER TABLE "HomePageSection" DROP CONSTRAINT "HomePageSection_siteConfigurationId_fkey";

-- AlterTable
ALTER TABLE "SiteConfiguration" DROP COLUMN "navBarKeyCategories",
DROP COLUMN "navBarSubCategories";

-- DropTable
DROP TABLE "HomePageSection";

-- CreateTable
CREATE TABLE "_NavBarKeyCategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_NavBarKeyCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateTable
CREATE TABLE "_NavBarSubCategories" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,

    CONSTRAINT "_NavBarSubCategories_AB_pkey" PRIMARY KEY ("A","B")
);

-- CreateIndex
CREATE INDEX "_NavBarKeyCategories_B_index" ON "_NavBarKeyCategories"("B");

-- CreateIndex
CREATE INDEX "_NavBarSubCategories_B_index" ON "_NavBarSubCategories"("B");

-- AddForeignKey
ALTER TABLE "_NavBarKeyCategories" ADD CONSTRAINT "_NavBarKeyCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NavBarKeyCategories" ADD CONSTRAINT "_NavBarKeyCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "SiteConfiguration"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NavBarSubCategories" ADD CONSTRAINT "_NavBarSubCategories_A_fkey" FOREIGN KEY ("A") REFERENCES "Category"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_NavBarSubCategories" ADD CONSTRAINT "_NavBarSubCategories_B_fkey" FOREIGN KEY ("B") REFERENCES "SiteConfiguration"("id") ON DELETE CASCADE ON UPDATE CASCADE;
