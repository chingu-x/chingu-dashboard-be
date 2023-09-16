/*
  Warnings:

  - You are about to drop the column `voyageTeamId` on the `ProjectIdea` table. All the data in the column will be lost.

*/
-- DropForeignKey
ALTER TABLE "ProjectIdea" DROP CONSTRAINT "ProjectIdea_voyageTeamId_fkey";

-- AlterTable
ALTER TABLE "ProjectIdea" DROP COLUMN "voyageTeamId";
