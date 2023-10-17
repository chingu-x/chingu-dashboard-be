/*
  Warnings:

  - You are about to drop the `ProjectIdeaVotes` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProjectIdeaVotes" DROP CONSTRAINT "ProjectIdeaVotes_projectIdeaId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectIdeaVotes" DROP CONSTRAINT "ProjectIdeaVotes_userId_fkey";

-- AlterTable
ALTER TABLE "ProjectIdea" ADD COLUMN     "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- DropTable
DROP TABLE "ProjectIdeaVotes";

-- CreateTable
CREATE TABLE "ProjectIdeaVote" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "projectIdeaId" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectIdeaVote_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProjectIdeaVote" ADD CONSTRAINT "ProjectIdeaVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "VoyageTeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectIdeaVote" ADD CONSTRAINT "ProjectIdeaVote_projectIdeaId_fkey" FOREIGN KEY ("projectIdeaId") REFERENCES "ProjectIdea"("id") ON DELETE CASCADE ON UPDATE CASCADE;
