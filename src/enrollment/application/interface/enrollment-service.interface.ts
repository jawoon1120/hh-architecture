import { Enrollment } from '../../domain/enrollment.entity';

export interface IEnrollmentService {
  validEnrollment(userId: number, scheduleId: number): Promise<void>;
  enroll(userId: number, scheduleId: number): Promise<Enrollment>;
  getEnrollmentsByUserId(userId: number): Promise<Enrollment[]>;
}

export const ENROLLMENT_SERVICE = Symbol('ENROLLMENT_SERVICE');
