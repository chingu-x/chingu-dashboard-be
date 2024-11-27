import { Module } from "@nestjs/common";
import { ScheduleModule } from "@nestjs/schedule";
import { APP_GUARD, RouterModule } from "@nestjs/core";
import { PrismaModule } from "./prisma/prisma.module";
import { TeamsModule } from "./teams/teams.module";
import { HealthCheckController } from "./HealthCheck/health-check.controller";
import { HealthCheckService } from "./HealthCheck/health-check.service";
import { UsersModule } from "./users/users.module";
import { SprintsModule } from "./sprints/sprints.module";
import { FormsModule } from "./forms/forms.module";
import { AuthModule } from "./auth/auth.module";
import { GlobalModule } from "./global/global.module";
import { ResourcesModule } from "./resources/resources.module";
import { TechsModule } from "./techs/techs.module";
import { FeaturesModule } from "./features/features.module";
import { IdeationsModule } from "./ideations/ideations.module";
import { JwtAuthGuard } from "./auth/guards/jwt-auth.guard";
import { TasksModule } from "./tasks/tasks.module";
import { VoyagesModule } from "./voyages/voyages.module";
import { AbilityModule } from "./ability/ability.module";
import { AbilitiesGuard } from "./auth/guards/abilities.guard";
import { DevelopmentModule } from "./development/development.module";

import { AppConfigModule } from "./config/app/appConfig.module";
import { MailConfigModule } from "./config/mail/mailConfig.module";
import { DbConfigModule } from "./config/database/dbConfig.module";
import { SoloProjectsModule } from "./solo-projects/solo-projects.module";

@Module({
    imports: [
        AppConfigModule,
        MailConfigModule,
        DbConfigModule,
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
                        path: "/",
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
        DevelopmentModule,
        SoloProjectsModule,
    ],
    controllers: [HealthCheckController],
    providers: [
        HealthCheckService,
        { provide: APP_GUARD, useClass: JwtAuthGuard },
        { provide: APP_GUARD, useClass: AbilitiesGuard },
    ],
})
export class AppModule {}
