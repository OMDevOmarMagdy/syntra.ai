-- AlterEnum
ALTER TYPE "Role" ADD VALUE 'recruiter';

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "trackFinished" BOOLEAN NOT NULL DEFAULT false;
