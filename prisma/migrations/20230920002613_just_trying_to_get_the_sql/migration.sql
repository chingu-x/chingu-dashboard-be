-- CreateTable
CREATE TABLE "Gender" (
    "id" SERIAL NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Gender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" UUID NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "githubId" TEXT,
    "discordId" TEXT,
    "twitterId" TEXT,
    "linkedinId" TEXT,
    "email" TEXT NOT NULL,
    "genderId" INTEGER,
    "countryCode" TEXT,
    "timezone" TEXT NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voyage" (
    "id" SERIAL NOT NULL,
    "number" TEXT NOT NULL,
    "startDate" TIMESTAMPTZ NOT NULL,
    "endDate" TIMESTAMPTZ NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Voyage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoyageStatus" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VoyageStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tier" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tier_pkey" PRIMARY KEY ("id")
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

    CONSTRAINT "VoyageTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoyageRole" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VoyageRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoyageTeamMember" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "voyageTeamId" INTEGER NOT NULL,
    "voyageRoleId" INTEGER,
    "statusId" INTEGER,
    "hrPerSprint" DOUBLE PRECISION NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VoyageTeamMember_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ProjectIdea" (
    "id" SERIAL NOT NULL,
    "userId" INTEGER,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "vision" TEXT NOT NULL,
    "voteCount" INTEGER NOT NULL DEFAULT 0,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "ProjectIdea_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechStackCategory" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TechStackCategory_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TechStackItem" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "categoryId" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TechStackItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamTechStackItem" (
    "id" SERIAL NOT NULL,
    "techId" INTEGER NOT NULL,
    "voyageTeamId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamTechStackItem_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "TeamTechStackItemVote" (
    "id" SERIAL NOT NULL,
    "teamTechId" INTEGER NOT NULL,
    "teamMemberId" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "TeamTechStackItemVote_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Gender_abbreviation_key" ON "Gender"("abbreviation");

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Voyage_number_key" ON "Voyage"("number");

-- CreateIndex
CREATE UNIQUE INDEX "VoyageStatus_name_key" ON "VoyageStatus"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Tier_name_key" ON "Tier"("name");

-- CreateIndex
CREATE UNIQUE INDEX "VoyageTeam_name_key" ON "VoyageTeam"("name");

-- CreateIndex
CREATE UNIQUE INDEX "VoyageRole_name_key" ON "VoyageRole"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TechStackCategory_name_key" ON "TechStackCategory"("name");

-- CreateIndex
CREATE UNIQUE INDEX "TechStackItem_name_key" ON "TechStackItem"("name");

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Gender"("id") ON DELETE SET NULL ON UPDATE CASCADE;

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
ALTER TABLE "TechStackItem" ADD CONSTRAINT "TechStackItem_categoryId_fkey" FOREIGN KEY ("categoryId") REFERENCES "TechStackCategory"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamTechStackItem" ADD CONSTRAINT "TeamTechStackItem_techId_fkey" FOREIGN KEY ("techId") REFERENCES "TechStackItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamTechStackItem" ADD CONSTRAINT "TeamTechStackItem_voyageTeamId_fkey" FOREIGN KEY ("voyageTeamId") REFERENCES "VoyageTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamTechStackItemVote" ADD CONSTRAINT "TeamTechStackItemVote_teamTechId_fkey" FOREIGN KEY ("teamTechId") REFERENCES "TeamTechStackItem"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "TeamTechStackItemVote" ADD CONSTRAINT "TeamTechStackItemVote_teamMemberId_fkey" FOREIGN KEY ("teamMemberId") REFERENCES "VoyageTeamMember"("id") ON DELETE SET NULL ON UPDATE CASCADE;
