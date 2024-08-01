/*
  Warnings:

  - You are about to drop the column `usefulRating` on the `Comment` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[isAnswerToQuestion,questionId]` on the table `Comment` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "Comment" DROP COLUMN "usefulRating";

-- CreateIndex
CREATE UNIQUE INDEX "Comment_isAnswerToQuestion_questionId_key" ON "Comment"("isAnswerToQuestion", "questionId");
