import { Controller } from '@nestjs/common';
import { ScheduleService } from '../application/schedule.service';

@Controller('lecture')
export class LectureController {
  constructor(private lectureService: ScheduleService) {}
}
