import { Test, TestingModule } from '@nestjs/testing';
import { LectureService } from './schedule.service';

describe('LectureService', () => {
  let service: LectureService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LectureService],
    }).compile();

    service = module.get<LectureService>(LectureService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
