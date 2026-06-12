-- AlterTable
ALTER TABLE "User" ADD COLUMN     "finishedTracks" TEXT[] DEFAULT ARRAY[]::TEXT[];
