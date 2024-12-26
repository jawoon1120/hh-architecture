import { Enrollment } from '../../domain/enrollment.entity';

export interface IEnrollmentService {
  validScheduleIsFull(scheduleId: number): Promise<boolean>;
  enroll(userId: number, scheduleId: number): Promise<Enrollment>;
}

export const ENROLLMENT_SERVICE = Symbol('ENROLLMENT_SERVICE');
