/*
  Warnings:

  - Added the required column `timeZone` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Gender" ADD COLUMN     "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "comment" TEXT,
ADD COLUMN     "timeZone" TEXT NOT NULL;

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
    "role" TEXT NOT NULL,

    CONSTRAINT "VoyageTeamMember_pkey" PRIMARY KEY ("userId","voyageTeamId")
);

-- CreateIndex
CREATE UNIQUE INDEX "VoyageRole_name_key" ON "VoyageRole"("name");
