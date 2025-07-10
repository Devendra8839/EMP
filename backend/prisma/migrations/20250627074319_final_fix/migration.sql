/*
  Warnings:

  - A unique constraint covering the columns `[Name]` on the table `Department` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Department_Name_key" ON "Department"("Name");
