import { Controller, Get, Post, Put, Delete, Body, Param } from '@nestjs/common';
import { ProjectService } from './project.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';

@Controller('project')
export class ProjectController {
  constructor(private readonly projectService: ProjectService) {}

  @Post()
  async createProject(@Body() dto: CreateProjectDto) {
    return this.projectService.createProject(dto);
  }

  @Get()
  async getAllProjects() {
    return this.projectService.getAllProjects();
  }

  @Get('manager-projects')
  async getManagerProjects() {
    return this.projectService.getManagerProjects();
  }

  @Get(':id')
  async getProject(@Param('id') id: string) {
    return this.projectService.getProjectById(Number(id));
  }

  @Put(':id')
  async updateProject(@Param('id') id: string, @Body() body: UpdateProjectDto) {
    return this.projectService.updateProject(+id, body);
  }

  @Delete(':id')
  async deleteProject(@Param('id') id: string) {
    return this.projectService.deleteProject(+id);
  }
}
