import { Test, TestingModule } from '@nestjs/testing';
import { ScheduleService } from './schedule.service';
import { SCHDULE_REPOSITORY } from '../infrastructure/schedule-repository.interface';
import { Schedule } from '../domain/schedule.entity';
import { SCHEDULE_STATUS } from '../domain/schedule-status.enum';
import { Enrollment } from '@src/enrollment/domain/enrollment.entity';
import { Lecture } from '../domain/lecture.entity';

describe('ScheduleService', () => {
  let service: ScheduleService;
  let mockScheduleRepository: any;

  beforeEach(async () => {
    mockScheduleRepository = {
      findById: jest.fn(),
      findByDate: jest.fn(),
      updateScheduleStatusAndEnrollmentCount: jest.fn(),
    };

    const module: TestingModule = await Test.createTestingModule({
      providers: [
        ScheduleService,
        {
          provide: SCHDULE_REPOSITORY,
          useValue: mockScheduleRepository,
        },
      ],
    }).compile();

    service = module.get<ScheduleService>(ScheduleService);
  });

  describe('findById', () => {
    it('스케줄 ID로 스케줄을 찾을 수 있어야 함', async () => {
      // Given
      const scheduleId = 1;
      const mockSchedule = new Schedule({
        id: scheduleId,
        lectureId: 1,
        lectureStartedAt: new Date(),
        lectureEndedAt: new Date(),
        enrollmentCapacity: 30,
        currentEnrollmentCount: 0,
        status: SCHEDULE_STATUS.OPEN_SEATS,
      });

      mockScheduleRepository.findById.mockResolvedValue(mockSchedule);

      // When
      const result = await service.findById(scheduleId);

      // Then
      expect(result).toBe(mockSchedule);
    });
  });

  describe('findByDate', () => {
    it('날짜로 스케줄 목록을 찾을 수 있어야 함', async () => {
      // Given
      const date = new Date();
      const mockSchedules = [
        new Schedule({
          id: 1,
          lectureId: 1,
          lectureStartedAt: date,
          lectureEndedAt: new Date(date.getTime() + 3600000),
          enrollmentCapacity: 30,
          currentEnrollmentCount: 0,
          status: SCHEDULE_STATUS.OPEN_SEATS,
        }),
      ];

      mockScheduleRepository.findByDate.mockResolvedValue(mockSchedules);

      // When
      const result = await service.findByDate(date);

      // Then
      expect(result).toBe(mockSchedules);
    });
  });

  describe('updateScheduleStatusAndEnrollmentCount', () => {
    it('수강 인원이 가득 찼을 때 상태가 FULL로 변경되어야 함', async () => {
      // Given
      const scheduleId = 1;
      const currentEnrollmentCount = 30;
      const mockSchedule = new Schedule({
        id: scheduleId,
        lectureId: 1,
        lectureStartedAt: new Date(),
        lectureEndedAt: new Date(),
        enrollmentCapacity: 30,
        currentEnrollmentCount: 30,
        status: SCHEDULE_STATUS.OPEN_SEATS,
      });

      mockScheduleRepository.findById.mockResolvedValue(mockSchedule);

      // When
      await service.updateScheduleStatusAndEnrollmentCount(scheduleId);

      // Then
      expect(
        mockScheduleRepository.updateScheduleStatusAndEnrollmentCount,
      ).toHaveBeenCalledWith(
        scheduleId,
        SCHEDULE_STATUS.FULL,
        currentEnrollmentCount,
      );
    });

    it('수강 인원이 여유가 있을 때 상태가 OPEN_SEATS로 변경되어야 함', async () => {
      // Given
      const scheduleId = 1;
      const currentEnrollmentCount = 28;
      const mockSchedule = new Schedule({
        id: scheduleId,
        lectureId: 1,
        lectureStartedAt: new Date(),
        lectureEndedAt: new Date(),
        enrollmentCapacity: 30,
        currentEnrollmentCount: 28,
        status: SCHEDULE_STATUS.OPEN_SEATS,
      });

      mockScheduleRepository.findById.mockResolvedValue(mockSchedule);

      // When
      await service.updateScheduleStatusAndEnrollmentCount(scheduleId);

      // Then
      expect(
        mockScheduleRepository.updateScheduleStatusAndEnrollmentCount,
      ).toHaveBeenCalledWith(
        scheduleId,
        SCHEDULE_STATUS.OPEN_SEATS,
        currentEnrollmentCount,
      );
    });

    it('스케줄이 존재하지 않을 때 예외를 던져야 함', async () => {
      // Given
      const scheduleId = 999;

      mockScheduleRepository.findById.mockResolvedValue(null);

      // When & Then
      await expect(
        service.updateScheduleStatusAndEnrollmentCount(scheduleId),
      ).rejects.toThrow('Schedule not found');
    });
  });

  describe('findEnrollAvailableSchedule', () => {
    it('사용자가 이미 등록한 스케줄은 disabled가 true여야 함', async () => {
      // Given
      const userId = 1;
      const targetDate = new Date();
      const mockSchedules = [
        new Schedule({
          id: 1,
          lectureId: 1,
          lectureStartedAt: targetDate,
          lectureEndedAt: new Date(targetDate.getTime() + 3600000),
          enrollmentCapacity: 30,
          currentEnrollmentCount: 1,
          status: SCHEDULE_STATUS.OPEN_SEATS,
          enrollments: [
            new Enrollment({
              userId: userId,
              scheduleId: 1,
              lectureId: 1,
              enrolledAt: new Date(),
            }),
          ],
          lecture: new Lecture({
            title: '테스트 강의',
            instructor: '테스트 강사',
          }),
        }),
      ];

      mockScheduleRepository.findByDate.mockResolvedValue(mockSchedules);

      // When
      const result = await service.findEnrollAvailableSchedule(
        targetDate,
        userId,
      );

      // Then
      expect(result[0].disabled).toBe(true);
    });

    it('수강 정원이 가득 찬 스케줄은 disabled가 true여야 함', async () => {
      // Given
      const userId = 1;
      const targetDate = new Date();
      const mockSchedules = [
        new Schedule({
          id: 1,
          lectureId: 1,
          lectureStartedAt: targetDate,
          lectureEndedAt: new Date(targetDate.getTime() + 3600000),
          enrollmentCapacity: 30,
          currentEnrollmentCount: 30,
          status: SCHEDULE_STATUS.FULL,
          enrollments: [],
          lecture: new Lecture({
            title: '테스트 강의',
            instructor: '테스트 강사',
          }),
        }),
      ];

      mockScheduleRepository.findByDate.mockResolvedValue(mockSchedules);

      // When
      const result = await service.findEnrollAvailableSchedule(
        targetDate,
        userId,
      );

      // Then
      expect(result[0].disabled).toBe(true);
    });

    it('수강 가능한 스케줄은 disabled가 false여야 함', async () => {
      // Given
      const userId = 1;
      const targetDate = new Date();
      const mockSchedules = [
        new Schedule({
          id: 1,
          lectureId: 1,
          lectureStartedAt: targetDate,
          lectureEndedAt: new Date(targetDate.getTime() + 3600000),
          enrollmentCapacity: 30,
          currentEnrollmentCount: 15,
          status: SCHEDULE_STATUS.OPEN_SEATS,
          enrollments: [],
          lecture: new Lecture({
            title: '테스트 강의',
            instructor: '테스트 강사',
          }),
        }),
      ];

      mockScheduleRepository.findByDate.mockResolvedValue(mockSchedules);

      // When
      const result = await service.findEnrollAvailableSchedule(
        targetDate,
        userId,
      );

      // Then
      expect(result[0].disabled).toBe(false);
    });
  });
});
