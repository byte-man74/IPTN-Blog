-- CreateTable
CREATE TABLE "MixpanelIdentification" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "MixpanelIdentification_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "MixpanelIdentification_userId_idx" ON "MixpanelIdentification"("userId");

-- AddForeignKey
ALTER TABLE "MixpanelIdentification" ADD CONSTRAINT "MixpanelIdentification_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
