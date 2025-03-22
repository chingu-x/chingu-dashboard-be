import { Module } from "@nestjs/common";
import { IdeationsService } from "./ideations.service";
import { IdeationsController } from "./ideations.controller";
import { PrismaModule } from "../prisma/prisma.module";
import { APP_PIPE } from "@nestjs/core";
import { ValidationPipe } from "@nestjs/common";

@Module({
    controllers: [IdeationsController],
    providers: [
        IdeationsService,
        { provide: APP_PIPE, useClass: ValidationPipe },
    ],
    imports: [PrismaModule],
})
export class IdeationsModule {}
