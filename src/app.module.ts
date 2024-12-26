import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LectureModule } from './lecture/lecture.module';
import { EnrollmentModule } from './enrollment/enrollment.module';

@Module({
  imports: [LectureModule, EnrollmentModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
