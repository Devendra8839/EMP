import { Controller, Post, Body, Get, Delete, Param, Put } from '@nestjs/common';
import { AuthService } from './auth.service';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { SignupDto } from './dto/signup.dto';
import { ForgotPasswordDto } from './dto/forgot-password.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
    signup(@Body() body: SignupDto) {
      return this.authService.signup(body);
    }

  @Post('create-employee')
  async createEmployee(@Body() body: CreateEmployeeDto) {
    return this.authService.createEmployee(body);
  }

  @Post('login')
  login(@Body() body: any) {
    return this.authService.login(body);
  }

  @Get('employees')
  getAllEmployees() {
    return this.authService.getAllEmployees();
  }

  @Post('create-department')
  async createDepartment(@Body() body: { departmentName: string }) {
    return this.authService.createDepartment(body);
  }

  // @Post('create-employee')
  // async createEmployee(@Body() body: { departmentName: string }) {
  //   return this.authService.createDepartment(body);
  // }

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

  // forgot_password
  @Post('forgot-password')
  async forgotPassword(@Body() body: ForgotPasswordDto) {
    return this.authService.forgotPassword(body.email);
  }

  @Post('reset-password')
  async resetPassword(@Body() body: ResetPasswordDto) {
    return this.authService.resetPassword(body.token, body.newPassword);
  }

  @Get('managers')
  async getManagers() {
    return this.authService.getManagers();
  }


}
