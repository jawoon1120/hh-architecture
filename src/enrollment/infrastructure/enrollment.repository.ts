import { DataSource, Repository } from 'typeorm';
import { Injectable } from '@nestjs/common';
import { Enrollment } from '../domain/enrollment.entity';
import { IEnrollmentRepository } from './enrollment-repository.interface';

@Injectable()
export class EnrollmentRepository
  extends Repository<Enrollment>
  implements IEnrollmentRepository
{
  constructor(private dataSource: DataSource) {
    super(Enrollment, dataSource.createEntityManager());
  }
  enroll(enrollment: Enrollment): Promise<Enrollment> {
    return this.save(enrollment);
  }
  findByScheduleId(scheduleId: number): Promise<Enrollment[]> {
    return this.find({ where: { scheduleId } });
  }
  findByUserId(userId: number): Promise<Enrollment[]> {
    return this.find({ where: { userId } });
  }
  findByScheduleIdAndUserId(
    scheduleId: number,
    userId: number,
  ): Promise<Enrollment> {
    return this.findOneBy({ scheduleId, userId });
  }
}
