import { Test, TestingModule } from '@nestjs/testing';
import { EnrollmentFacadeService } from './enrollment.facade-service';

describe('EnrollmentFacadeService', () => {
  let service: EnrollmentFacadeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [EnrollmentFacadeService],
    }).compile();

    service = module.get<EnrollmentFacadeService>(EnrollmentFacadeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
