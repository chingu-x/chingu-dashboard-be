/*
  Warnings:

  - A unique constraint covering the columns `[abbreviation]` on the table `Gender` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Gender_abbreviation_key" ON "Gender"("abbreviation");
