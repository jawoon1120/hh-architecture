import { Module } from '@nestjs/common';
import { EnrollmentController } from './interfaces/enrollment.controller';
import { EnrollmentFacadeService } from './application/enrollment.facade-service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Enrollment } from './domain/enrollment.entity';
import { LectureModule } from '@src/lecture/lecture.module';
import { EnrollmentRepository } from './infrastructure/enrollment.repository';
import { ENROLLMENT_REPOSITORY } from './infrastructure/enrollment-repository.interface';
import { ENROLLMENT_SERVICE } from './application/interface/enrollment-service.interface';
import { ENROLLMENT_FACADE_SERVICE } from './application/interface/enrollment-facade-service.interface';
import { EnrollmentService } from './application/enrollment.service';

@Module({
  imports: [TypeOrmModule.forFeature([Enrollment]), LectureModule],
  controllers: [EnrollmentController],
  providers: [
    {
      provide: ENROLLMENT_FACADE_SERVICE,
      useClass: EnrollmentFacadeService,
    },
    {
      provide: ENROLLMENT_SERVICE,
      useClass: EnrollmentService,
    },
    {
      provide: ENROLLMENT_REPOSITORY,
      useClass: EnrollmentRepository,
    },
  ],
})
export class EnrollmentModule {}
