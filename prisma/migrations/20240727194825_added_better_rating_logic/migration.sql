-- CreateTable
CREATE TABLE "ResearchEffortRating" (
    "id" TEXT NOT NULL,
    "rating" BOOLEAN NOT NULL,
    "questionId" TEXT NOT NULL,
    "userId" TEXT NOT NULL,

    CONSTRAINT "ResearchEffortRating_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "ResearchEffortRating_questionId_userId_key" ON "ResearchEffortRating"("questionId", "userId");

-- AddForeignKey
ALTER TABLE "ResearchEffortRating" ADD CONSTRAINT "ResearchEffortRating_questionId_fkey" FOREIGN KEY ("questionId") REFERENCES "Question"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "ResearchEffortRating" ADD CONSTRAINT "ResearchEffortRating_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
