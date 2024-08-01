/*
  Warnings:

  - You are about to drop the column `finalAnswer` on the `Question` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "isAnswerToQuestion" BOOLEAN NOT NULL DEFAULT false;

-- AlterTable
ALTER TABLE "Question" DROP COLUMN "finalAnswer",
ADD COLUMN     "answered" BOOLEAN NOT NULL DEFAULT false;
