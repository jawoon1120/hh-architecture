import { Controller } from '@nestjs/common';
import { LectureService } from '../application/schedule.service';

@Controller('lecture')
export class LectureController {
  constructor(private lectureService: LectureService) {}
}
