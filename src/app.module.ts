import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LectureModule } from './lecture/lecture.module';

@Module({
  imports: [LectureModule],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
