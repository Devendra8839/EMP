import { Injectable, BadRequestException, NotFoundException } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Injectable()
export class ProjectService {
  private prisma = new PrismaClient();

  private parseDate(dateStr: string): Date {
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) throw new BadRequestException(`Invalid date: ${dateStr}`);
    return date;
  }

  async createProject(dto: CreateProjectDto) {
    const manager = await this.prisma.employee.findUnique({
      where: { EmployeeID: dto.managerId },
    });

    if (!manager) throw new NotFoundException('Manager not found');

    const project = await this.prisma.project.create({
      data: {
        Name: dto.name,
        StartDate: this.parseDate(dto.startDate),
        EndDate: this.parseDate(dto.endDate),
        ManagerID: dto.managerId,
      },
    });

    return { message: 'Project created successfully', project };
  }

  async getAllProjects() {
    return this.prisma.project.findMany({
      include: {
        Manager: {
          select: {
            Name: true,
            Email: true,
          },
        },
      },
    });
  }

  async getProjectById(id: number) {
    if (!id || typeof id !== 'number' || isNaN(id)) {
        throw new BadRequestException('Invalid project ID');
    }

    const project = await this.prisma.project.findUnique({
        where: {
        ProjectID: id,
        },
        include: {
        Manager: {
            select: {
            Name: true,
            Email: true,
            },
        },
        },
    });

    if (!project) throw new NotFoundException('Project not found');
    return project;
 }


  async updateProject(id: number, dto: UpdateProjectDto) {
    // Optional: validate manager existence here if managerId is passed
    return this.prisma.project.update({
      where: { ProjectID: id },
      data: {
        Name: dto.name,
        StartDate: this.parseDate(dto.startDate),
        EndDate: this.parseDate(dto.endDate),
        ManagerID: dto.managerId,
      },
    });
  }

  async deleteProject(id: number) {
    await this.getProjectById(id); // Ensures project exists before deletion
    await this.prisma.project.delete({ where: { ProjectID: id } });
    return { message: 'Project deleted successfully' };
  }

  async getManagerProjects() {
    return this.prisma.employee.findMany({
      where: { Designation: 'manager' },
      select: {
        Name: true,
        EmployeeID: true,
        managedProjects: {
          select: {
            ProjectID: true,
            Name: true,
            StartDate: true,
            EndDate: true,
          },
        },
      },
    });
  }
}
