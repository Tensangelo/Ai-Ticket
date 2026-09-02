/*
  Warnings:

  - You are about to drop the column `category` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `priority` on the `Ticket` table. All the data in the column will be lost.
  - You are about to drop the column `requestText` on the `Ticket` table. All the data in the column will be lost.
  - Added the required column `categoryId` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `description` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `priorityId` to the `Ticket` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Ticket` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "ClassificationStatus" AS ENUM ('PENDING', 'SUCCESS', 'FAILED');

-- AlterTable
ALTER TABLE "Ticket" DROP COLUMN "category",
DROP COLUMN "priority",
DROP COLUMN "requestText",
ADD COLUMN     "categoryId" INTEGER NOT NULL,
ADD COLUMN     "classificationError" TEXT,
ADD COLUMN     "classificationStatus" "ClassificationStatus" NOT NULL DEFAULT 'PENDING',
ADD COLUMN     "description" TEXT NOT NULL,
ADD COLUMN     "priorityId" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL,
ALTER COLUMN "summary" DROP NOT NULL;

-- DropEnum
DROP TYPE "Category";

-- DropEnum
DROP TYPE "Priority";

-- CreateTable
CREATE TABLE "Category" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Category_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Priority" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "active" BOOLEAN NOT NULL DEFAULT true,

    CONSTRAINT "Priority_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Category_name_key" ON "Category"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Priority_name_key" ON "Priority"("name");

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "Category"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Ticket" ADD CONSTRAINT "Ticket_priorityId_fkey" FOREIGN KEY ("priorityId") REFERENCES "Priority"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
