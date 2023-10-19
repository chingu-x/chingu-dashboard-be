import { Module } from '@nestjs/common';
import { ResourcesService } from './resources.service';
import { ResourcesController } from './resources.controller';
import { PrismaModule } from 'src/prisma/prisma.module';

@Module({
  controllers: [ResourcesController],
  providers: [ResourcesService],
  imports: [PrismaModule],
})
export class ResourcesModule {}
