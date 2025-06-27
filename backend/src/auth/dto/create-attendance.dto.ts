// src/auth/dto/create-attendance.dto.ts
import { IsEnum, IsInt } from 'class-validator';

export enum LimitedAttendanceStatus {
  PRESENT = 'PRESENT',
  ABSENT = 'ABSENT',
  LEAVE = 'LEAVE',
}

export class CreateAttendanceDto {
  @IsInt()
  employeeId: number;

  @IsEnum(LimitedAttendanceStatus, {
    message: 'status must be one of the following values: PRESENT, ABSENT, LEAVE',
  })
  status: LimitedAttendanceStatus;
}
