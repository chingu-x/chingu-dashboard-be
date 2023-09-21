import { Test, TestingModule } from '@nestjs/testing';
import { IdeationService } from './ideation.service';

describe('IdeationService', () => {
  let service: IdeationService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [IdeationService],
    }).compile();

    service = module.get<IdeationService>(IdeationService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
