/*
  Warnings:

  - You are about to drop the column `modules` on the `Permission` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Permission" DROP COLUMN "modules",
ADD COLUMN     "module" VARCHAR(500) NOT NULL DEFAULT '';
