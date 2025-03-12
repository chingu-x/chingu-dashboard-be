/*
  Warnings:

  - A unique constraint covering the columns `[userApplicationId]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "OptionChoice" ADD COLUMN     "description" TEXT,
ADD COLUMN     "order" INTEGER;

-- AlterTable
ALTER TABLE "Question" ADD COLUMN     "pageNumber" INTEGER;

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "userApplicationId" INTEGER;

-- CreateTable
CREATE TABLE "UserApplication" (
    "id" SERIAL NOT NULL,
    "userId" UUID NOT NULL,
    "formId" INTEGER,
    "responseGroupId" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserApplication_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserApplication_userId_key" ON "UserApplication"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "UserApplication_responseGroupId_key" ON "UserApplication"("responseGroupId");

-- CreateIndex
CREATE UNIQUE INDEX "User_userApplicationId_key" ON "User"("userApplicationId");

-- AddForeignKey
ALTER TABLE "UserApplication" ADD CONSTRAINT "UserApplication_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserApplication" ADD CONSTRAINT "UserApplication_formId_fkey" FOREIGN KEY ("formId") REFERENCES "Form"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "UserApplication" ADD CONSTRAINT "UserApplication_responseGroupId_fkey" FOREIGN KEY ("responseGroupId") REFERENCES "ResponseGroup"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
