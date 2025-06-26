// src/auth/dto/create-employee.dto.ts
import { IsEmail, IsNotEmpty, IsString, IsEnum, IsInt } from 'class-validator';

export enum DesignationEnum {
  ADMIN = 'admin',
  MANAGER = 'manager',
  QA = 'qa',
  DEVELOPER = 'developer',
}

export class CreateEmployeeDto {
  @IsNotEmpty()
  @IsString()
  employeeName: string;

  @IsNotEmpty()
  @IsString()
  password: string;

  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  @IsString()
  phone: string;

  @IsNotEmpty()
  @IsInt()
  departmentId: number;

  @IsEnum(DesignationEnum)
  designation: DesignationEnum;
}
