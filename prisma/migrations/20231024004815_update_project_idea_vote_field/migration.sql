/*
  Warnings:

  - You are about to drop the column `userId` on the `ProjectIdeaVote` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProjectIdeaVote" DROP CONSTRAINT "ProjectIdeaVote_userId_fkey";

-- AlterTable
ALTER TABLE "ProjectIdeaVote" DROP COLUMN "userId",
ADD COLUMN     "voyageTeamMemberId" INTEGER;

-- AddForeignKey
ALTER TABLE "ProjectIdeaVote" ADD CONSTRAINT "ProjectIdeaVote_voyageTeamMemberId_fkey" FOREIGN KEY ("voyageTeamMemberId") REFERENCES "VoyageTeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
