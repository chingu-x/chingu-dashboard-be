/*
  Warnings:

  - You are about to drop the column `adminComments` on the `SoloProject` table. All the data in the column will be lost.

*/
-- CreateEnum
CREATE TYPE "CommentType" AS ENUM ('SoloProject');

-- AlterTable
ALTER TABLE "SoloProject" DROP COLUMN "adminComments";

-- CreateTable
CREATE TABLE "Comment" (
    "id" SERIAL NOT NULL,
    "content" TEXT NOT NULL,
    "authorId" UUID,
    "path" TEXT,
    "parentCommentId" INTEGER,
    "type" "CommentType" NOT NULL,
    "soloProjectId" INTEGER,
    "createdAt" TIMESTAMPTZ NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Comment_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_authorId_fkey" FOREIGN KEY ("authorId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_parentCommentId_fkey" FOREIGN KEY ("parentCommentId") REFERENCES "Comment"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Comment" ADD CONSTRAINT "Comment_soloProjectId_fkey" FOREIGN KEY ("soloProjectId") REFERENCES "SoloProject"("id") ON DELETE CASCADE ON UPDATE CASCADE;
