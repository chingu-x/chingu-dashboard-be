/*
  Warnings:

  - The `userId` column on the `ProjectIdea` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `teamMemberId` column on the `TeamTechStackItemVote` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `VoyageTeamMember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `VoyageTeamMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- DropForeignKey
ALTER TABLE "ProjectIdea" DROP CONSTRAINT "ProjectIdea_userId_fkey";

-- DropForeignKey
ALTER TABLE "TeamTechStackItemVote" DROP CONSTRAINT "TeamTechStackItemVote_teamMemberId_fkey";

-- DropForeignKey
ALTER TABLE "VoyageTeam" DROP CONSTRAINT "VoyageTeam_voyageId_fkey";

-- AlterTable
ALTER TABLE "ProjectIdea" DROP COLUMN "userId",
ADD COLUMN     "userId" INTEGER;

-- AlterTable
ALTER TABLE "TeamTechStackItemVote" DROP COLUMN "teamMemberId",
ADD COLUMN     "teamMemberId" INTEGER;

-- AlterTable
ALTER TABLE "VoyageTeamMember" DROP CONSTRAINT "VoyageTeamMember_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "VoyageTeamMember_pkey" PRIMARY KEY ("id");

-- AddForeignKey
ALTER TABLE "VoyageTeam" ADD CONSTRAINT "VoyageTeam_voyageId_fkey" FOREIGN KEY ("voyageId") REFERENCES "Voyage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectIdea" ADD CONSTRAINT "ProjectIdea_userId_fkey" FOREIGN KEY ("userId") REFERENCES "VoyageTeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamTechStackItemVote" ADD CONSTRAINT "TeamTechStackItemVote_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "VoyageTeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
