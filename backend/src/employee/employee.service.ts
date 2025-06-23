import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from '@prisma/client';

@Injectable()
export class EmployeeService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateEmployeeDto): Promise<Employee> {
    return this.prisma.employee.create({
      data: {
        Name: data.Name,
        Email: data.Email,
        Phone: data.Phone,
        Designation: data.Designation,
        Department: { connect: { DepartmentID: data.DepartmentID } },
      },
    });
  }

  async findAll(): Promise<Employee[]> {
    return this.prisma.employee.findMany();
  }

  async findOne(id: number): Promise<Employee | null> {
    return this.prisma.employee.findUnique({ where: { EmployeeID: id } });
  }

  async update(id: number, data: UpdateEmployeeDto): Promise<Employee> {
    return this.prisma.employee.update({
      where: { EmployeeID: id },
      data: {
        Name: data.Name,
        Email: data.Email,
        Phone: data.Phone,
        Designation: data.Designation,
        DepartmentID: data.DepartmentID,
      },
    });
  }

  async remove(id: number): Promise<Employee> {
    return this.prisma.employee.delete({ where: { EmployeeID: id } });
  }
}
