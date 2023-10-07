/*
  Warnings:

  - A unique constraint covering the columns `[userId,voyageTeamId]` on the table `VoyageTeamMember` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "VoyageTeamMember_userId_voyageTeamId_key" ON "VoyageTeamMember"("userId", "voyageTeamId");
