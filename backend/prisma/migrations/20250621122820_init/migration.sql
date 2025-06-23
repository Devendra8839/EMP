-- CreateEnum
CREATE TYPE "AttendanceStatus" AS ENUM ('Present', 'Absent', 'Leave', 'Remote', 'Late');

-- CreateEnum
CREATE TYPE "LeaveType" AS ENUM ('Sick', 'Casual', 'Earned');

-- CreateEnum
CREATE TYPE "LeaveStatus" AS ENUM ('Pending', 'Approved', 'Rejected');

-- CreateTable
CREATE TABLE "Department" (
    "DepartmentID" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,

    CONSTRAINT "Department_pkey" PRIMARY KEY ("DepartmentID")
);

-- CreateTable
CREATE TABLE "Employee" (
    "EmployeeID" SERIAL NOT NULL,
    "Name" TEXT NOT NULL,
    "Email" TEXT NOT NULL,
    "Phone" TEXT,
    "Designation" TEXT NOT NULL,
    "DepartmentID" INTEGER NOT NULL,

    CONSTRAINT "Employee_pkey" PRIMARY KEY ("EmployeeID")
);

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
