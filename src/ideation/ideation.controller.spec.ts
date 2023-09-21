import { Test, TestingModule } from '@nestjs/testing';
import { IdeationController } from './ideation.controller';
import { IdeationService } from './ideation.service';

describe('IdeationController', () => {
  let controller: IdeationController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [IdeationController],
      providers: [IdeationService],
    }).compile();

    controller = module.get<IdeationController>(IdeationController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
