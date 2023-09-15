-- CreateTable
CREATE TABLE "Gender" (
    "id" TEXT NOT NULL,
    "abbreviation" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Gender_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "User" (
    "id" TEXT NOT NULL,
    "firstName" TEXT NOT NULL,
    "lastName" TEXT NOT NULL,
    "githubId" TEXT NOT NULL,
    "discordId" TEXT NOT NULL,
    "twitterId" TEXT,
    "linkedinId" TEXT,
    "email" TEXT NOT NULL,
    "genderId" TEXT,
    "countryCode" TEXT,
    "timeZone" TEXT NOT NULL,
    "comment" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Voyage" (
    "id" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "startDate" TIMESTAMPTZ NOT NULL,
    "endDate" TIMESTAMPTZ NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Voyage_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoyageStatus" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VoyageStatus_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tier" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Tier_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoyageTeam" (
    "id" TEXT NOT NULL,
    "voyageId" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    "repoUrl" TEXT NOT NULL,
    "repoUrlBE" TEXT,
    "deployedUrl" TEXT,
    "deployedUrlBE" TEXT,
    "tierId" TEXT NOT NULL,
    "endDate" TIMESTAMP(3) NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VoyageTeam_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoyageRole" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "VoyageRole_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "VoyageTeamMember" (
    "userId" TEXT NOT NULL,
    "voyageTeamId" TEXT NOT NULL,
    "voyageRoleId" TEXT NOT NULL,
    "statusId" TEXT NOT NULL,
    "hrPerSprint" DOUBLE PRECISION NOT NULL,

    CONSTRAINT "VoyageTeamMember_pkey" PRIMARY KEY ("userId","voyageTeamId")
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

-- AddForeignKey
ALTER TABLE "User" ADD CONSTRAINT "User_genderId_fkey" FOREIGN KEY ("genderId") REFERENCES "Gender"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoyageTeam" ADD CONSTRAINT "VoyageTeam_voyageId_fkey" FOREIGN KEY ("voyageId") REFERENCES "Voyage"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoyageTeam" ADD CONSTRAINT "VoyageTeam_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "VoyageStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoyageTeam" ADD CONSTRAINT "VoyageTeam_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "Tier"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoyageTeamMember" ADD CONSTRAINT "VoyageTeamMember_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoyageTeamMember" ADD CONSTRAINT "VoyageTeamMember_voyageTeamId_fkey" FOREIGN KEY ("voyageTeamId") REFERENCES "VoyageTeam"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoyageTeamMember" ADD CONSTRAINT "VoyageTeamMember_voyageRoleId_fkey" FOREIGN KEY ("voyageRoleId") REFERENCES "VoyageRole"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "VoyageTeamMember" ADD CONSTRAINT "VoyageTeamMember_statusId_fkey" FOREIGN KEY ("statusId") REFERENCES "VoyageStatus"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
