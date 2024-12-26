import { BadRequestException, Injectable } from '@nestjs/common';
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
import { DataSource } from 'typeorm';

@Injectable()
export class EnrollmentFacadeService implements IEnrollmentFacadeService {
  constructor(
    @Inject(ENROLLMENT_SERVICE)
    private enrollmentService: IEnrollmentService,

    @Inject(SCHDULE_SERVICE)
    private scheduleService: IScheduleService,

    private dataSource: DataSource,
  ) {}

  async enroll(userId: number, scheduleId: number): Promise<Enrollment> {
    await this.enrollmentService.validEnrollment(userId, scheduleId);

    const addedEnrollment = await this.enrollmentService.enroll(
      userId,
      scheduleId,
    );

    const updatedSchedule =
      await this.scheduleService.updateScheduleStatusAndEnrollmentCount(
        scheduleId,
      );

    if (updatedSchedule === 0) {
      throw new BadRequestException('Update schedule failed');
    }

    return addedEnrollment;
  }

  async getEnrollmentsByUserId(userId: number): Promise<Enrollment[]> {
    return this.enrollmentService.getEnrollmentsByUserId(userId);
  }
}
