/*
  Warnings:

  - You are about to drop the column `voteCount` on the `ProjectIdea` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "ProjectIdea" DROP COLUMN "voteCount";

-- CreateTable
CREATE TABLE "ProjectIdeaVotes" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "projectIdeaId" INTEGER,

    CONSTRAINT "ProjectIdeaVotes_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectIdeaVotes" ADD CONSTRAINT "ProjectIdeaVotes_userId_fkey" FOREIGN KEY ("userId") REFERENCES "VoyageTeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectIdeaVotes" ADD CONSTRAINT "ProjectIdeaVotes_projectIdeaId_fkey" FOREIGN KEY ("projectIdeaId") REFERENCES "ProjectIdea"("id") ON DELETE SET NULL ON UPDATE CASCADE;
