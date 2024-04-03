-- DropIndex
DROP INDEX "Response_questionId_responseGroupId_key";

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

-- CreateIndex
CREATE UNIQUE INDEX "FormResponseCheckin_responseGroupId_key" ON "FormResponseCheckin"("responseGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "FormResponseCheckin_voyageTeamMemberId_sprintId_key" ON "FormResponseCheckin"("voyageTeamMemberId", "sprintId");

-- AddForeignKey
ALTER TABLE "FormResponseCheckin" ADD CONSTRAINT "FormResponseCheckin_voyageTeamMemberId_fkey" FOREIGN KEY ("voyageTeamMemberId") REFERENCES "VoyageTeamMember"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponseCheckin" ADD CONSTRAINT "FormResponseCheckin_sprintId_fkey" FOREIGN KEY ("sprintId") REFERENCES "Sprint"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponseCheckin" ADD CONSTRAINT "FormResponseCheckin_responseGroupId_fkey" FOREIGN KEY ("responseGroupId") REFERENCES "ResponseGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
