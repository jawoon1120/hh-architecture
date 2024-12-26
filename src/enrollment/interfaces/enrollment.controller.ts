import { Body, Controller, Inject, Post } from '@nestjs/common';
import { CreateEnrollmentRequestDto } from './dto/create-enrollment.dto';
import {
  ENROLLMENT_FACADE_SERVICE,
  IEnrollmentFacadeService,
} from '../application/interface/enrollment-facade-service.interface';

@Controller('enrollment')
export class EnrollmentController {
  constructor(
    @Inject(ENROLLMENT_FACADE_SERVICE)
    private enrollmentFacadeService: IEnrollmentFacadeService,
  ) {}

  @Post()
  async enroll(@Body() body: CreateEnrollmentRequestDto) {
    return this.enrollmentFacadeService.enroll(body.userId, body.scheduleId);
  }
}
