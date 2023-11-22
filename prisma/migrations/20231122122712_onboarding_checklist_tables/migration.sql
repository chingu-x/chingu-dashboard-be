/*
  Warnings:

  - You are about to drop the column `formResponseMeetingId` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the `FormResponseUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FormResponseVoyageTeam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `FormResponseVoyageTeamMember` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[responseGroupId]` on the table `FormResponseMeeting` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[questionId,responseGroupId]` on the table `Response` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `updatedAt` to the `FormResponseMeeting` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Response` table without a default value. This is not possible if the table is not empty.
  - Added the required column `certificateIssueDate` to the `Voyage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `soloProjectDeadline` to the `Voyage` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "FormResponseUser" DROP CONSTRAINT "FormResponseUser_responseId_fkey";

-- DropForeignKey
ALTER TABLE "FormResponseUser" DROP CONSTRAINT "FormResponseUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "FormResponseVoyageTeam" DROP CONSTRAINT "FormResponseVoyageTeam_responseId_fkey";

-- DropForeignKey
ALTER TABLE "FormResponseVoyageTeam" DROP CONSTRAINT "FormResponseVoyageTeam_voyageTeamId_fkey";

-- DropForeignKey
ALTER TABLE "FormResponseVoyageTeamMember" DROP CONSTRAINT "FormResponseVoyageTeamMember_responseId_fkey";

-- DropForeignKey
ALTER TABLE "FormResponseVoyageTeamMember" DROP CONSTRAINT "FormResponseVoyageTeamMember_voyageTeamMemberId_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_formResponseMeetingId_fkey";

-- DropIndex
DROP INDEX "Response_questionId_formResponseMeetingId_key";

-- AlterTable
ALTER TABLE "FormResponseMeeting" ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "responseGroupId" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Response" DROP COLUMN "formResponseMeetingId",
ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "responseGroupId" INTEGER,
ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Voyage" ADD COLUMN     "certificateIssueDate" TIMESTAMPTZ NOT NULL,
ADD COLUMN     "showcasePublisheDate" TIMESTAMPTZ,
ADD COLUMN     "soloProjectDeadline" TIMESTAMPTZ NOT NULL;

-- DropTable
DROP TABLE "FormResponseUser";

-- DropTable
DROP TABLE "FormResponseVoyageTeam";

-- DropTable
DROP TABLE "FormResponseVoyageTeamMember";

-- CreateTable
CREATE TABLE "ChecklistItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ChecklistItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserChecklistStatus" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "checklistItemId" INTEGER NOT NULL,
    "status" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserChecklistStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoloProjectStatus" (
    "id" SERIAL NOT NULL,
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SoloProjectStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "SoloProject" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "evaluatorUserId" UUID,
    "evaluatorFeedback" TEXT,
    "adminComments" TEXT,
    "statusId" INTEGER,
    "formId" INTEGER,
    "responseGroupId" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "SoloProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoyageApplication" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "voyageId" INTEGER NOT NULL,
    "formId" INTEGER,
    "responseGroupId" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VoyageApplication_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponseGroup" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResponseGroup_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ChecklistItem_name_key" ON "ChecklistItem"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserChecklistStatus_userId_checklistItemId_key" ON "UserChecklistStatus"("userId", "checklistItemId");

-- CreateIndex
CREATE UNIQUE INDEX "SoloProjectStatus_status_key" ON "SoloProjectStatus"("status");

-- CreateIndex
CREATE UNIQUE INDEX "SoloProject_responseGroupId_key" ON "SoloProject"("responseGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "VoyageApplication_responseGroupId_key" ON "VoyageApplication"("responseGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "FormResponseMeeting_responseGroupId_key" ON "FormResponseMeeting"("responseGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "Response_questionId_responseGroupId_key" ON "Response"("questionId", "responseGroupId");

-- AddForeignKey
ALTER TABLE "UserChecklistStatus" ADD CONSTRAINT "UserChecklistStatus_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserChecklistStatus" ADD CONSTRAINT "UserChecklistStatus_checklistItemId_fkey" FOREIGN KEY ("checklistItemId") REFERENCES "ChecklistItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoloProject" ADD CONSTRAINT "SoloProject_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoloProject" ADD CONSTRAINT "SoloProject_evaluatorUserId_fkey" FOREIGN KEY ("evaluatorUserId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoloProject" ADD CONSTRAINT "SoloProject_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "SoloProjectStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoloProject" ADD CONSTRAINT "SoloProject_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "SoloProject" ADD CONSTRAINT "SoloProject_responseGroupId_fkey" FOREIGN KEY ("responseGroupId") REFERENCES "ResponseGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoyageApplication" ADD CONSTRAINT "VoyageApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoyageApplication" ADD CONSTRAINT "VoyageApplication_voyageId_fkey" FOREIGN KEY ("voyageId") REFERENCES "Voyage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoyageApplication" ADD CONSTRAINT "VoyageApplication_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoyageApplication" ADD CONSTRAINT "VoyageApplication_responseGroupId_fkey" FOREIGN KEY ("responseGroupId") REFERENCES "ResponseGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_responseGroupId_fkey" FOREIGN KEY ("responseGroupId") REFERENCES "ResponseGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponseMeeting" ADD CONSTRAINT "FormResponseMeeting_responseGroupId_fkey" FOREIGN KEY ("responseGroupId") REFERENCES "ResponseGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
