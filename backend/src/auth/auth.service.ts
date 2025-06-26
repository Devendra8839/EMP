import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '../../generated/prisma';
import * as bcrypt from 'bcrypt';
import { UpdateEmployeeDto } from './dto/update-employee.dto';

@Injectable()
export class AuthService {
  private prisma = new PrismaClient();

  async signup(data: {
    name: string;
    email: string;
    department: string;
    designation: string;
    password: string;
    phone: string;
  }) {
    if (!data.name || !data.email || !data.password) {
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
        employeeName: data.name,
        email: data.email,
        department: data.department,
        designation: data.designation,
        phone: data.phone,
        password: hashedPassword,
      },
    });

    return { message: 'Signup successful', employeeId: employee.id };
  }

  async login(data: { email: string; password: string }) {
    const employee = await this.prisma.employee.findUnique({
      where: { email: data.email },
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
        department: employee.department,
        designation: employee.designation,
        phone: employee.phone,
      },
    };
  }

  async getAllEmployees() {
    return this.prisma.employee.findMany({
      select: {
        id: true,
        employeeName: true,
        email: true,
        phone: true,
        department: true,
        designation: true,
      },
    });
  }

  async createDepartment(data: { departmentName: string }) {
    // const existing = await this.prisma.department.findUnique({
    //   where: { departmentName: data.departmentName },
    // });

    // if (existing) {
    //   throw new BadRequestException('Department already exists');
    // }

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

  async getDepartments() {
    return this.prisma.department.findMany({
      select: { departmentName: true },
    });
  }

  async deleteEmployee(id: string) {
    const numericId = parseInt(id, 10);
    if (isNaN(numericId)) {
      throw new BadRequestException('Invalid employee ID');
    }

    const employee = await this.prisma.employee.findUnique({ where: { id: numericId } });

    if (!employee) {
      throw new BadRequestException('Employee not found');
    }

    await this.prisma.employee.delete({ where: { id: numericId } });

    return { message: 'Employee deleted successfully' };
  }

  async updateEmployee(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    return this.prisma.employee.update({
      where: { id: parseInt(id) }, // assuming id is numeric
      data: updateEmployeeDto,
    });
  }

}
