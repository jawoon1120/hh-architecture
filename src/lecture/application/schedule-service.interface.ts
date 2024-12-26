import { Schedule } from '../domain/schedule.entity';
import { AvailableScheduleDto } from './dto/available-schedule.dto';

export interface IScheduleService {
  // status 변경시
  findById(id: number): Promise<Schedule>;
  // 날짜로 조회함 join을 lecture, enrollment 테이블로함
  findByDate(date: Date): Promise<Schedule[]>;
  // 날짜로 조회함 join을 lecture, enrollment 테이블로함
  updateScheduleStatusAndEnrollmentCount(
    scheduleId: number,
    currentEnrollmentCount: number,
  ): Promise<void>;
  findEnrollAvailableSchedule(
    targetDate: Date,
    userId: number,
  ): Promise<AvailableScheduleDto[]>;
}

export const SCHDULE_SERVICE = Symbol('SCHDULE_SERVICE');
