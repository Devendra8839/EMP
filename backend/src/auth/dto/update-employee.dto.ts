import { IsEmail, IsOptional, IsString } from 'class-validator';

export class UpdateEmployeeDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  @IsString()
  employeeName: string;

  @IsOptional()
  @IsString()
  designation?: string; 

  @IsOptional()
  @IsString()
  phone?: string; 

  @IsOptional()
  @IsString()
  department?: string; 
}
