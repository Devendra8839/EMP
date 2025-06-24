import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { EmployeeModule } from './employee/employee.module';
import { DepartmentModule } from './department/department.module';

@Module({
  imports: [EmployeeModule, DepartmentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
