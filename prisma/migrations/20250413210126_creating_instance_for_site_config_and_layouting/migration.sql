-- CreateTable
CREATE TABLE "HomePageSection" (
    "id" SERIAL NOT NULL,
    "heroTopLeftId" INTEGER,
    "heroCenterId" INTEGER,
    "heroRightId" INTEGER,
    "siteConfigurationId" INTEGER,

    CONSTRAINT "HomePageSection_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SiteConfiguration" (
    "id" SERIAL NOT NULL,
    "navBarKeyCategories" TEXT[],
    "navBarSubCategories" TEXT[],

    CONSTRAINT "SiteConfiguration_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "HomePageSection_siteConfigurationId_key" ON "HomePageSection"("siteConfigurationId");

-- CreateIndex
CREATE INDEX "HomePageSection_siteConfigurationId_idx" ON "HomePageSection"("siteConfigurationId");

-- CreateIndex
CREATE INDEX "HomePageSection_heroTopLeftId_idx" ON "HomePageSection"("heroTopLeftId");

-- CreateIndex
CREATE INDEX "HomePageSection_heroCenterId_idx" ON "HomePageSection"("heroCenterId");

-- CreateIndex
CREATE INDEX "HomePageSection_heroRightId_idx" ON "HomePageSection"("heroRightId");

-- AddForeignKey
ALTER TABLE "HomePageSection" ADD CONSTRAINT "HomePageSection_heroTopLeftId_fkey" FOREIGN KEY ("heroTopLeftId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomePageSection" ADD CONSTRAINT "HomePageSection_heroCenterId_fkey" FOREIGN KEY ("heroCenterId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomePageSection" ADD CONSTRAINT "HomePageSection_heroRightId_fkey" FOREIGN KEY ("heroRightId") REFERENCES "Category"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "HomePageSection" ADD CONSTRAINT "HomePageSection_siteConfigurationId_fkey" FOREIGN KEY ("siteConfigurationId") REFERENCES "SiteConfiguration"("id") ON DELETE SET NULL ON UPDATE CASCADE;
