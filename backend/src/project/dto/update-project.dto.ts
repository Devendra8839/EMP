import { IsString, IsDateString, IsInt } from 'class-validator';
export class UpdateProjectDto {
  @IsString()
  name: string;

  @IsDateString()
  startDate: string;

  @IsDateString()
  endDate: string;

  @IsInt()
  managerId: number;
}
