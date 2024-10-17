/*
  Warnings:

  - A unique constraint covering the columns `[name,voyageTeamId]` on the table `TechStackCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "TechStackCategory" ALTER COLUMN "name" SET DATA TYPE CITEXT;

-- CreateIndex
CREATE UNIQUE INDEX "TechStackCategory_name_voyageTeamId_key" ON "TechStackCategory"("name", "voyageTeamId");
