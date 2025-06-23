import { Controller, Get, Post, Patch, Delete, Body, Param } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from '@prisma/client';

@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  create(@Body() data: CreateEmployeeDto): Promise<Employee> {
    return this.employeeService.create(data);
  }

  @Get()
  findAll(): Promise<Employee[]> {
    return this.employeeService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string): Promise<Employee | null> {
    return this.employeeService.findOne(+id);
  }

  @Patch(':id')
  update(
    @Param('id') id: string,
    @Body() data: UpdateEmployeeDto,
  ): Promise<Employee> {
    return this.employeeService.update(+id, data);
  }

  @Delete(':id')
  remove(@Param('id') id: string): Promise<Employee> {
    return this.employeeService.remove(+id);
  }
}
