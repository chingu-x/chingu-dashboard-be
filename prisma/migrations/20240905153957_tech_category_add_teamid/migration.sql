/*
  Warnings:

  - Added the required column `voyageTeamId` to the `TechStackCategory` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "TechStackCategory" ADD COLUMN     "voyageTeamId" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "TechStackCategory" ADD CONSTRAINT "TechStackCategory_voyageTeamId_fkey" FOREIGN KEY ("voyageTeamId") REFERENCES "VoyageTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
