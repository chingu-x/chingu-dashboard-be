/*
  Warnings:

  - You are about to drop the column `userId` on the `ProjectIdea` table. All the data in the column will be lost.
  - You are about to drop the column `userId` on the `ProjectIdeaVote` table. All the data in the column will be lost.
  - Made the column `projectIdeaId` on table `ProjectIdeaVote` required. This step will fail if there are existing NULL values in that column.

*/
-- DropForeignKey
ALTER TABLE "ProjectIdea" DROP CONSTRAINT "ProjectIdea_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectIdeaVote" DROP CONSTRAINT "ProjectIdeaVote_userId_fkey";

-- AlterTable
ALTER TABLE "ProjectIdea" DROP COLUMN "userId",
ADD COLUMN     "voyageTeamMemberId" INTEGER;

-- AlterTable
ALTER TABLE "ProjectIdeaVote" DROP COLUMN "userId",
ADD COLUMN     "voyageTeamMemberId" INTEGER,
ALTER COLUMN "projectIdeaId" SET NOT NULL;

-- AddForeignKey
ALTER TABLE "ProjectIdea" ADD CONSTRAINT "ProjectIdea_voyageTeamMemberId_fkey" FOREIGN KEY ("voyageTeamMemberId") REFERENCES "VoyageTeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectIdeaVote" ADD CONSTRAINT "ProjectIdeaVote_voyageTeamMemberId_fkey" FOREIGN KEY ("voyageTeamMemberId") REFERENCES "VoyageTeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
