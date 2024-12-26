import { IsNumber } from 'class-validator';

export class CreateEnrollmentRequestDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  scheduleId: number;
}
