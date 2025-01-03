import { Enrollment } from '../domain/enrollment.entity';

export interface IEnrollmentRepository {
  findByScheduleId(scheduleId: number): Promise<Enrollment[]>;
  findByScheduleIdAndUserId(
    scheduleId: number,
    userId: number,
  ): Promise<Enrollment>;
  enroll(enrollment: Enrollment): Promise<Enrollment>;
  findByUserId(userId: number): Promise<Enrollment[]>;
  findByUserIdWithScheduleAndLecture(userId: number): Promise<Enrollment[]>;
}

export const ENROLLMENT_REPOSITORY = Symbol('ENROLLMENT_REPOSITORY');
