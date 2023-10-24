/*
  Warnings:

  - Made the column `projectIdeaId` on table `ProjectIdeaVote` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE "ProjectIdeaVote" ALTER COLUMN "projectIdeaId" SET NOT NULL;
