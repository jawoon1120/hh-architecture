import { Controller, Get, Inject, Query } from '@nestjs/common';
import {
  IScheduleService,
  SCHDULE_SERVICE,
} from '../application/schedule-service.interface';
import { AvailableScheduleDto } from '../application/dto/available-schedule.dto';

@Controller('lecture')
export class LectureController {
  constructor(
    @Inject(SCHDULE_SERVICE) private scheduleService: IScheduleService,
  ) {}

  @Get('schedule')
  async getSchedule(
    @Query('targetDate') targetDate: Date,
    @Query('userId') userId: number,
  ): Promise<AvailableScheduleDto[]> {
    return await this.scheduleService.findEnrollAvailableSchedule(
      targetDate,
      userId,
    );
  }
}
