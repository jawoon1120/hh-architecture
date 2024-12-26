import { DataSource, Repository } from 'typeorm';
import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Enrollment } from '../domain/enrollment.entity';
import { IEnrollmentRepository } from './enrollment-repository.interface';
import { Schedule } from '@src/lecture/domain/schedule.entity';

@Injectable()
export class EnrollmentRepository
  extends Repository<Enrollment>
  implements IEnrollmentRepository
{
  constructor(private dataSource: DataSource) {
    super(Enrollment, dataSource.createEntityManager());
  }
  async enroll(enrollment: Enrollment): Promise<Enrollment> {
    return await this.dataSource.transaction(async (manager) => {
      // 락을 걸고 스케줄 조회
      const schedule = await manager.findOne(Schedule, {
        where: { id: enrollment.scheduleId },
        lock: { mode: 'pessimistic_write' },
      });

      if (!schedule) {
        throw new NotFoundException('Schedule not found');
      }

      // 수강 가능 여부 검증
      if (schedule.currentEnrollmentCount >= schedule.enrollmentCapacity) {
        throw new BadRequestException('Schedule is full');
      }

      // enrollment에 대한 비관적 락 설정
      const existingEnrollment = await manager.findOne(Enrollment, {
        where: { userId: enrollment.userId, scheduleId: enrollment.scheduleId },
        lock: { mode: 'pessimistic_read' },
      });

      if (existingEnrollment) {
        throw new BadRequestException('Enrollment already exists');
      }

      // 수강 인원 증가 및 상태 업데이트
      schedule.currentEnrollmentCount += 1;
      await manager.save(schedule);

      // 수강 신청 저장
      return await manager.save(enrollment);
    });
  }

  findByScheduleId(scheduleId: number): Promise<Enrollment[]> {
    return this.find({ where: { scheduleId } });
  }

  findByUserId(userId: number): Promise<Enrollment[]> {
    return this.find({
      where: { userId },
    });
  }
  findByScheduleIdAndUserId(
    scheduleId: number,
    userId: number,
  ): Promise<Enrollment> {
    return this.findOneBy({ scheduleId, userId });
  }
  findByUserIdWithScheduleAndLecture(userId: number): Promise<Enrollment[]> {
    return this.find({
      where: { userId },
      relations: ['schedule', 'lecture'],
    });
  }
}
