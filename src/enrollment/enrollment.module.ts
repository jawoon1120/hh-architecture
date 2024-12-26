import { Module } from '@nestjs/common';
import { EnrollmentController } from './interfaces/enrollment.controller';
import { EnrollmentService } from './application/enrollment.service';

@Module({
  controllers: [EnrollmentController],
  providers: [EnrollmentService],
})
export class EnrollmentModule {}
