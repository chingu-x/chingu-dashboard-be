import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { IdeationModule } from "./ideation/ideation.module";
import { TeamsModule } from './teams/teams.module';
import { TechsModule } from './techs/techs.module';

@Module({
    imports: [UserModule, PrismaModule, IdeationModule, TeamsModule, TechsModule],
})
export class AppModule {}
