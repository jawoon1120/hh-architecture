import { Between, DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { IScheduleRepository } from './schedule-repository.interface';
import { Schedule } from '../domain/schedule.entity';
import { SCHEDULE_STATUS } from '../domain/schedule-status.enum';

@Injectable()
export class ScheduleRepository
  extends Repository<Schedule>
  implements IScheduleRepository
{
  constructor(private dataSource: DataSource) {
    super(Schedule, dataSource.createEntityManager());
  }

  async findByDate(date: Date): Promise<Schedule[]> {
    const startOfDay = new Date(date);
    startOfDay.setHours(0, 0, 0, 0);

    const endOfDay = new Date(date);
    endOfDay.setHours(23, 59, 59, 999);

    return await this.find({
      where: {
        lectureStartedAt: Between(startOfDay, endOfDay),
      },
      relations: {
        lecture: true,
        enrollments: true,
      },
    });
  }

  async findById(id: number): Promise<Schedule> {
    return await this.findOneBy({ id });
  }

  async updateScheduleStatusAndEnrollmentCount(
    scheduleId: number,
    status: SCHEDULE_STATUS,
    currentEnrollmentCount: number,
  ): Promise<void> {
    await this.update(scheduleId, {
      status,
      currentEnrollmentCount,
    });
  }
}
