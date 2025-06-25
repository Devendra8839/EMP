import { Controller, Post, Body } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Get } from '@nestjs/common';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('signup')
  signup(@Body() body: any) {
    return this.authService.signup(body);
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

  @Get('departments')
  async getDepartments() {
    return this.authService.getDepartments();
  }

}
