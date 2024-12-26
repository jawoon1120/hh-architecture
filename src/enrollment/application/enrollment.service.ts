import { BadRequestException, Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';

import { Enrollment } from '../domain/enrollment.entity';
import {
  ENROLLMENT_REPOSITORY,
  IEnrollmentRepository,
} from '../infrastructure/enrollment-repository.interface';
import {
  IScheduleService,
  SCHDULE_SERVICE,
} from '@src/lecture/application/schedule-service.interface';
import { IEnrollmentService } from './interface/enrollment-service.interface';

@Injectable()
export class EnrollmentService implements IEnrollmentService {
  constructor(
    @Inject(ENROLLMENT_REPOSITORY)
    private enrollmentRepository: IEnrollmentRepository,

    @Inject(SCHDULE_SERVICE)
    private scheduleService: IScheduleService,
  ) {}

  async validEnrollment(userId: number, scheduleId: number): Promise<void> {
    const existedEnrollmentsAboutSchedule =
      await this.enrollmentRepository.findByScheduleId(scheduleId);
    const existedSchedule = await this.scheduleService.findById(scheduleId);
    const existedUsersEnrollments =
      await this.enrollmentRepository.findByUserId(userId);

    const isFull =
      existedEnrollmentsAboutSchedule.length >=
      existedSchedule.enrollmentCapacity;

    if (isFull) {
      throw new BadRequestException('Schedule is full');
    }

    const isDupEnrollment = existedEnrollmentsAboutSchedule.some(
      (scheduleEnrollment) => scheduleEnrollment.userId === userId,
    );
    if (isDupEnrollment) {
      throw new BadRequestException(
        'Enrollment already exists in this schedule',
      );
    }

    const isDupLecture = existedUsersEnrollments.some(
      (usersEnrollment) =>
        usersEnrollment.lectureId === existedSchedule.lectureId,
    );
    if (isDupLecture) {
      throw new BadRequestException(
        'Enrollment already exists in this lecture',
      );
    }
  }

  async enroll(userId: number, scheduleId: number): Promise<Enrollment> {
    const schedule = await this.scheduleService.findById(scheduleId);
    const enrollment = new Enrollment({
      userId,
      scheduleId,
      lectureId: schedule.lectureId,
      enrolledAt: new Date(),
    });
    return this.enrollmentRepository.enroll(enrollment);
  }

  async getEnrollmentsByUserId(userId: number): Promise<Enrollment[]> {
    return this.enrollmentRepository.findByUserIdWithScheduleAndLecture(userId);
  }
}
