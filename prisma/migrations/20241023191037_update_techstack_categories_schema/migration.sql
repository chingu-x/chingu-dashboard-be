/*
  Warnings:

  - A unique constraint covering the columns `[name,voyageTeamId]` on the table `TechStackCategory` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "TechStackCategory_name_key";

-- AlterTable
ALTER TABLE "TechStackCategory" ADD COLUMN     "voyageTeamId" INTEGER,
ALTER COLUMN "name" SET DATA TYPE CITEXT;

-- CreateIndex
CREATE UNIQUE INDEX "TechStackCategory_name_voyageTeamId_key" ON "TechStackCategory"("name", "voyageTeamId");

-- AddForeignKey
ALTER TABLE "TechStackCategory" ADD CONSTRAINT "TechStackCategory_voyageTeamId_fkey" FOREIGN KEY ("voyageTeamId") REFERENCES "VoyageTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
