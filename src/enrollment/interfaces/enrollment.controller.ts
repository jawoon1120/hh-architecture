import { Body, Controller, Get, Inject, Post, Query } from '@nestjs/common';
import { CreateEnrollmentRequestDto } from './dto/create-enrollment.dto';
import {
  ENROLLMENT_FACADE_SERVICE,
  IEnrollmentFacadeService,
} from '../application/interface/enrollment-facade-service.interface';
import { GetEnrollmentResponseDto } from './dto/get-enrollment.dto';

@Controller('enrollment')
export class EnrollmentController {
  constructor(
    @Inject(ENROLLMENT_FACADE_SERVICE)
    private enrollmentFacadeService: IEnrollmentFacadeService,
  ) {}

  @Post()
  async enroll(@Body() body: CreateEnrollmentRequestDto) {
    return await this.enrollmentFacadeService.enroll(
      body.userId,
      body.scheduleId,
    );
  }

  @Get()
  async getEnrollmentsByUserId(
    @Query('userId') userId: number,
  ): Promise<GetEnrollmentResponseDto[]> {
    const enrollments =
      await this.enrollmentFacadeService.getEnrollmentsByUserId(userId);

    const dto = enrollments.map((enrollment) => {
      return {
        userId: enrollment.userId,
        scheduleId: enrollment.scheduleId,
        lectureId: enrollment.lectureId,
        lectureTitle: enrollment.lecture.title,
        lectureStartedAt: enrollment.schedule.lectureStartedAt,
        lectureEndedAt: enrollment.schedule.lectureEndedAt,
        instructor: enrollment.lecture.instructor,
        enrollmentCapacity: enrollment.schedule.enrollmentCapacity,
        currentEnrollmentCount: enrollment.schedule.currentEnrollmentCount,
        status: enrollment.schedule.status,
      };
    });

    return dto;
  }
}
