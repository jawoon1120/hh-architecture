import { Test } from '@nestjs/testing';
import { DataSource } from 'typeorm';
import { EnrollmentFacadeService } from './enrollment.facade-service';
import { Schedule } from '@src/lecture/domain/schedule.entity';
import { Enrollment } from '../domain/enrollment.entity';
import { SCHEDULE_STATUS } from '@src/lecture/domain/schedule-status.enum';
import { ENROLLMENT_FACADE_SERVICE } from './interface/enrollment-facade-service.interface';
import { AppConfigService } from '@src/configs/config.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { LectureModule } from '@src/lecture/lecture.module';
import { EnrollmentModule } from '../enrollment.module';
import { ConfigModule } from '@nestjs/config';

describe('EnrollmentFacadeService Integration Test', () => {
  let enrollmentFacadeService: EnrollmentFacadeService;
  let dataSource: DataSource;

  beforeAll(async () => {
    const moduleFixture = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          envFilePath: AppConfigService.getEnvFilePath(),
          isGlobal: true,
        }),
        TypeOrmModule.forRootAsync(
          AppConfigService.getTypeOrmModuleConfigsForTest(),
        ),
        EnrollmentModule,
        LectureModule,
      ],
    }).compile();

    enrollmentFacadeService = moduleFixture.get<EnrollmentFacadeService>(
      ENROLLMENT_FACADE_SERVICE,
    );
    dataSource = moduleFixture.get<DataSource>(DataSource);
  });

  describe('동시성 테스트', () => {
    it('40명이 동시에 수강 신청할 때 정원(30명)을 초과하지 않아야 함', async () => {
      // Given
      const scheduleId = 1;

      const TOTAL_USERS = 40;
      const userIds = Array.from({ length: TOTAL_USERS }, (_, i) => i + 1);
      console.log(userIds);
      // When: 40명이 동시에 수강 신청
      const enrollmentPromises = userIds.map((userId) =>
        enrollmentFacadeService.enroll(userId, scheduleId),
      );

      const results = await Promise.allSettled(enrollmentPromises);

      // Then
      const successfulEnrollments = results.filter(
        (result) => result.status === 'fulfilled',
      );
      const failedEnrollments = results.filter(
        (result) => result.status === 'rejected',
      );

      // 정확히 30명만 성공해야 함
      expect(successfulEnrollments).toHaveLength(30);
      // 나머지 10명은 실패해야 함
      expect(failedEnrollments).toHaveLength(10);

      // DB에서 최종 상태 확인
      const finalSchedule = await dataSource
        .getRepository(Schedule)
        .findOne({ where: { id: scheduleId } });

      expect(finalSchedule.currentEnrollmentCount).toBe(30);
      expect(finalSchedule.status).toBe(SCHEDULE_STATUS.FULL);

      // 실제로 등록된 수강 신청 수 확인
      const actualEnrollments = await dataSource
        .getRepository(Enrollment)
        .find({ where: { scheduleId: scheduleId } });

      expect(actualEnrollments).toHaveLength(30);
    }, 50000); // 타임아웃 30초로 설정
  });
  afterAll(async () => {
    await dataSource.destroy();
  });
});
