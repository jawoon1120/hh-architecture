import { Test, TestingModule } from '@nestjs/testing';
import { BadRequestException } from '@nestjs/common';
import { EnrollmentService } from './enrollment.service';
import {
  ENROLLMENT_REPOSITORY,
  IEnrollmentRepository,
} from '../infrastructure/enrollment-repository.interface';
import {
  IScheduleService,
  SCHDULE_SERVICE,
} from '@src/lecture/application/schedule-service.interface';
import { Enrollment } from '../domain/enrollment.entity';
import { Schedule } from '@src/lecture/domain/schedule.entity';
import { SCHEDULE_STATUS } from '@src/lecture/domain/schedule-status.enum';

describe('EnrollmentService', () => {
  let service: EnrollmentService;
  let mockEnrollmentRepository: jest.Mocked<IEnrollmentRepository>;
  let mockScheduleService: jest.Mocked<IScheduleService>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        EnrollmentService,
        {
          provide: ENROLLMENT_REPOSITORY,
          useValue: {
            findByScheduleId: jest.fn(),
            findByUserId: jest.fn(),
            enroll: jest.fn(),
          },
        },
        {
          provide: SCHDULE_SERVICE,
          useValue: {
            findById: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<EnrollmentService>(EnrollmentService);
    mockScheduleService = module.get(SCHDULE_SERVICE);
    mockEnrollmentRepository = module.get(ENROLLMENT_REPOSITORY);
  });

  describe('validEnrollment', () => {
    it('수강 인원이 가득 찼을 때 예외를 던져야 함', async () => {
      // Given
      const userId = 1;
      const scheduleId = 1;
      const lectureId = 1;
      mockEnrollmentRepository.findByScheduleId.mockResolvedValue(
        Array(30)
          .fill(null)
          .map(
            (_, index) =>
              new Enrollment({
                userId: index + 1,
                scheduleId: 1,
                lectureId: 1,
                enrolledAt: new Date(),
              }),
          ),
      );

      mockScheduleService.findById.mockResolvedValue(
        new Schedule({
          id: scheduleId,
          lectureId: lectureId,
          lectureStartedAt: new Date(),
          lectureEndedAt: new Date(),
          enrollmentCapacity: 30,
          currentEnrollmentCount: 30,
          status: SCHEDULE_STATUS.FULL,
        }),
      );

      // When & Then
      await expect(service.validEnrollment(userId, scheduleId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('이미 동일한 스케줄에 등록되어 있을 때 예외를 던져야 함', async () => {
      // Given
      const userId = 1;
      const scheduleId = 1;
      const lectureId = 1;

      mockEnrollmentRepository.findByScheduleId.mockResolvedValue([]);
      mockScheduleService.findById.mockResolvedValue(
        new Schedule({
          id: scheduleId,
          lectureId: lectureId,
          lectureStartedAt: new Date(),
          lectureEndedAt: new Date(),
          enrollmentCapacity: 30,
          currentEnrollmentCount: 1,
          status: SCHEDULE_STATUS.OPEN_SEATS,
        }),
      );
      mockEnrollmentRepository.findByUserId.mockResolvedValue([
        new Enrollment({
          userId: userId,
          scheduleId: scheduleId,
          lectureId: lectureId,
          enrolledAt: new Date(),
        }),
        new Enrollment({
          userId: userId,
          scheduleId: 13,
          lectureId: 2,
          enrolledAt: new Date(),
        }),
      ]);

      // When & Then
      await expect(service.validEnrollment(userId, scheduleId)).rejects.toThrow(
        BadRequestException,
      );
    });

    it('이미 동일한 강의에 등록되어 있을 때 예외를 던져야 함', async () => {
      // Given
      const userId = 1;
      const scheduleId = 1;
      const lectureId = 1;

      mockEnrollmentRepository.findByScheduleId.mockResolvedValue([]);
      mockScheduleService.findById.mockResolvedValue(
        new Schedule({
          id: scheduleId,
          lectureId: lectureId,
          lectureStartedAt: new Date(),
          lectureEndedAt: new Date(),
          enrollmentCapacity: 30,
          currentEnrollmentCount: 0,
          status: SCHEDULE_STATUS.OPEN_SEATS,
        }),
      );
      mockEnrollmentRepository.findByUserId.mockResolvedValue([
        new Enrollment({
          scheduleId: 2,
          lectureId: lectureId,
          userId: userId,
          enrolledAt: new Date(),
        }),
      ]);

      // When & Then
      await expect(service.validEnrollment(userId, scheduleId)).rejects.toThrow(
        BadRequestException,
      );
    });
  });

  describe('enroll', () => {
    it('수강 신청이 성공적으로 이루어져야 함', async () => {
      // Given
      const userId = 1;
      const scheduleId = 1;
      const lectureId = 1;
      const enrollmentData = {
        userId,
        scheduleId,
        lectureId,
        enrolledAt: expect.any(Date),
      };

      mockScheduleService.findById.mockResolvedValue(
        new Schedule({
          id: scheduleId,
          lectureId: lectureId,
          lectureStartedAt: new Date(),
          lectureEndedAt: new Date(),
          enrollmentCapacity: 30,
          currentEnrollmentCount: 0,
          status: SCHEDULE_STATUS.OPEN_SEATS,
        }),
      );
      mockEnrollmentRepository.enroll.mockResolvedValue(
        new Enrollment(enrollmentData),
      );

      // When
      const result = await service.enroll(userId, scheduleId);

      // Then
      expect(result).toBeInstanceOf(Enrollment);
      expect(mockEnrollmentRepository.enroll).toHaveBeenCalledWith(
        expect.objectContaining(enrollmentData),
      );
    });
  });
});
