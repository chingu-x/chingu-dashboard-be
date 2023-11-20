/*
  Warnings:

  - You are about to drop the column `questionOptionId` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `responseBoolean` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `responseNumeric` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `responseText` on the `Response` table. All the data in the column will be lost.
  - You are about to drop the column `sprintPlanningFormId` on the `TeamMeeting` table. All the data in the column will be lost.
  - You are about to drop the column `sprintReviewFormId` on the `TeamMeeting` table. All the data in the column will be lost.
  - You are about to drop the `QuestionOption` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResponseMeeting` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResponseUser` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResponseVoyageTeam` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `ResponseVoyageTeamMember` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[questionId,formResponseMeetingId]` on the table `Response` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `questionId` to the `Response` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "QuestionOption" DROP CONSTRAINT "QuestionOption_optionChoiceId_fkey";

-- DropForeignKey
ALTER TABLE "QuestionOption" DROP CONSTRAINT "QuestionOption_questionId_fkey";

-- DropForeignKey
ALTER TABLE "Response" DROP CONSTRAINT "Response_questionOptionId_fkey";

-- DropForeignKey
ALTER TABLE "ResponseMeeting" DROP CONSTRAINT "ResponseMeeting_meetingId_fkey";

-- DropForeignKey
ALTER TABLE "ResponseMeeting" DROP CONSTRAINT "ResponseMeeting_responseId_fkey";

-- DropForeignKey
ALTER TABLE "ResponseUser" DROP CONSTRAINT "ResponseUser_responseId_fkey";

-- DropForeignKey
ALTER TABLE "ResponseUser" DROP CONSTRAINT "ResponseUser_userId_fkey";

-- DropForeignKey
ALTER TABLE "ResponseVoyageTeam" DROP CONSTRAINT "ResponseVoyageTeam_responseId_fkey";

-- DropForeignKey
ALTER TABLE "ResponseVoyageTeam" DROP CONSTRAINT "ResponseVoyageTeam_voyageTeamId_fkey";

-- DropForeignKey
ALTER TABLE "ResponseVoyageTeamMember" DROP CONSTRAINT "ResponseVoyageTeamMember_responseId_fkey";

-- DropForeignKey
ALTER TABLE "ResponseVoyageTeamMember" DROP CONSTRAINT "ResponseVoyageTeamMember_voyageTeamMemberId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMeeting" DROP CONSTRAINT "TeamMeeting_sprintPlanningFormId_fkey";

-- DropForeignKey
ALTER TABLE "TeamMeeting" DROP CONSTRAINT "TeamMeeting_sprintReviewFormId_fkey";

-- AlterTable
ALTER TABLE "Response" DROP COLUMN "questionOptionId",
DROP COLUMN "responseBoolean",
DROP COLUMN "responseNumeric",
DROP COLUMN "responseText",
ADD COLUMN     "boolean" BOOLEAN,
ADD COLUMN     "formResponseMeetingId" INTEGER,
ADD COLUMN     "numeric" INTEGER,
ADD COLUMN     "optionChoiceId" INTEGER,
ADD COLUMN     "questionId" INTEGER NOT NULL,
ADD COLUMN     "text" TEXT;

-- AlterTable
ALTER TABLE "TeamMeeting" DROP COLUMN "sprintPlanningFormId",
DROP COLUMN "sprintReviewFormId";

-- DropTable
DROP TABLE "QuestionOption";

-- DropTable
DROP TABLE "ResponseMeeting";

-- DropTable
DROP TABLE "ResponseUser";

-- DropTable
DROP TABLE "ResponseVoyageTeam";

-- DropTable
DROP TABLE "ResponseVoyageTeamMember";

-- CreateTable
CREATE TABLE "FormResponseMeeting" (
    "id" SERIAL NOT NULL,
    "formId" INTEGER NOT NULL,
    "meetingId" INTEGER NOT NULL,

    CONSTRAINT "FormResponseMeeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormResponseUser" (
    "id" SERIAL NOT NULL,
    "responseId" INTEGER NOT NULL,
    "userId" UUID NOT NULL,

    CONSTRAINT "FormResponseUser_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormResponseVoyageTeam" (
    "id" SERIAL NOT NULL,
    "responseId" INTEGER NOT NULL,
    "voyageTeamId" INTEGER NOT NULL,

    CONSTRAINT "FormResponseVoyageTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormResponseVoyageTeamMember" (
    "id" SERIAL NOT NULL,
    "responseId" INTEGER NOT NULL,
    "voyageTeamMemberId" INTEGER NOT NULL,

    CONSTRAINT "FormResponseVoyageTeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FormResponseMeeting_formId_meetingId_key" ON "FormResponseMeeting"("formId", "meetingId");

-- CreateIndex
CREATE UNIQUE INDEX "Response_questionId_formResponseMeetingId_key" ON "Response"("questionId", "formResponseMeetingId");

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_optionChoiceId_fkey" FOREIGN KEY ("optionChoiceId") REFERENCES "OptionChoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_formResponseMeetingId_fkey" FOREIGN KEY ("formResponseMeetingId") REFERENCES "FormResponseMeeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponseMeeting" ADD CONSTRAINT "FormResponseMeeting_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponseMeeting" ADD CONSTRAINT "FormResponseMeeting_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "TeamMeeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponseUser" ADD CONSTRAINT "FormResponseUser_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponseUser" ADD CONSTRAINT "FormResponseUser_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponseVoyageTeam" ADD CONSTRAINT "FormResponseVoyageTeam_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponseVoyageTeam" ADD CONSTRAINT "FormResponseVoyageTeam_voyageTeamId_fkey" FOREIGN KEY ("voyageTeamId") REFERENCES "VoyageTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponseVoyageTeamMember" ADD CONSTRAINT "FormResponseVoyageTeamMember_responseId_fkey" FOREIGN KEY ("responseId") REFERENCES "Response"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponseVoyageTeamMember" ADD CONSTRAINT "FormResponseVoyageTeamMember_voyageTeamMemberId_fkey" FOREIGN KEY ("voyageTeamMemberId") REFERENCES "VoyageTeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;
