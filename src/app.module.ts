import { Module } from "@nestjs/common";
import { PrismaModule } from "./prisma/prisma.module";
import { TeamsModule } from "./teams/teams.module";
import { HealthCheckController } from "./HealthCheck/health-check.controller";
import { HealthCheckService } from "./HealthCheck/health-check.service";
import { UsersModule } from "./users/users.module";
import { SprintsModule } from "./sprints/sprints.module";
import { FormsModule } from "./forms/forms.module";
import { AuthModule } from "./auth/auth.module";
import { GlobalModule } from "./global/global.module";

@Module({
    imports: [
        UsersModule,
        PrismaModule,
        TeamsModule,
        SprintsModule,
        FormsModule,
        AuthModule,
        GlobalModule,
    ],
    controllers: [HealthCheckController],
    providers: [HealthCheckService],
})
export class AppModule {}
