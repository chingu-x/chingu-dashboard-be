import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { IdeationModule } from "./ideation/ideation.module";
import { TeamsModule } from "./teams/teams.module";
import { TechsModule } from "./techs/techs.module";
import { HealthCheckController } from "./HealthCheck/health-check.controller";
import { HealthCheckService } from "./HealthCheck/health-check.service";
import { UsersModule } from "./users/users.module";
import { SprintsModule } from './sprints/sprints.module';

@Module({
    imports: [
        UsersModule,
        PrismaModule,
        IdeationModule,
        TeamsModule,
        TechsModule,
        UsersModule,
        SprintsModule,
    ],
    controllers: [HealthCheckController],
    providers: [HealthCheckService],
})
export class AppModule {}
