import { Module } from '@nestjs/common';
import { LectureController } from './interfaces/lecture.controller';
import { LectureService } from './application/schedule.service';
import { LectureRepository } from './infrastructure/schedule.repository';
import { SCHDULE_REPOSITORY } from './infrastructure/schedule-repository.interface';
import { SCHDULE_SERVICE } from './application/schedule-service.interface';

@Module({
  controllers: [LectureController],
  providers: [
    LectureService,
    {
      provide: SCHDULE_REPOSITORY,
      useClass: LectureRepository,
    },
    {
      provide: SCHDULE_SERVICE,
      useClass: LectureService,
    },
  ],
  exports: [
    {
      provide: SCHDULE_SERVICE,
      useClass: LectureService,
    },
  ],
})
export class LectureModule {}
