import { Module } from '@nestjs/common';
import { LectureController } from './interfaces/lecture.controller';
import { LectureService } from './application/lecture.service';

@Module({
  controllers: [LectureController],
  providers: [LectureService],
})
export class LectureModule {}
