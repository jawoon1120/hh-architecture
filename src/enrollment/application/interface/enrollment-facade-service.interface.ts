import { Enrollment } from '../../domain/enrollment.entity';

export interface IEnrollmentFacadeService {
  enroll(userId: number, scheduleId: number): Promise<Enrollment>;
}

export const ENROLLMENT_FACADE_SERVICE = Symbol('ENROLLMENT_FACADE_SERVICE');
