import { IsString, IsEmail, IsOptional, IsInt } from 'class-validator';

export class CreateEmployeeDto {
  @IsString()
  Name: string;

  @IsEmail()
  Email: string;

  @IsOptional()
  @IsString()
  Phone?: string;

  @IsString()
  Designation: string;

  @IsInt()
  DepartmentID: number;
}
