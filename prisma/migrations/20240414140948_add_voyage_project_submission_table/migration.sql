-- CreateTable
CREATE TABLE "FormResponseVoyageProject" (
    "id" SERIAL NOT NULL,
    "voyageTeamId" INTEGER NOT NULL,
    "responseGroupId" INTEGER NOT NULL,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "FormResponseVoyageProject_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "FormResponseVoyageProject_voyageTeamId_key" ON "FormResponseVoyageProject"("voyageTeamId");

-- CreateIndex
CREATE UNIQUE INDEX "FormResponseVoyageProject_responseGroupId_key" ON "FormResponseVoyageProject"("responseGroupId");

-- AddForeignKey
ALTER TABLE "FormResponseVoyageProject" ADD CONSTRAINT "FormResponseVoyageProject_voyageTeamId_fkey" FOREIGN KEY ("voyageTeamId") REFERENCES "VoyageTeam"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "FormResponseVoyageProject" ADD CONSTRAINT "FormResponseVoyageProject_responseGroupId_fkey" FOREIGN KEY ("responseGroupId") REFERENCES "ResponseGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
