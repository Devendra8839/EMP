import { Controller, Post, Body, Get, Delete, Param, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

 @Post('signup')
  signup(@Body() body: CreateEmployeeDto) {
    return this.authService.signup(body);
  }

  @Post('login')
  login(@Body() body: any) {
    console.log('Login attempt:', body);  // Add this
    return this.authService.login(body);
  }

  @Get('employees')
  getAllEmployees() {
    return this.authService.getAllEmployees();
  }

  @Post('create-department')
  async createDepartment(@Body() data: { departmentName: string }) {
    return this.authService.createDepartment(data);
  }

  @Get('departments')
  async getDepartments() {
    return this.authService.getDepartments();
  }

  @Delete('employees/:id')
  async deleteEmployee(@Param('id') id: string) {
    return this.authService.deleteEmployee(id);
  }

  @Put('employees/:id')
  async updateEmployee(
    @Param('id') id: string,
    @Body() updateEmployeeDto: UpdateEmployeeDto
  ) {
    return this.authService.updateEmployee(id, updateEmployeeDto);
  }


}
