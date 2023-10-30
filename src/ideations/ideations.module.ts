import { Module } from "@nestjs/common";
import { IdeationsService } from "./ideations.service";
import { IdeationsController } from "./ideations.controller";
import { PrismaModule } from "src/prisma/prisma.module";

@Module({
    controllers: [IdeationsController],
    providers: [IdeationsService],
    imports: [PrismaModule],
})
export class IdeationsModule {}
