import { SCHEDULE_STATUS } from '../domain/schedule-status.enum';
import { Schedule } from '../domain/schedule.entity';

export interface IScheduleRepository {
  // status 변경시
  findById(id: number): Promise<Schedule>;
  // 날짜로 조회함 join을 lecture, enrollment 테이블로함
  findByDate(date: Date): Promise<Schedule[]>;
  updateScheduleStatusAndEnrollmentCount(
    scheduleId: number,
    status: SCHEDULE_STATUS,
    enrollmentCount: number,
  ): Promise<void>;
}

export const SCHDULE_REPOSITORY = Symbol('SCHDULE_REPOSITORY');
