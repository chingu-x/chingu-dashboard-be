import { Module } from '@nestjs/common';
import { SprintsService } from './sprints.service';
import { SprintsController } from './sprints.controller';

@Module({
  controllers: [SprintsController],
  providers: [SprintsService],
})
export class SprintsModule {}
