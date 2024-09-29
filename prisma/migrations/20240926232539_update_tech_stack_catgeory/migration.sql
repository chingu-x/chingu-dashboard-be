-- DropIndex
DROP INDEX "TechStackCategory_name_key";

-- AlterTable
ALTER TABLE "TechStackCategory" ADD COLUMN     "voyageTeamId" INTEGER;

-- AddForeignKey
ALTER TABLE "TechStackCategory" ADD CONSTRAINT "TechStackCategory_voyageTeamId_fkey" FOREIGN KEY ("voyageTeamId") REFERENCES "VoyageTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
