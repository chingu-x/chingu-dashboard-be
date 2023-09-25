import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { HealthCheckController } from "./HealthCheck/health-check.controller";
import { HealthCheckService } from "./HealthCheck/health-check.service";

@Module({
    imports: [UserModule, PrismaModule],
    controllers: [HealthCheckController],
    providers: [HealthCheckService],
})
export class AppModule {}
