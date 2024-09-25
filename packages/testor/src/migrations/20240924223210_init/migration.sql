-- CreateEnum
CREATE TYPE "LedgerType" AS ENUM ('MAIN', 'CC');

-- CreateEnum
CREATE TYPE "PayloadKind" AS ENUM ('SMART', 'IMPULSE');

-- CreateEnum
CREATE TYPE "BookNamespace" AS ENUM ('BU1', 'BU2');

-- CreateTable
CREATE TABLE "Ledger" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "type" "LedgerType" NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Ledger_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Book" (
    "id" TEXT NOT NULL,
    "namespace" "BookNamespace" NOT NULL,
    "section" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "root" BOOLEAN,
    "description" TEXT,

    CONSTRAINT "Book_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Entry" (
    "id" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "deletedAt" TIMESTAMP(3),
    "namespace" "BookNamespace" NOT NULL,
    "section" TEXT NOT NULL,
    "ledgerId" TEXT NOT NULL,

    CONSTRAINT "Entry_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Log" (
    "section" TEXT NOT NULL,
    "subSection" TEXT NOT NULL,
    "msg1" TEXT DEFAULT 'msg1',
    "msg2" TEXT NOT NULL DEFAULT 'msg2',
    "entryId" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "Label" (
    "name" TEXT NOT NULL,
    "group" TEXT NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "Book_namespace_section_key" ON "Book"("namespace", "section");

-- CreateIndex
CREATE UNIQUE INDEX "Book_section_label_key" ON "Book"("section", "label");

-- CreateIndex
CREATE UNIQUE INDEX "Log_section_subSection_key" ON "Log"("section", "subSection");

-- CreateIndex
CREATE UNIQUE INDEX "Label_name_key" ON "Label"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Label_group_key" ON "Label"("group");

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_namespace_section_fkey" FOREIGN KEY ("namespace", "section") REFERENCES "Book"("namespace", "section") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Entry" ADD CONSTRAINT "Entry_ledgerId_fkey" FOREIGN KEY ("ledgerId") REFERENCES "Ledger"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Log" ADD CONSTRAINT "Log_entryId_fkey" FOREIGN KEY ("entryId") REFERENCES "Entry"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
