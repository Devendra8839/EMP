import { IsEmail, IsEnum, IsNotEmpty, IsString } from 'class-validator';

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
  @IsEmail()
  email: string; 

  @IsNotEmpty()
  @IsString()
  password: string;
  
  @IsNotEmpty()
  @IsString()
  phone: string; 

  @IsNotEmpty({ message: 'Department is required' })
  @IsString()
  department: string; 

  @IsEnum(DesignationEnum, {
    message: `designation must be one of: ${Object.values(DesignationEnum).join(', ')}`,
  })
  designation: DesignationEnum; 
}


