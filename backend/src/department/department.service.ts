import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateDepartmentDto } from './dto/create-department.dto';
import { UpdateDepartmentDto } from './dto/update-department.dto';
import { Department } from '@prisma/client';

@Injectable()
export class DepartmentService {
  constructor(private readonly prisma: PrismaService) {}

  async create(createDepartmentDto: CreateDepartmentDto): Promise<Department> {
    return this.prisma.department.create({
      data: {
        Name: createDepartmentDto.Name,
      },
    });
  }

  async findAll(): Promise<Department[]> {
    return this.prisma.department.findMany();
  }

  async findOne(id: number): Promise<Department | null> {
    return this.prisma.department.findUnique({
      where: { DepartmentID: id },
    });
  }

  async update(id: number, updateDepartmentDto: UpdateDepartmentDto): Promise<Department> {
    return this.prisma.department.update({
      where: { DepartmentID: id },
      data: {
        Name: updateDepartmentDto.Name,
      },
    });
  }

  async remove(id: number): Promise<Department> {
    return this.prisma.department.delete({
      where: { DepartmentID: id },
    });
  }
}
