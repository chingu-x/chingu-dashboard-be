-- CreateExtension
CREATE EXTENSION IF NOT EXISTS "citext";

-- CreateTable
CREATE TABLE "FormType" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormType_pkey" PRIMARY KEY ("id")
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
    "parentQuestionId" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Question_pkey" PRIMARY KEY ("id")
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
CREATE TABLE "Response" (
    "id" SERIAL NOT NULL,
    "questionId" INTEGER NOT NULL,
    "optionChoiceId" INTEGER,
    "numeric" INTEGER,
    "boolean" BOOLEAN,
    "text" TEXT,
    "responseGroupId" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Response_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResponseGroup" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ResponseGroup_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormResponseMeeting" (
    "id" SERIAL NOT NULL,
    "formId" INTEGER NOT NULL,
    "meetingId" INTEGER NOT NULL,
    "responseGroupId" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormResponseMeeting_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormResponseCheckin" (
    "id" SERIAL NOT NULL,
    "voyageTeamMemberId" INTEGER NOT NULL,
    "sprintId" INTEGER NOT NULL,
    "adminComments" TEXT,
    "feedbackSent" BOOLEAN NOT NULL DEFAULT false,
    "responseGroupId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormResponseCheckin_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "FormResponseVoyageProject" (
    "id" SERIAL NOT NULL,
    "voyageTeamId" INTEGER NOT NULL,
    "responseGroupId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormResponseVoyageProject_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "HealthCheck" (
    "id" SERIAL NOT NULL,
    "statusCode" INTEGER NOT NULL,
    "resMsg" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "HealthCheck_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "TeamMeeting" (
    "id" SERIAL NOT NULL,
    "sprintId" INTEGER NOT NULL,
    "voyageTeamId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "dateTime" TIMESTAMP(3),
    "meetingLink" TEXT,
    "notes" TEXT,
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
    "order" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectFeature_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectIdea" (
    "id" SERIAL NOT NULL,
    "voyageTeamMemberId" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "vision" TEXT NOT NULL,
    "isSelected" BOOLEAN NOT NULL DEFAULT false,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ProjectIdea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectIdeaVote" (
    "id" SERIAL NOT NULL,
    "voyageTeamMemberId" INTEGER,
    "projectIdeaId" INTEGER NOT NULL,
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
CREATE TABLE "TechStackCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TechStackCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamTechStackItem" (
    "id" SERIAL NOT NULL,
    "name" CITEXT NOT NULL,
    "categoryId" INTEGER,
    "voyageTeamId" INTEGER NOT NULL,
    "isSelected" BOOLEAN NOT NULL DEFAULT false,
    "voyageTeamMemberId" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamTechStackItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamTechStackItemVote" (
    "id" SERIAL NOT NULL,
    "teamTechId" INTEGER NOT NULL,
    "teamMemberId" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "TeamTechStackItemVote_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResetToken" (
    "userId" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- CreateTable
CREATE TABLE "EmailVerificationToken" (
    "userId" UUID NOT NULL,
    "token" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Gender" (
    "id" SERIAL NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Gender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "email" TEXT NOT NULL,
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "password" TEXT NOT NULL,
    "firstName" TEXT,
    "lastName" TEXT,
    "avatar" TEXT,
    "githubId" TEXT,
    "discordId" TEXT,
    "twitterId" TEXT,
    "linkedinId" TEXT,
    "genderId" INTEGER,
    "countryCode" TEXT,
    "timezone" TEXT,
    "comment" TEXT,
    "refreshToken" TEXT[],
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Role" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Role_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserRole" (
    "userId" UUID NOT NULL,
    "roleId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL
);

-- CreateTable
CREATE TABLE "Voyage" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "statusId" INTEGER,
    "startDate" TIMESTAMPTZ NOT NULL,
    "endDate" TIMESTAMPTZ NOT NULL,
    "soloProjectDeadline" TIMESTAMPTZ NOT NULL,
    "certificateIssueDate" TIMESTAMPTZ NOT NULL,
    "showcasePublishDate" TIMESTAMPTZ,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Voyage_pkey" PRIMARY KEY ("id")
);

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
CREATE TABLE "VoyageStatus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VoyageStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Tier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoyageRole" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VoyageRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoyageTeam" (
    "id" SERIAL NOT NULL,
    "voyageId" INTEGER,
    "name" TEXT NOT NULL,
    "statusId" INTEGER,
    "repoUrl" TEXT NOT NULL,
    "repoUrlBE" TEXT,
    "deployedUrl" TEXT,
    "deployedUrlBE" TEXT,
    "tierId" INTEGER,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VoyageTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoyageTeamMember" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "voyageTeamId" INTEGER NOT NULL,
    "voyageRoleId" INTEGER,
    "statusId" INTEGER,
    "hrPerSprint" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "VoyageTeamMember_pkey" PRIMARY KEY ("id")
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

-- CreateIndex
CREATE UNIQUE INDEX "FormType_name_key" ON "FormType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Form_title_key" ON "Form"("title");

-- CreateIndex
CREATE UNIQUE INDEX "InputType_name_key" ON "InputType"("name");

-- CreateIndex
CREATE UNIQUE INDEX "OptionGroup_name_key" ON "OptionGroup"("name");

-- CreateIndex
CREATE UNIQUE INDEX "FormResponseMeeting_responseGroupId_key" ON "FormResponseMeeting"("responseGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "FormResponseMeeting_formId_meetingId_key" ON "FormResponseMeeting"("formId", "meetingId");

-- CreateIndex
CREATE UNIQUE INDEX "FormResponseCheckin_responseGroupId_key" ON "FormResponseCheckin"("responseGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "FormResponseCheckin_voyageTeamMemberId_sprintId_key" ON "FormResponseCheckin"("voyageTeamMemberId", "sprintId");

-- CreateIndex
CREATE UNIQUE INDEX "FormResponseVoyageProject_voyageTeamId_key" ON "FormResponseVoyageProject"("voyageTeamId");

-- CreateIndex
CREATE UNIQUE INDEX "FormResponseVoyageProject_responseGroupId_key" ON "FormResponseVoyageProject"("responseGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "ChecklistItem_name_key" ON "ChecklistItem"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserChecklistStatus_userId_checklistItemId_key" ON "UserChecklistStatus"("userId", "checklistItemId");

-- CreateIndex
CREATE UNIQUE INDEX "SoloProjectStatus_status_key" ON "SoloProjectStatus"("status");

-- CreateIndex
CREATE UNIQUE INDEX "SoloProject_responseGroupId_key" ON "SoloProject"("responseGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "FeatureCategory_name_key" ON "FeatureCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TechStackCategory_name_key" ON "TechStackCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TeamTechStackItem_name_voyageTeamId_categoryId_key" ON "TeamTechStackItem"("name", "voyageTeamId", "categoryId");

-- CreateIndex
CREATE UNIQUE INDEX "TeamTechStackItemVote_teamTechId_teamMemberId_key" ON "TeamTechStackItemVote"("teamTechId", "teamMemberId");

-- CreateIndex
CREATE UNIQUE INDEX "ResetToken_userId_key" ON "ResetToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "EmailVerificationToken_userId_key" ON "EmailVerificationToken"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "Gender_abbreviation_key" ON "Gender"("abbreviation");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Role_name_key" ON "Role"("name");

-- CreateIndex
CREATE UNIQUE INDEX "UserRole_userId_roleId_key" ON "UserRole"("userId", "roleId");

-- CreateIndex
CREATE UNIQUE INDEX "Voyage_number_key" ON "Voyage"("number");

-- CreateIndex
CREATE UNIQUE INDEX "Sprint_voyageId_number_key" ON "Sprint"("voyageId", "number");

-- CreateIndex
CREATE UNIQUE INDEX "VoyageStatus_name_key" ON "VoyageStatus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tier_name_key" ON "Tier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "VoyageRole_name_key" ON "VoyageRole"("name");

-- CreateIndex
CREATE UNIQUE INDEX "VoyageTeam_name_key" ON "VoyageTeam"("name");

-- CreateIndex
CREATE UNIQUE INDEX "VoyageTeamMember_userId_voyageTeamId_key" ON "VoyageTeamMember"("userId", "voyageTeamId");

-- CreateIndex
CREATE UNIQUE INDEX "VoyageApplication_responseGroupId_key" ON "VoyageApplication"("responseGroupId");

-- AddForeignKey
ALTER TABLE "Form" ADD CONSTRAINT "Form_formTypeId_fkey" FOREIGN KEY ("formTypeId") REFERENCES "FormType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_inputTypeId_fkey" FOREIGN KEY ("inputTypeId") REFERENCES "InputType"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_optionGroupId_fkey" FOREIGN KEY ("optionGroupId") REFERENCES "OptionGroup"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Question" ADD CONSTRAINT "Question_parentQuestionId_fkey" FOREIGN KEY ("parentQuestionId") REFERENCES "Question"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "OptionChoice" ADD CONSTRAINT "OptionChoice_optionGroupId_fkey" FOREIGN KEY ("optionGroupId") REFERENCES "OptionGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_optionChoiceId_fkey" FOREIGN KEY ("optionChoiceId") REFERENCES "OptionChoice"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Response" ADD CONSTRAINT "Response_responseGroupId_fkey" FOREIGN KEY ("responseGroupId") REFERENCES "ResponseGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponseMeeting" ADD CONSTRAINT "FormResponseMeeting_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponseMeeting" ADD CONSTRAINT "FormResponseMeeting_meetingId_fkey" FOREIGN KEY ("meetingId") REFERENCES "TeamMeeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponseMeeting" ADD CONSTRAINT "FormResponseMeeting_responseGroupId_fkey" FOREIGN KEY ("responseGroupId") REFERENCES "ResponseGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponseCheckin" ADD CONSTRAINT "FormResponseCheckin_voyageTeamMemberId_fkey" FOREIGN KEY ("voyageTeamMemberId") REFERENCES "VoyageTeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponseCheckin" ADD CONSTRAINT "FormResponseCheckin_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponseCheckin" ADD CONSTRAINT "FormResponseCheckin_responseGroupId_fkey" FOREIGN KEY ("responseGroupId") REFERENCES "ResponseGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponseVoyageProject" ADD CONSTRAINT "FormResponseVoyageProject_voyageTeamId_fkey" FOREIGN KEY ("voyageTeamId") REFERENCES "VoyageTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponseVoyageProject" ADD CONSTRAINT "FormResponseVoyageProject_responseGroupId_fkey" FOREIGN KEY ("responseGroupId") REFERENCES "ResponseGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

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
ALTER TABLE "TeamMeeting" ADD CONSTRAINT "TeamMeeting_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamMeeting" ADD CONSTRAINT "TeamMeeting_voyageTeamId_fkey" FOREIGN KEY ("voyageTeamId") REFERENCES "VoyageTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Agenda" ADD CONSTRAINT "Agenda_teamMeetingId_fkey" FOREIGN KEY ("teamMeetingId") REFERENCES "TeamMeeting"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFeature" ADD CONSTRAINT "ProjectFeature_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "VoyageTeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectFeature" ADD CONSTRAINT "ProjectFeature_featureCategoryId_fkey" FOREIGN KEY ("featureCategoryId") REFERENCES "FeatureCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectIdea" ADD CONSTRAINT "ProjectIdea_voyageTeamMemberId_fkey" FOREIGN KEY ("voyageTeamMemberId") REFERENCES "VoyageTeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectIdeaVote" ADD CONSTRAINT "ProjectIdeaVote_voyageTeamMemberId_fkey" FOREIGN KEY ("voyageTeamMemberId") REFERENCES "VoyageTeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ProjectIdeaVote" ADD CONSTRAINT "ProjectIdeaVote_projectIdeaId_fkey" FOREIGN KEY ("projectIdeaId") REFERENCES "ProjectIdea"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamResource" ADD CONSTRAINT "TeamResource_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "VoyageTeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamTechStackItem" ADD CONSTRAINT "TeamTechStackItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TechStackCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamTechStackItem" ADD CONSTRAINT "TeamTechStackItem_voyageTeamId_fkey" FOREIGN KEY ("voyageTeamId") REFERENCES "VoyageTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamTechStackItem" ADD CONSTRAINT "TeamTechStackItem_voyageTeamMemberId_fkey" FOREIGN KEY ("voyageTeamMemberId") REFERENCES "VoyageTeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamTechStackItemVote" ADD CONSTRAINT "TeamTechStackItemVote_teamTechId_fkey" FOREIGN KEY ("teamTechId") REFERENCES "TeamTechStackItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamTechStackItemVote" ADD CONSTRAINT "TeamTechStackItemVote_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "VoyageTeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResetToken" ADD CONSTRAINT "ResetToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmailVerificationToken" ADD CONSTRAINT "EmailVerificationToken_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Gender"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserRole" ADD CONSTRAINT "UserRole_roleId_fkey" FOREIGN KEY ("roleId") REFERENCES "Role"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Voyage" ADD CONSTRAINT "Voyage_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "VoyageStatus"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Sprint" ADD CONSTRAINT "Sprint_voyageId_fkey" FOREIGN KEY ("voyageId") REFERENCES "Voyage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

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
ALTER TABLE "VoyageApplication" ADD CONSTRAINT "VoyageApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoyageApplication" ADD CONSTRAINT "VoyageApplication_voyageId_fkey" FOREIGN KEY ("voyageId") REFERENCES "Voyage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoyageApplication" ADD CONSTRAINT "VoyageApplication_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoyageApplication" ADD CONSTRAINT "VoyageApplication_responseGroupId_fkey" FOREIGN KEY ("responseGroupId") REFERENCES "ResponseGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

