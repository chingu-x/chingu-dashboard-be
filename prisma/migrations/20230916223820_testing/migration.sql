-- CreateTable
CREATE TABLE "HealthCheck" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "statusCode" INTEGER NOT NULL,
    "resMsg" TEXT NOT NULL,

    CONSTRAINT "HealthCheck_pkey" PRIMARY KEY ("id")
);
