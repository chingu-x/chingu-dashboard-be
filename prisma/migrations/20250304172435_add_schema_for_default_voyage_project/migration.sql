-- AlterTable
ALTER TABLE "VoyageTeam" ADD COLUMN     "hasSelectedDefaultProject" BOOLEAN NOT NULL DEFAULT false;

-- CreateTable
CREATE TABLE "DefaultVoyageProject" (
    "id" SERIAL NOT NULL,
    "repoUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "overview" TEXT NOT NULL,
    "voyageId" INTEGER NOT NULL,
    "tierId" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "DefaultVoyageProject_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "DefaultVoyageProject" ADD CONSTRAINT "DefaultVoyageProject_voyageId_fkey" FOREIGN KEY ("voyageId") REFERENCES "Voyage"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "DefaultVoyageProject" ADD CONSTRAINT "DefaultVoyageProject_tierId_fkey" FOREIGN KEY ("tierId") REFERENCES "Tier"("id") ON DELETE SET NULL ON UPDATE CASCADE;
