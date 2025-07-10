import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { SignupDto } from './dto/signup.dto';
import * as crypto from 'crypto';


@Injectable()
export class AuthService {
  private prisma = new PrismaClient();

 
  async login(data: { email: string; password: string }) {
    const { email, password } = data;

    const employee = await this.prisma.employee.findUnique({
      where: { Email: email },
    });

    if (!employee) {
      throw new BadRequestException('Invalid email or password');
    }

    const passwordMatch = await bcrypt.compare(password, employee.Password);
    if (!passwordMatch) {
      throw new BadRequestException('Invalid email or password');
    }

    return {
      message: 'Login successful',
      employee: {
        EmployeeID: employee.EmployeeID,
        employeeName: employee.Name,
        email: employee.Email,
        designation: employee.Designation,
        phone: employee.Phone,
        departmentID: employee.DepartmentID,
      },
    };
  }

  async getAllEmployees() {
    return this.prisma.employee.findMany({
      select: {
        EmployeeID: true,
        Name: true,
        Email: true,
        Phone: true,
        Designation: true,
        DepartmentID: true,
        Password: true,
        Department: {
          select: {
            Name: true,
          },
        },
      },
    });
  }

  async createDepartment(data: { departmentName: string }) {
    const existing = await this.prisma.department.findUnique({
      where: { Name: data.departmentName },
    });

    if (existing) {
      throw new BadRequestException('Department already exists');
    }

    const department = await this.prisma.department.create({
      data: { Name: data.departmentName },
    });

    return { message: 'Department created successfully', department };
  }

  async getDepartments() {
    return this.prisma.department.findMany({ select: { Name: true } });
  }

  async deleteEmployee(id: string) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid employee ID');
    }

    const employee = await this.prisma.employee.findUnique({
      where: { EmployeeID: numericId },
    });

    if (!employee) {
      throw new BadRequestException('Employee not found');
    }

    await this.prisma.employee.delete({
      where: { EmployeeID: numericId },
    });

    return { message: 'Employee deleted successfully' };
  }

  async updateEmployee(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid employee ID');
    }

    const { employeeName, email, phone, designation, department } = updateEmployeeDto;

    const dept = await this.prisma.department.findUnique({
      where: { Name: department },
    });

    if (!dept) {
      throw new BadRequestException('Department not found');
    }

    const updated = await this.prisma.employee.update({
      where: { EmployeeID: numericId },
      data: {
        Name: employeeName, 
        Email: email,
        Designation: designation,
        Phone: phone,
        DepartmentID: dept.DepartmentID,
      },
    });
    return { message: 'Employee updated successfully', employee: updated };
  }

  // employe create

  async signup(dto: SignupDto) {
    const existing = await this.prisma.employee.findUnique({ where: { Email: dto.email } });
    if (existing) throw new BadRequestException('Email already in use');

    const dept = await this.prisma.department.findUnique({ where: { Name: dto.department } });
    if (!dept) throw new BadRequestException('Department not found');

    const hashedPassword = await bcrypt.hash(dto.password, 10);
    const employee = await this.prisma.employee.create({
      data: {
        Name: dto.employeeName,
        Email: dto.email,
        Phone: dto.phone,
        Designation: dto.designation,
        Password: hashedPassword,
        DepartmentID: dept.DepartmentID,
      },
    });

  return { message: 'Signup successful', employeeId: employee.EmployeeID };
}
 
// create employe

  async createEmployee(body: CreateEmployeeDto) {
    const { employeeName, email, phone, department, designation } = body;

    const existing = await this.prisma.employee.findUnique({
      where: { Email: email },
    });

    if (existing) {
      throw new BadRequestException('Email already exists');
    }

    const dept = await this.prisma.department.findUnique({
      where: { Name: department },
    });

    if (!dept) {
      throw new BadRequestException('Department not found');
    }

    const defaultPassword = await bcrypt.hash('Temp@123', 10);

    const employee = await this.prisma.employee.create({
      data: {
        Name: employeeName,
        Email: email,
        Phone: phone,
        Designation: designation,
        Password: defaultPassword,
        DepartmentID: dept.DepartmentID,
      },
    });

    return {
      message: 'Employee created successfully',
      employeeId: employee.EmployeeID,
    };
  }

// forget_password

 async forgotPassword(email: string) {
  const user = await this.prisma.employee.findUnique({ where: { Email: email } });
    if (!user) throw new NotFoundException('User not found');

    const token = crypto.randomBytes(32).toString('hex');
    const expires = new Date(Date.now() + 15 * 60 * 1000); // 15 mins

    await this.prisma.passwordResetToken.create({
      data: {
        email,
        token,
        expiresAt: expires,
      },
    });

    // TODO: send `http://localhost:3000/reset-password?token=...` via email
    return { message: 'Reset link sent to email (simulated)', token }; // remove token in prod
  }

  async resetPassword(token: string, newPassword: string) {
    const record = await this.prisma.passwordResetToken.findUnique({ where: { token } });

    if (!record || record.expiresAt < new Date())
      throw new BadRequestException('Invalid or expired token');

    const hashed = await bcrypt.hash(newPassword, 10);

    await this.prisma.employee.update({
      where: { Email: record.email },
      data: { Password: hashed },
    });

    await this.prisma.passwordResetToken.delete({ where: { token } });

    return { message: 'Password updated successfully' };
  }
  async getManagers() {
    return this.prisma.employee.findMany({
      where: {
        Designation: 'manager',
      },
      select: {
        EmployeeID: true,
        Name: true,
      },
    });
  }
}
  

