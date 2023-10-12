import { Module } from "@nestjs/common";
import { TechsService } from "./techs.service";
import { TechsController } from "./techs.controller";
import { PrismaModule } from "../prisma/prisma.module";

@Module({
    controllers: [TechsController],
    providers: [TechsService],
    imports: [PrismaModule],
})
export class TechsModule {}
