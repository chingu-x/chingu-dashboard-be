import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { IdeationsModule } from "./ideations/ideations.module";
import { TeamsModule } from "./teams/teams.module";
import { TechsModule } from "./techs/techs.module";
import { HealthCheckController } from "./HealthCheck/health-check.controller";
import { HealthCheckService } from "./HealthCheck/health-check.service";
import { UsersModule } from "./users/users.module";
import { ResourcesModule } from "./resources/resources.module";
import { AuthModule } from "./auth/auth.module";
import { FeaturesModule } from "./features/features.module";
import { GlobalModule } from './global/global.module';

@Module({
    imports: [
        UsersModule,
        PrismaModule,
        IdeationsModule,
        TeamsModule,
        TechsModule,
        UsersModule,
        ResourcesModule,
        AuthModule,
        FeaturesModule,
        GlobalModule,
    ],
    controllers: [HealthCheckController],
    providers: [HealthCheckService],
})
export class AppModule {}
