import { Module, Global } from '@nestjs/common';
import { GlobalService } from './global.service';
import { AuthService } from 'src/auth/auth.service';
import { PrismaModule } from 'src/prisma/prisma.module';

@Global()
@Module({
  providers: [GlobalService, AuthService],
  exports: [GlobalService, AuthService],
  imports: [PrismaModule],
})
export class GlobalModule {}
