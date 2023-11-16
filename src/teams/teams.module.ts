import { Module } from "@nestjs/common";
import { TeamsService } from "./teams.service";
import { TeamsController } from "./teams.controller";
import { RouterModule } from "@nestjs/core";
import { ResourcesModule } from "src/resources/resources.module";
import { TechsModule } from "src/techs/techs.module";
import { FeaturesModule } from "src/features/features.module";
import { IdeationsModule } from "src/ideations/ideations.module";

@Module({
    imports: [
        RouterModule.register([{
          path: 'teams',
          children: [
            { path: ':teamId/resources', module: ResourcesModule },
            { path: ':teamId/techs', module: TechsModule },
            { path: '/', module: FeaturesModule },
            { path: ':teamId/ideations', module: IdeationsModule },
          ],
        }]),
        ResourcesModule,
        TechsModule,  
        FeaturesModule,
        IdeationsModule,
      ],
    controllers: [TeamsController],
    providers: [TeamsService],
})
export class TeamsModule {}
