import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentFacadeService } from './enrollment.facade-service';
import { ENROLLMENT_SERVICE } from './interface/enrollment-service.interface';
import { SCHDULE_SERVICE } from '@src/lecture/application/schedule-service.interface';
import { Schedule } from '@src/lecture/domain/schedule.entity';
import { Enrollment } from '../domain/enrollment.entity';
import { SCHEDULE_STATUS } from '@src/lecture/domain/schedule-status.enum';

import { DataSource } from 'typeorm';

describe('EnrollmentFacadeService', () => {
  let service: EnrollmentFacadeService;
  let mockEnrollmentService: any;
  let mockScheduleService: any;

  beforeEach(async () => {
    mockEnrollmentService = {
      validEnrollment: jest.fn(),
      enroll: jest.fn(),
      getEnrollmentsByUserId: jest.fn(),
    };

    mockScheduleService = {
      findById: jest.fn(),
      updateScheduleStatusAndEnrollmentCount: jest.fn(),
    };

    const mockQueryRunner = {
      connect: jest.fn(),
      startTransaction: jest.fn(),
      commitTransaction: jest.fn(),
      rollbackTransaction: jest.fn(),
      release: jest.fn(),
    };

    const mockDataSource = {
      createQueryRunner: jest.fn().mockReturnValue(mockQueryRunner),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentFacadeService,
        {
          provide: ENROLLMENT_SERVICE,
          useValue: mockEnrollmentService,
        },
        {
          provide: SCHDULE_SERVICE,
          useValue: mockScheduleService,
        },
        {
          provide: DataSource,
          useValue: mockDataSource,
        },
      ],
    }).compile();

    service = module.get<EnrollmentFacadeService>(EnrollmentFacadeService);
  });

  describe('enroll', () => {
    it('수강 신청이 성공적으로 이루어져야 함', async () => {
      // Given
      const userId = 1;
      const scheduleId = 1;
      const lectureId = 1;
      const mockSchedule = new Schedule({
        id: scheduleId,
        lectureId: lectureId,
        lectureStartedAt: new Date(),
        lectureEndedAt: new Date(),
        enrollmentCapacity: 30,
        currentEnrollmentCount: 0,
        status: SCHEDULE_STATUS.OPEN_SEATS,
      });

      const mockEnrollment = new Enrollment({
        userId,
        scheduleId,
        lectureId: lectureId,
        enrolledAt: new Date(),
      });

      mockEnrollmentService.validEnrollment.mockResolvedValue(undefined);
      mockEnrollmentService.enroll.mockResolvedValue(mockEnrollment);
      mockScheduleService.findById.mockResolvedValue(mockSchedule);
      mockScheduleService.updateScheduleStatusAndEnrollmentCount.mockResolvedValue(
        1,
      );

      // When
      const result = await service.enroll(userId, scheduleId);

      // Then
      expect(result).toBe(mockEnrollment);
    });

    it('스케줄 업데이트가 실패할 경우 에러가 발생해야 함', async () => {
      // Given
      const userId = 1;
      const scheduleId = 1;
      const lectureId = 1;

      const mockEnrollment = new Enrollment({
        userId,
        scheduleId,
        lectureId: lectureId,
        enrolledAt: new Date(),
      });

      const mockSchedule = new Schedule({
        id: scheduleId,
        lectureId: lectureId,
        lectureStartedAt: new Date(),
        lectureEndedAt: new Date(),
        enrollmentCapacity: 30,
        currentEnrollmentCount: 0,
        status: SCHEDULE_STATUS.OPEN_SEATS,
      });

      mockEnrollmentService.validEnrollment.mockResolvedValue(undefined);
      mockEnrollmentService.enroll.mockResolvedValue(mockEnrollment);
      mockScheduleService.findById.mockResolvedValue(mockSchedule);
      mockScheduleService.updateScheduleStatusAndEnrollmentCount.mockResolvedValue(
        0,
      );

      // When & Then
      await expect(service.enroll(userId, scheduleId)).rejects.toThrow(
        'Update schedule failed',
      );
    });
  });

  describe('getEnrollmentsByUserId', () => {
    it('사용자의 수강 신청 목록을 조회해야 함', async () => {
      // Given
      const userId = 1;
      const mockEnrollments = [
        new Enrollment({
          userId,
          scheduleId: 1,
          lectureId: 1,
          enrolledAt: new Date(),
        }),
      ];

      mockEnrollmentService.getEnrollmentsByUserId.mockResolvedValue(
        mockEnrollments,
      );

      // When
      const result = await service.getEnrollmentsByUserId(userId);

      // Then
      expect(result).toBe(mockEnrollments);
    });
  });
});
