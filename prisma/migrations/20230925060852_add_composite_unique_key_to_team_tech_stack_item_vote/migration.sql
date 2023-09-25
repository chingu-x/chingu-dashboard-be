/*
  Warnings:

  - A unique constraint covering the columns `[teamTechId,teamMemberId]` on the table `TeamTechStackItemVote` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "TeamTechStackItemVote_teamTechId_teamMemberId_key" ON "TeamTechStackItemVote"("teamTechId", "teamMemberId");
