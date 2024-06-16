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
import { APP_GUARD, RouterModule } from "@nestjs/core";
import { ResourcesModule } from "./resources/resources.module";
import { TechsModule } from "./techs/techs.module";
import { FeaturesModule } from "./features/features.module";
import { IdeationsModule } from "./ideations/ideations.module";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { ScheduleModule } from "@nestjs/schedule";
import { TasksModule } from "./tasks/tasks.module";
import { VoyagesModule } from "./voyages/voyages.module";
import { AbilityModule } from "./ability/ability.module";
import { AbilitiesGuard } from "./auth/guards/abilities.guard";

@Module({
    imports: [
        RouterModule.register([
            {
                path: "voyages",
                children: [
                    {
                        path: "/",
                        module: ResourcesModule,
                    },
                    { path: "/", module: TechsModule },
                    { path: "/", module: FeaturesModule },
                    {
                        path: "teams/:teamId/ideations",
                        module: IdeationsModule,
                    },
                    { path: "sprints", module: SprintsModule },
                ],
            },
        ]),
        UsersModule,
        PrismaModule,
        TeamsModule,
        ResourcesModule,
        TechsModule,
        FeaturesModule,
        IdeationsModule,
        SprintsModule,
        FormsModule,
        AuthModule,
        GlobalModule,
        ScheduleModule.forRoot(),
        TasksModule,
        VoyagesModule,
        AbilityModule,
    ],
    controllers: [HealthCheckController],
    providers: [
        HealthCheckService,
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: AbilitiesGuard },
    ],
})
export class AppModule {}
