/*
  Warnings:

  - You are about to drop the `ProjectIdeaVotes` table. If the table is not empty, all the data it contains will be lost.
  - Added the required column `updatedAt` to the `Gender` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `ProjectIdea` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TeamTechStackItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TeamTechStackItemVote` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TechStackCategory` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `TechStackItem` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Tier` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `User` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `Voyage` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `VoyageRole` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `VoyageStatus` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `VoyageTeam` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `VoyageTeamMember` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "ProjectIdeaVotes" DROP CONSTRAINT "ProjectIdeaVotes_projectIdeaId_fkey";

-- DropForeignKey
ALTER TABLE "ProjectIdeaVotes" DROP CONSTRAINT "ProjectIdeaVotes_userId_fkey";

-- AlterTable
ALTER TABLE "Gender" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "HealthCheck" ALTER COLUMN "updatedAt" DROP DEFAULT;

-- AlterTable
ALTER TABLE "ProjectIdea" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TeamTechStackItem" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TeamTechStackItemVote" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TechStackCategory" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "TechStackItem" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Tier" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "Voyage" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "VoyageRole" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "VoyageStatus" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "VoyageTeam" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- AlterTable
ALTER TABLE "VoyageTeamMember" ADD COLUMN     "updatedAt" TIMESTAMP(3) NOT NULL;

-- DropTable
DROP TABLE "ProjectIdeaVotes";

-- CreateTable
CREATE TABLE "Sprint" (
    "id" SERIAL NOT NULL,
    "voyageId" INTEGER NOT NULL,
    "number" INTEGER NOT NULL,
    "startDate" TIMESTAMPTZ NOT NULL,
    "endDate" TIMESTAMPTZ NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Sprint_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectIdeaVote" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "projectIdeaId" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectIdeaVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamResource" (
    "id" SERIAL NOT NULL,
    "teamMemberId" INTEGER,
    "url" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamResource_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FeatureCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FeatureCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectFeature" (
    "id" SERIAL NOT NULL,
    "teamMemberId" INTEGER,
    "featureCategoryId" INTEGER,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamMeeting" (
    "id" SERIAL NOT NULL,
    "sprintId" INTEGER NOT NULL,
    "voyageTeamId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "dateTime" TIMESTAMP(3),
    "meetingLink" TEXT,
    "notes" TEXT,
    "sprintReviewFormId" INTEGER,
    "sprintPlanningFormId" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamMeeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Agenda" (
    "id" SERIAL NOT NULL,
    "teamMeetingId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "status" BOOLEAN NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Agenda_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Form" (
    "id" SERIAL NOT NULL,
    "formTypeId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Form_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "InputType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "InputType_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Question" (
    "id" SERIAL NOT NULL,
    "formId" INTEGER NOT NULL,
    "order" INTEGER NOT NULL,
    "inputTypeId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "description" TEXT,
    "answerRequired" BOOLEAN NOT NULL,
    "multipleAllowed" BOOLEAN,
    "optionGroupId" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptionGroup" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OptionGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "OptionChoice" (
    "id" SERIAL NOT NULL,
    "optionGroupId" INTEGER NOT NULL,
    "text" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OptionChoice_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "QuestionOption" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "optionChoiceId" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "QuestionOption_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Response" (
    "id" SERIAL NOT NULL,
    "questionOptionId" INTEGER NOT NULL,
    "responseNumeric" INTEGER,
    "responseBoolean" BOOLEAN,
    "responseText" TEXT,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponseMeeting" (
    "id" SERIAL NOT NULL,
    "responseId" INTEGER NOT NULL,
    "meetingId" INTEGER NOT NULL,

    CONSTRAINT "ResponseMeeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponseUser" (
    "id" SERIAL NOT NULL,
    "responseId" INTEGER NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "ResponseUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponseVoyageTeam" (
    "id" SERIAL NOT NULL,
    "responseId" INTEGER NOT NULL,
    "voyageTeamId" INTEGER NOT NULL,

    CONSTRAINT "ResponseVoyageTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponseVoyageTeamMember" (
    "id" SERIAL NOT NULL,
    "responseId" INTEGER NOT NULL,
    "voyageTeamMemberId" INTEGER NOT NULL,

    CONSTRAINT "ResponseVoyageTeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Sprint_voyageId_number_key" ON "Sprint"("voyageId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureCategory_name_key" ON "FeatureCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Form_title_key" ON "Form"("title");

-- CreateIndex
CREATE UNIQUE INDEX "FormType_name_key" ON "FormType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "InputType_name_key" ON "InputType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "OptionGroup_name_key" ON "OptionGroup"("name");

-- AddForeignKey
ALTER TABLE "Sprint" ADD CONSTRAINT "Sprint_voyageId_fkey" FOREIGN KEY ("voyageId") REFERENCES "Voyage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectIdeaVote" ADD CONSTRAINT "ProjectIdeaVote_userId_fkey" FOREIGN KEY ("userId") REFERENCES "VoyageTeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectIdeaVote" ADD CONSTRAINT "ProjectIdeaVote_projectIdeaId_fkey" FOREIGN KEY ("projectIdeaId") REFERENCES "ProjectIdea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamResource" ADD CONSTRAINT "TeamResource_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "VoyageTeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFeature" ADD CONSTRAINT "ProjectFeature_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "VoyageTeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFeature" ADD CONSTRAINT "ProjectFeature_featureCategoryId_fkey" FOREIGN KEY ("featureCategoryId") REFERENCES "FeatureCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMeeting" ADD CONSTRAINT "TeamMeeting_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMeeting" ADD CONSTRAINT "TeamMeeting_voyageTeamId_fkey" FOREIGN KEY ("voyageTeamId") REFERENCES "VoyageTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMeeting" ADD CONSTRAINT "TeamMeeting_sprintReviewFormId_fkey" FOREIGN KEY ("sprintReviewFormId") REFERENCES "Form"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMeeting" ADD CONSTRAINT "TeamMeeting_sprintPlanningFormId_fkey" FOREIGN KEY ("sprintPlanningFormId") REFERENCES "Form"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_teamMeetingId_fkey" FOREIGN KEY ("teamMeetingId") REFERENCES "TeamMeeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_formTypeId_fkey" FOREIGN KEY ("formTypeId") REFERENCES "FormType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_inputTypeId_fkey" FOREIGN KEY ("inputTypeId") REFERENCES "InputType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_optionGroupId_fkey" FOREIGN KEY ("optionGroupId") REFERENCES "OptionGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionChoice" ADD CONSTRAINT "OptionChoice_optionGroupId_fkey" FOREIGN KEY ("optionGroupId") REFERENCES "OptionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionOption" ADD CONSTRAINT "QuestionOption_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "QuestionOption" ADD CONSTRAINT "QuestionOption_optionChoiceId_fkey" FOREIGN KEY ("optionChoiceId") REFERENCES "OptionChoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_questionOptionId_fkey" FOREIGN KEY ("questionOptionId") REFERENCES "QuestionOption"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseMeeting" ADD CONSTRAINT "ResponseMeeting_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseMeeting" ADD CONSTRAINT "ResponseMeeting_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "TeamMeeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseUser" ADD CONSTRAINT "ResponseUser_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseUser" ADD CONSTRAINT "ResponseUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseVoyageTeam" ADD CONSTRAINT "ResponseVoyageTeam_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseVoyageTeam" ADD CONSTRAINT "ResponseVoyageTeam_voyageTeamId_fkey" FOREIGN KEY ("voyageTeamId") REFERENCES "VoyageTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseVoyageTeamMember" ADD CONSTRAINT "ResponseVoyageTeamMember_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResponseVoyageTeamMember" ADD CONSTRAINT "ResponseVoyageTeamMember_voyageTeamMemberId_fkey" FOREIGN KEY ("voyageTeamMemberId") REFERENCES "VoyageTeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
