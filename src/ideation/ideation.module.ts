import { Module } from "@nestjs/common";
import { IdeationService } from "./ideation.service";
import { IdeationController } from "./ideation.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    controllers: [IdeationController],
    providers: [IdeationService],
    imports: [PrismaModule],
})
export class IdeationModule {}
