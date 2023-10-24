/*
  Warnings:

  - You are about to drop the column `userId` on the `ProjectIdea` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProjectIdea" DROP CONSTRAINT "ProjectIdea_userId_fkey";

-- AlterTable
ALTER TABLE "ProjectIdea" DROP COLUMN "userId",
ADD COLUMN     "voyageTeamMemberId" INTEGER;

-- AddForeignKey
ALTER TABLE "ProjectIdea" ADD CONSTRAINT "ProjectIdea_voyageTeamMemberId_fkey" FOREIGN KEY ("voyageTeamMemberId") REFERENCES "VoyageTeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
