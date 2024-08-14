/*
  Warnings:

  - You are about to drop the column `discordId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `githubId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `linkedinId` on the `User` table. All the data in the column will be lost.
  - You are about to drop the column `twitterId` on the `User` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "User" DROP COLUMN "discordId",
DROP COLUMN "githubId",
DROP COLUMN "linkedinId",
DROP COLUMN "twitterId";

-- CreateTable
CREATE TABLE "OAuthProvider" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "OAuthProvider_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "UserOAuthProfile" (
    "userId" UUID NOT NULL,
    "providerId" INTEGER NOT NULL,
    "providerUserId" TEXT NOT NULL,
    "providerUsername" TEXT,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserOAuthProfile_pkey" PRIMARY KEY ("userId","providerId")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserOAuthProfile_providerId_providerUserId_key" ON "UserOAuthProfile"("providerId", "providerUserId");

-- AddForeignKey
ALTER TABLE "UserOAuthProfile" ADD CONSTRAINT "UserOAuthProfile_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserOAuthProfile" ADD CONSTRAINT "UserOAuthProfile_providerId_fkey" FOREIGN KEY ("providerId") REFERENCES "OAuthProvider"("id") ON DELETE CASCADE ON UPDATE CASCADE;
