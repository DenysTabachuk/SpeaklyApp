/*
  Warnings:

  - The primary key for the `Collection` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `in` on the `Collection` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "public"."Collection" DROP CONSTRAINT "Collection_pkey",
DROP COLUMN "in",
ADD COLUMN     "id" SERIAL NOT NULL,
ADD CONSTRAINT "Collection_pkey" PRIMARY KEY ("id");
