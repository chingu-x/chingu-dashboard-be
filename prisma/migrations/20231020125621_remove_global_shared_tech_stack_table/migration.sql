/*
  Warnings:

  - You are about to drop the column `techId` on the `TeamTechStackItem` table. All the data in the column will be lost.
  - You are about to drop the `TechStackItem` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[name,voyageTeamId,categoryId]` on the table `TeamTechStackItem` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `name` to the `TeamTechStackItem` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "TeamTechStackItem" DROP CONSTRAINT "TeamTechStackItem_techId_fkey";

-- DropForeignKey
ALTER TABLE "TechStackItem" DROP CONSTRAINT "TechStackItem_categoryId_fkey";

-- DropIndex
DROP INDEX "TeamTechStackItem_voyageTeamId_techId_key";

-- AlterTable
ALTER TABLE "TeamTechStackItem" DROP COLUMN "techId",
ADD COLUMN     "categoryId" INTEGER,
ADD COLUMN     "name" TEXT NOT NULL;

-- DropTable
DROP TABLE "TechStackItem";

-- CreateIndex
CREATE UNIQUE INDEX "TeamTechStackItem_name_voyageTeamId_categoryId_key" ON "TeamTechStackItem"("name", "voyageTeamId", "categoryId");

-- AddForeignKey
ALTER TABLE "TeamTechStackItem" ADD CONSTRAINT "TeamTechStackItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TechStackCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;
