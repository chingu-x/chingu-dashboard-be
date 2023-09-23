import { Module } from "@nestjs/common";
import { UserModule } from "./user/user.module";
import { PrismaModule } from "./prisma/prisma.module";
import { IdeationModule } from "./ideation/ideation.module";
import { TeamsModule } from './teams/teams.module';

@Module({
    imports: [UserModule, PrismaModule, IdeationModule, TeamsModule],
})
export class AppModule {}
