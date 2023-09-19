/*
  Warnings:

  - The primary key for the `Gender` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Gender` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `ProjectIdea` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `ProjectIdea` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `TeamTechStackItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `TeamTechStackItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `TeamTechStackItemVote` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `TeamTechStackItemVote` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `TechStackCategory` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `TechStackCategory` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `TechStackItem` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `TechStackItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `categoryId` column on the `TechStackItem` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Tier` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Tier` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `User` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `timeZone` on the `User` table. All the data in the column will be lost.
  - The `genderId` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `Voyage` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `Voyage` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `VoyageRole` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `VoyageRole` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `VoyageStatus` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `VoyageStatus` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The primary key for the `VoyageTeam` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - The `id` column on the `VoyageTeam` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `voyageId` column on the `VoyageTeam` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `statusId` column on the `VoyageTeam` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `tierId` column on the `VoyageTeam` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `voyageRoleId` column on the `VoyageTeamMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - The `statusId` column on the `VoyageTeamMember` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Changed the type of `techId` on the `TeamTechStackItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `voyageTeamId` on the `TeamTechStackItem` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `teamTechId` on the `TeamTechStackItemVote` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Added the required column `timezone` to the `User` table without a default value. This is not possible if the table is not empty.
  - Changed the type of `id` on the `User` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `userId` on the `VoyageTeamMember` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.
  - Changed the type of `voyageTeamId` on the `VoyageTeamMember` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- DropForeignKey
ALTER TABLE "TeamTechStackItem" DROP CONSTRAINT "TeamTechStackItem_techId_fkey";

-- DropForeignKey
ALTER TABLE "TeamTechStackItem" DROP CONSTRAINT "TeamTechStackItem_voyageTeamId_fkey";

-- DropForeignKey
ALTER TABLE "TeamTechStackItemVote" DROP CONSTRAINT "TeamTechStackItemVote_teamTechId_fkey";

-- DropForeignKey
ALTER TABLE "TechStackItem" DROP CONSTRAINT "TechStackItem_categoryId_fkey";

-- DropForeignKey
ALTER TABLE "User" DROP CONSTRAINT "User_genderId_fkey";

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
ALTER TABLE "Gender" DROP CONSTRAINT "Gender_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Gender_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "ProjectIdea" DROP CONSTRAINT "ProjectIdea_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "ProjectIdea_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TeamTechStackItem" DROP CONSTRAINT "TeamTechStackItem_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "techId",
ADD COLUMN     "techId" INTEGER NOT NULL,
DROP COLUMN "voyageTeamId",
ADD COLUMN     "voyageTeamId" INTEGER NOT NULL,
ADD CONSTRAINT "TeamTechStackItem_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TeamTechStackItemVote" DROP CONSTRAINT "TeamTechStackItemVote_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "teamTechId",
ADD COLUMN     "teamTechId" INTEGER NOT NULL,
ADD CONSTRAINT "TeamTechStackItemVote_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TechStackCategory" DROP CONSTRAINT "TechStackCategory_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "TechStackCategory_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "TechStackItem" DROP CONSTRAINT "TechStackItem_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "categoryId",
ADD COLUMN     "categoryId" INTEGER,
ADD CONSTRAINT "TechStackItem_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Tier" DROP CONSTRAINT "Tier_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Tier_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "User" DROP CONSTRAINT "User_pkey",
DROP COLUMN "timeZone",
ADD COLUMN     "timezone" TEXT NOT NULL,
DROP COLUMN "id",
ADD COLUMN     "id" UUID NOT NULL,
DROP COLUMN "genderId",
ADD COLUMN     "genderId" INTEGER,
ADD CONSTRAINT "User_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "Voyage" DROP CONSTRAINT "Voyage_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Voyage_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "VoyageRole" DROP CONSTRAINT "VoyageRole_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "VoyageRole_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "VoyageStatus" DROP CONSTRAINT "VoyageStatus_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "VoyageStatus_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "VoyageTeam" DROP CONSTRAINT "VoyageTeam_pkey",
DROP COLUMN "id",
ADD COLUMN     "id" SERIAL NOT NULL,
DROP COLUMN "voyageId",
ADD COLUMN     "voyageId" INTEGER,
DROP COLUMN "statusId",
ADD COLUMN     "statusId" INTEGER,
DROP COLUMN "tierId",
ADD COLUMN     "tierId" INTEGER,
ADD CONSTRAINT "VoyageTeam_pkey" PRIMARY KEY ("id");

-- AlterTable
ALTER TABLE "VoyageTeamMember" DROP COLUMN "userId",
ADD COLUMN     "userId" UUID NOT NULL,
DROP COLUMN "voyageTeamId",
ADD COLUMN     "voyageTeamId" INTEGER NOT NULL,
DROP COLUMN "voyageRoleId",
ADD COLUMN     "voyageRoleId" INTEGER,
DROP COLUMN "statusId",
ADD COLUMN     "statusId" INTEGER;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Gender"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoyageTeam" ADD CONSTRAINT "VoyageTeam_voyageId_fkey" FOREIGN KEY ("voyageId") REFERENCES "Voyage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "TechStackItem" ADD CONSTRAINT "TechStackItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TechStackCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamTechStackItem" ADD CONSTRAINT "TeamTechStackItem_techId_fkey" FOREIGN KEY ("techId") REFERENCES "TechStackItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamTechStackItem" ADD CONSTRAINT "TeamTechStackItem_voyageTeamId_fkey" FOREIGN KEY ("voyageTeamId") REFERENCES "VoyageTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamTechStackItemVote" ADD CONSTRAINT "TeamTechStackItemVote_teamTechId_fkey" FOREIGN KEY ("teamTechId") REFERENCES "TeamTechStackItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;
