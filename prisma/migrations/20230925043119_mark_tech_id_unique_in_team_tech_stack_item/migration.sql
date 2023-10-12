/*
  Warnings:

  - A unique constraint covering the columns `[techId]` on the table `TeamTechStackItem` will be added. If there are existing duplicate values, this will fail.
  - A unique constraint covering the columns `[userId,voyageTeamId]` on the table `VoyageTeamMember` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TeamTechStackItem_techId_key" ON "TeamTechStackItem"("techId");

-- CreateIndex
CREATE UNIQUE INDEX "VoyageTeamMember_userId_voyageTeamId_key" ON "VoyageTeamMember"("userId", "voyageTeamId");
