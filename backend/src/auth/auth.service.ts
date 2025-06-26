import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import * as bcrypt from 'bcrypt';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Injectable()
export class AuthService {
  private prisma = new PrismaClient();

  async signup(data: CreateEmployeeDto) {
    if (!data.employeeName || !data.email || !data.password) {
      throw new Error('Missing required fields');
    }

    const employee = await this.prisma.employee.create({
      data: {
        employeeName: data.employeeName,
        email: data.email,
        password: data.password,
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

    return employee;
  }


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
