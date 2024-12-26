import { Injectable } from '@nestjs/common';
import { Inject } from '@nestjs/common';
import {
  IEnrollmentService,
  ENROLLMENT_SERVICE,
} from './interface/enrollment-service.interface';
import { Enrollment } from '../domain/enrollment.entity';
import {
  IScheduleService,
  SCHDULE_SERVICE,
} from '@src/lecture/application/schedule-service.interface';
import { IEnrollmentFacadeService } from './interface/enrollment-facade-service.interface';
import { Transactional } from 'typeorm-transactional';

@Injectable()
export class EnrollmentFacadeService implements IEnrollmentFacadeService {
  constructor(
    @Inject(ENROLLMENT_SERVICE)
    private enrollmentService: IEnrollmentService,

    @Inject(SCHDULE_SERVICE)
    private scheduleService: IScheduleService,
  ) {}

  @Transactional()
  async enroll(userId: number, scheduleId: number): Promise<Enrollment> {
    await this.enrollmentService.validEnrollment(userId, scheduleId);

    const enrolledEnrollment = await this.enrollmentService.enroll(
      userId,
      scheduleId,
    );

    const schedule = await this.scheduleService.findById(scheduleId);

    await this.scheduleService.updateScheduleStatusAndEnrollmentCount(
      scheduleId,
      schedule.currentEnrollmentCount + 1,
    );
    return enrolledEnrollment;
  }
}
