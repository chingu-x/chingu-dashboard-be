import { Module } from '@nestjs/common';
import { IdeationService } from './ideation.service';
import { IdeationController } from './ideation.controller';

@Module({
  controllers: [IdeationController],
  providers: [IdeationService],
})
export class IdeationModule {}
