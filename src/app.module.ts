import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { LectureModule } from './lecture/lecture.module';
import { EnrollmentModule } from './enrollment/enrollment.module';
import { ConfigModule } from '@nestjs/config';
import { AppConfigService } from './configs/config.service';

const domainModules = [LectureModule, EnrollmentModule];

@Module({
  imports: [
    ConfigModule.forRoot(AppConfigService.getConfigModuleOptions()),
    ...domainModules,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
