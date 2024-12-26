import { Inject, Injectable } from '@nestjs/common';
import {
  IScheduleRepository,
  SCHDULE_REPOSITORY,
} from '../infrastructure/schedule-repository.interface';
import { IScheduleService } from './schedule-service.interface';
import { Schedule } from '../domain/schedule.entity';
import { SCHEDULE_STATUS } from '../domain/schedule-status.enum';
import { AvailableScheduleDto } from './dto/available-schedule.dto';

@Injectable()
export class ScheduleService implements IScheduleService {
  constructor(
    @Inject(SCHDULE_REPOSITORY) private scheduleRepository: IScheduleRepository,
  ) {}

  async findById(id: number): Promise<Schedule> {
    return await this.scheduleRepository.findById(id);
  }

  async findByDate(date: Date): Promise<Schedule[]> {
    return await this.scheduleRepository.findByDate(date);
  }

  async updateScheduleStatusAndEnrollmentCount(
    scheduleId: number,
    currentEnrollmentCount: number,
  ): Promise<void> {
    const schedule = await this.findById(scheduleId);

    if (!schedule) {
      throw new Error('Schedule not found');
    }

    return await this.scheduleRepository.updateScheduleStatusAndEnrollmentCount(
      scheduleId,
      currentEnrollmentCount >= schedule.enrollmentCapacity
        ? SCHEDULE_STATUS.FULL
        : SCHEDULE_STATUS.OPEN_SEATS,
      currentEnrollmentCount,
    );
  }

  async findEnrollAvailableSchedule(
    targetDate: Date,
    userId: number,
  ): Promise<AvailableScheduleDto[]> {
    const disabledScheduleCondition = (schedule: Schedule) => {
      return (
        schedule.enrollments.some(
          (enrollment) => enrollment.userId === userId,
        ) || schedule.enrollmentCapacity <= schedule.currentEnrollmentCount
      );
    };

    const schedules = await this.scheduleRepository.findByDate(targetDate);
    return schedules.map((schedule) => {
      return {
        id: schedule.id,
        lectureStartedAt: schedule.lectureStartedAt,
        lectureEndedAt: schedule.lectureEndedAt,
        enrollmentCapacity: schedule.enrollmentCapacity,
        enrollmentCount: schedule.currentEnrollmentCount,
        lecture: {
          title: schedule.lecture.title,
          instructor: schedule.lecture.instructor,
        },
        disabled: disabledScheduleCondition(schedule),
      };
    });
  }
}
