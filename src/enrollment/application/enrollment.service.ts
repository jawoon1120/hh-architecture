import { Injectable } from '@nestjs/common';
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

  async validScheduleIsFull(scheduleId: number): Promise<boolean> {
    const existedEnrollments =
      await this.enrollmentRepository.findByScheduleId(scheduleId);
    const existedSchedule = await this.scheduleService.findById(scheduleId);
    return existedEnrollments.length >= existedSchedule.enrollmentCapacity;
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
}
