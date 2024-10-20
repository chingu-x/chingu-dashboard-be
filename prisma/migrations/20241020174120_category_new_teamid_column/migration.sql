-- AlterTable
ALTER TABLE "TechStackCategory" ADD COLUMN     "voyageTeamIdNew" INTEGER;

-- AddForeignKey
ALTER TABLE "TechStackCategory" ADD CONSTRAINT "TechStackCategory_voyageTeamIdNew_fkey" FOREIGN KEY ("voyageTeamIdNew") REFERENCES "VoyageTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;
