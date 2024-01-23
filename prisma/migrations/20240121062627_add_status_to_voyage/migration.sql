-- AlterTable
ALTER TABLE "Voyage" ADD COLUMN     "statusId" INTEGER;

-- AddForeignKey
ALTER TABLE "Voyage" ADD CONSTRAINT "Voyage_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "VoyageStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;
