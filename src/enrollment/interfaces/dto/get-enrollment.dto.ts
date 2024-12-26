import { Transform } from 'class-transformer';
import { IsDate, IsNumber, IsString } from 'class-validator';

export class GetEnrollmentResponseDto {
  @IsNumber()
  userId: number;

  @IsNumber()
  scheduleId: number;

  @IsNumber()
  lectureId: number;

  @IsString()
  lectureTitle: string;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  lectureStartedAt: Date;

  @IsDate()
  @Transform(({ value }) => new Date(value))
  lectureEndedAt: Date;

  @IsString()
  instructor: string;

  @IsNumber()
  enrollmentCapacity: number;

  @IsNumber()
  currentEnrollmentCount: number;

  @IsString()
  status: string;
}
