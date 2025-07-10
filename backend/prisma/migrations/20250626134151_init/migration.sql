/*
  Warnings:

  - The primary key for the `Department` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `departmentName` on the `Department` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Department` table. All the data in the column will be lost.
  - The primary key for the `Employee` table will be changed. If it partially fails, the table could be left without primary key constraint.
  - You are about to drop the column `createdAt` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `designation` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `email` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `employeeName` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `id` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `password` on the `Employee` table. All the data in the column will be lost.
  - You are about to drop the column `phone` on the `Employee` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[Email]` on the table `Employee` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `Name` to the `Department` table without a default value. This is not possible if the table is not empty.
  - Added the required column `DepartmentID` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Designation` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Email` to the `Employee` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Name` to the `Employee` table without a default value. This is not possible if the table is not empty.

*/
-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('Present', 'Absent', 'Leave', 'Remote', 'Late');

-- CreateEnum
CREATE TYPE "LeaveType" AS ENUM ('Sick', 'Casual', 'Earned');

-- CreateEnum
CREATE TYPE "LeaveStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- DropIndex
DROP INDEX "Department_departmentName_key";

-- DropIndex
DROP INDEX "Employee_email_key";

-- AlterTable
ALTER TABLE "Department" DROP CONSTRAINT "Department_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "departmentName",
DROP COLUMN "id",
ADD COLUMN     "DepartmentID" SERIAL NOT NULL,
ADD COLUMN     "Name" TEXT NOT NULL,
ADD CONSTRAINT "Department_pkey" PRIMARY KEY ("DepartmentID");

-- AlterTable
ALTER TABLE "Employee" DROP CONSTRAINT "Employee_pkey",
DROP COLUMN "createdAt",
DROP COLUMN "department",
DROP COLUMN "designation",
DROP COLUMN "email",
DROP COLUMN "employeeName",
DROP COLUMN "id",
DROP COLUMN "password",
DROP COLUMN "phone",
ADD COLUMN     "DepartmentID" INTEGER NOT NULL,
ADD COLUMN     "Designation" TEXT NOT NULL,
ADD COLUMN     "Email" TEXT NOT NULL,
ADD COLUMN     "EmployeeID" SERIAL NOT NULL,
ADD COLUMN     "Name" TEXT NOT NULL,
ADD COLUMN     "Phone" TEXT,
ADD CONSTRAINT "Employee_pkey" PRIMARY KEY ("EmployeeID");

-- CreateTable
CREATE TABLE "Project" (
    "ProjectID" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "StartDate" TIMESTAMP(3) NOT NULL,
    "EndDate" TIMESTAMP(3) NOT NULL,
    "ManagerID" INTEGER,

    CONSTRAINT "Project_pkey" PRIMARY KEY ("ProjectID")
);

-- CreateTable
CREATE TABLE "EmployeeProject" (
    "EmployeeID" INTEGER NOT NULL,
    "ProjectID" INTEGER NOT NULL,
    "RoleInProject" TEXT NOT NULL,

    CONSTRAINT "EmployeeProject_pkey" PRIMARY KEY ("EmployeeID","ProjectID")
);

-- CreateTable
CREATE TABLE "Attendance" (
    "AttendanceID" SERIAL NOT NULL,
    "EmployeeID" INTEGER NOT NULL,
    "Date" TIMESTAMP(3) NOT NULL,
    "CheckInTime" TIMESTAMP(3),
    "CheckOutTime" TIMESTAMP(3),
    "Status" "AttendanceStatus" NOT NULL,

    CONSTRAINT "Attendance_pkey" PRIMARY KEY ("AttendanceID")
);

-- CreateTable
CREATE TABLE "LeaveRequest" (
    "LeaveID" SERIAL NOT NULL,
    "EmployeeID" INTEGER NOT NULL,
    "StartDate" TIMESTAMP(3) NOT NULL,
    "EndDate" TIMESTAMP(3) NOT NULL,
    "LeaveType" "LeaveType" NOT NULL,
    "Status" "LeaveStatus" NOT NULL,

    CONSTRAINT "LeaveRequest_pkey" PRIMARY KEY ("LeaveID")
);

-- CreateIndex
CREATE UNIQUE INDEX "Employee_Email_key" ON "Employee"("Email");

-- AddForeignKey
ALTER TABLE "Employee" ADD CONSTRAINT "Employee_DepartmentID_fkey" FOREIGN KEY ("DepartmentID") REFERENCES "Department"("DepartmentID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Project" ADD CONSTRAINT "Project_ManagerID_fkey" FOREIGN KEY ("ManagerID") REFERENCES "Employee"("EmployeeID") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeProject" ADD CONSTRAINT "EmployeeProject_EmployeeID_fkey" FOREIGN KEY ("EmployeeID") REFERENCES "Employee"("EmployeeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "EmployeeProject" ADD CONSTRAINT "EmployeeProject_ProjectID_fkey" FOREIGN KEY ("ProjectID") REFERENCES "Project"("ProjectID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Attendance" ADD CONSTRAINT "Attendance_EmployeeID_fkey" FOREIGN KEY ("EmployeeID") REFERENCES "Employee"("EmployeeID") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "LeaveRequest" ADD CONSTRAINT "LeaveRequest_EmployeeID_fkey" FOREIGN KEY ("EmployeeID") REFERENCES "Employee"("EmployeeID") ON DELETE RESTRICT ON UPDATE CASCADE;
