import { Module } from '@nestjs/common';
import { LectureController } from './interfaces/lecture.controller';
import { ScheduleService } from './application/schedule.service';
import { ScheduleRepository } from './infrastructure/schedule.repository';
import { SCHDULE_REPOSITORY } from './infrastructure/schedule-repository.interface';
import { SCHDULE_SERVICE } from './application/schedule-service.interface';

@Module({
  controllers: [LectureController],
  providers: [
    {
      provide: SCHDULE_REPOSITORY,
      useClass: ScheduleRepository,
    },
    {
      provide: SCHDULE_SERVICE,
      useClass: ScheduleService,
    },
  ],
  exports: [
    {
      provide: SCHDULE_SERVICE,
      useClass: ScheduleService,
    },
  ],
})
export class LectureModule {}
