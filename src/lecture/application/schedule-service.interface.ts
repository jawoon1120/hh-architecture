import { Schedule } from '../domain/schedule.entity';
import { AvailableScheduleDto } from './dto/available-schedule.dto';

export interface IScheduleService {
  findById(id: number): Promise<Schedule>;
  findByDate(date: Date): Promise<Schedule[]>;
  updateScheduleStatusAndEnrollmentCount(scheduleId: number): Promise<number>;
  findEnrollAvailableSchedule(
    targetDate: Date,
    userId: number,
  ): Promise<AvailableScheduleDto[]>;
}

export const SCHDULE_SERVICE = Symbol('SCHDULE_SERVICE');
