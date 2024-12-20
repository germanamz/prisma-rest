-- AlterTable
ALTER TABLE "Book" ADD COLUMN     "parentNamespace" "BookNamespace";

-- AlterTable
ALTER TABLE "Ledger" ADD COLUMN     "allowedTypes" "LedgerType"[],
ADD COLUMN     "description" TEXT,
ADD COLUMN     "tags" TEXT[];

-- CreateTable
CREATE TABLE "Asset" (
    "url" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Asset_url_key" ON "Asset"("url");
