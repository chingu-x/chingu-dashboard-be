import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { IdeationModule } from "./ideation/ideation.module";
import { TeamsModule } from './teams/teams.module';
import { HealthCheckController } from "./HealthCheck/health-check.controller";
import { HealthCheckService } from "./HealthCheck/health-check.service";

@Module({
    imports: [UserModule, PrismaModule, IdeationModule, TeamsModule],
    controllers: [HealthCheckController],
    providers: [HealthCheckService],
})
export class AppModule {}
