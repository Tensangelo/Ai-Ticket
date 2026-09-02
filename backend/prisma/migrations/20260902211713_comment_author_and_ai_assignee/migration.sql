-- AlterTable
ALTER TABLE "Comment" ADD COLUMN     "authorName" TEXT NOT NULL DEFAULT 'Unknown operator',
ADD COLUMN     "authorRole" TEXT NOT NULL DEFAULT 'Head of Operations';
