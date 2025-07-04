import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { AttendanceStatus } from '@prisma/client';

@Injectable()
export class AuthService {
  private prisma = new PrismaClient();

  // SIGNUP
  async signup(data: CreateEmployeeDto) {
    if (!data.employeeName || !data.email || !data.password) {
      throw new BadRequestException('Missing required fields');
    }

    const existing = await this.prisma.employee.findUnique({
      where: { email: data.email },
    });

    if (existing) {
      throw new BadRequestException('Email already in use');
    }

    const hashedPassword = await bcrypt.hash(data.password, 10);

    const employee = await this.prisma.employee.create({
      data: {
        employeeName: data.employeeName,
        email: data.email,
        password: hashedPassword,
        phone: data.phone,
        designation: data.designation,
        department: {
          connect: { id: data.departmentId },
        },
      },
      include: {
        department: true,
      },
    });

    return {
      message: 'Employee created successfully',
      employee: {
        id: employee.id,
        name: employee.employeeName,
        email: employee.email,
        department: employee.department?.departmentName,
        designation: employee.designation,
        phone: employee.phone,
      },
    };
  }

  // LOGIN
  async login(data: { email: string; password: string }) {
    const employee = await this.prisma.employee.findUnique({
      where: { email: data.email },
      include: { department: true },
    });

    if (!employee) {
      throw new BadRequestException('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(data.password, employee.password);
    if (!passwordMatch) {
      throw new BadRequestException('Invalid email or password');
    }

    return {
      message: 'Login successful',
      employee: {
        id: employee.id,
        name: employee.employeeName,
        email: employee.email,
        department: employee.department?.departmentName,
        designation: employee.designation,
        phone: employee.phone,
      },
    };
  }

  // GET ALL EMPLOYEES
  async getAllEmployees() {
    return this.prisma.employee.findMany({
      select: {
        id: true,
        employeeName: true,
        email: true,
        phone: true,
        designation: true,
        department: {
          select: {
            departmentName: true,
          },
        },
      },
    });
  }

  // CREATE DEPARTMENT
  async createDepartment(data: { departmentName: string }) {
    const existing = await this.prisma.department.findUnique({
      where: { departmentName: data.departmentName },
    });

    if (existing) {
      throw new BadRequestException('Department already exists');
    }

    const department = await this.prisma.department.create({
      data: {
        departmentName: data.departmentName,
      },
    });

    return {
      message: 'Department created successfully',
      department,
    };
  }

  // GET DEPARTMENTS
  async getDepartments() {
    return this.prisma.department.findMany();
  }

  // DELETE EMPLOYEE
  async deleteEmployee(id: string) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid employee ID');
    }

    const employee = await this.prisma.employee.findUnique({
      where: { id: numericId },
    });

    if (!employee) {
      throw new BadRequestException('Employee not found');
    }

    await this.prisma.employee.delete({ where: { id: numericId } });

    return { message: 'Employee deleted successfully' };
  }

  // UPDATE EMPLOYEE
  async updateEmployee(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    return this.prisma.employee.update({
      where: { id: parseInt(id) },
      data: updateEmployeeDto,
    });
  }

  async markAttendance(employeeId: number, status: AttendanceStatus) {
    const today = new Date();
    const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    // Check if already marked
    const existing = await this.prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: dateOnly,
        }
      }
    });

    if (existing) {
      // Optionally update status
      return await this.prisma.attendance.update({
        where: {
          employeeId_date: {
            employeeId,
            date: dateOnly,
          }
        },
        data: {
          attendanceStatus: status,
          checkInTime: new Date(),
        }
      });
    }

    // Create new attendance
    return await this.prisma.attendance.create({
      data: {
        employeeId,
        date: dateOnly,
        attendanceStatus: status,
        checkInTime: new Date(),
      }
    });
  }

  async checkOutAttendance(employeeId: number) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const attendance = await this.prisma.attendance.findFirst({
      where: {
        employeeId,
        date: today,
      },
    });

    if (!attendance) {
      throw new BadRequestException('No attendance found for today.');
    }

    if (attendance.checkOutTime) {
      throw new BadRequestException('Already checked out.');
    }

    return await this.prisma.attendance.update({
      where: { id: attendance.id },
      data: { checkOutTime: new Date() },
    });
  }

  async getEmployeeWithAttendanceStatus(employeeId: number) {
    const today = new Date();
    const dateOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate());

    const employee = await this.prisma.employee.findUnique({
      where: { id: employeeId },
      include: {
        department: true,
      },
    });

    const attendance = await this.prisma.attendance.findUnique({
      where: {
        employeeId_date: {
          employeeId,
          date: dateOnly,
        }
      }
    });

    return {
      ...employee,
      attendanceStatus: attendance ? attendance.attendanceStatus : 'Not Marked',
    };
  }

  async getEmployeeById(id: string) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid employee ID');
    }

    const employee = await this.prisma.employee.findUnique({
      where: { id: numericId },
      include: { department: true },
    });

    if (!employee) {
      throw new BadRequestException('Employee not found');
    }

    return employee;
  }

}
