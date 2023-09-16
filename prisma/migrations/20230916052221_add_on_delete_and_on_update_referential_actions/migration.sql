/*
  Warnings:

  - The primary key for the `VoyageTeamMember` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The required column `id` was added to the `VoyageTeamMember` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- DropForeignKey
ALTER TABLE "ProjectIdea" DROP CONSTRAINT "ProjectIdea_userId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectIdea" DROP CONSTRAINT "ProjectIdea_voyageTeamId_fkey";

-- DropForeignKey
ALTER TABLE "VoyageTeam" DROP CONSTRAINT "VoyageTeam_statusId_fkey";

-- DropForeignKey
ALTER TABLE "VoyageTeam" DROP CONSTRAINT "VoyageTeam_tierId_fkey";

-- DropForeignKey
ALTER TABLE "VoyageTeam" DROP CONSTRAINT "VoyageTeam_voyageId_fkey";

-- DropForeignKey
ALTER TABLE "VoyageTeamMember" DROP CONSTRAINT "VoyageTeamMember_statusId_fkey";

-- DropForeignKey
ALTER TABLE "VoyageTeamMember" DROP CONSTRAINT "VoyageTeamMember_userId_fkey";

-- DropForeignKey
ALTER TABLE "VoyageTeamMember" DROP CONSTRAINT "VoyageTeamMember_voyageRoleId_fkey";

-- DropForeignKey
ALTER TABLE "VoyageTeamMember" DROP CONSTRAINT "VoyageTeamMember_voyageTeamId_fkey";

-- AlterTable
ALTER TABLE "ProjectIdea" ALTER COLUMN "userId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "VoyageTeam" ALTER COLUMN "voyageId" DROP NOT NULL,
ALTER COLUMN "statusId" DROP NOT NULL,
ALTER COLUMN "tierId" DROP NOT NULL;

-- AlterTable
ALTER TABLE "VoyageTeamMember" DROP CONSTRAINT "VoyageTeamMember_pkey",
ADD COLUMN     "id" TEXT NOT NULL,
ALTER COLUMN "voyageRoleId" DROP NOT NULL,
ALTER COLUMN "statusId" DROP NOT NULL,
ADD CONSTRAINT "VoyageTeamMember_pkey" PRIMARY KEY ("id");

-- CreateTable
CREATE TABLE "TechStackCategory" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TechStackCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechStackItem" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TechStackItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamTechStackItem" (
    "id" TEXT NOT NULL,
    "techId" TEXT NOT NULL,
    "voyageTeamId" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamTechStackItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamTechStackItemVote" (
    "id" TEXT NOT NULL,
    "teamTechId" TEXT NOT NULL,
    "teamMemberId" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamTechStackItemVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "TechStackCategory_name_key" ON "TechStackCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TechStackItem_name_key" ON "TechStackItem"("name");

-- AddForeignKey
ALTER TABLE "VoyageTeam" ADD CONSTRAINT "VoyageTeam_voyageId_fkey" FOREIGN KEY ("voyageId") REFERENCES "Voyage"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoyageTeam" ADD CONSTRAINT "VoyageTeam_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "VoyageStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoyageTeam" ADD CONSTRAINT "VoyageTeam_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "Tier"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoyageTeamMember" ADD CONSTRAINT "VoyageTeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoyageTeamMember" ADD CONSTRAINT "VoyageTeamMember_voyageTeamId_fkey" FOREIGN KEY ("voyageTeamId") REFERENCES "VoyageTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoyageTeamMember" ADD CONSTRAINT "VoyageTeamMember_voyageRoleId_fkey" FOREIGN KEY ("voyageRoleId") REFERENCES "VoyageRole"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoyageTeamMember" ADD CONSTRAINT "VoyageTeamMember_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "VoyageStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectIdea" ADD CONSTRAINT "ProjectIdea_userId_fkey" FOREIGN KEY ("userId") REFERENCES "VoyageTeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectIdea" ADD CONSTRAINT "ProjectIdea_voyageTeamId_fkey" FOREIGN KEY ("voyageTeamId") REFERENCES "VoyageTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TechStackItem" ADD CONSTRAINT "TechStackItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TechStackCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamTechStackItem" ADD CONSTRAINT "TeamTechStackItem_techId_fkey" FOREIGN KEY ("techId") REFERENCES "TechStackItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamTechStackItem" ADD CONSTRAINT "TeamTechStackItem_voyageTeamId_fkey" FOREIGN KEY ("voyageTeamId") REFERENCES "VoyageTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamTechStackItemVote" ADD CONSTRAINT "TeamTechStackItemVote_teamTechId_fkey" FOREIGN KEY ("teamTechId") REFERENCES "TeamTechStackItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamTechStackItemVote" ADD CONSTRAINT "TeamTechStackItemVote_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "VoyageTeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
