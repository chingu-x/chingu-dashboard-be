/*
  Warnings:

  - You are about to drop the column `showcasePublisheDate` on the `Voyage` table. All the data in the column will be lost.
  - You are about to alter the column `hrPerSprint` on the `VoyageTeamMember` table. The data in that column could be lost. The data in that column will be cast from `DoublePrecision` to `Integer`.

*/
-- AlterTable
ALTER TABLE "Voyage" DROP COLUMN "showcasePublisheDate",
ADD COLUMN     "showcasePublishDate" TIMESTAMPTZ;

-- AlterTable
ALTER TABLE "VoyageTeamMember" ALTER COLUMN "hrPerSprint" SET DATA TYPE INTEGER;
