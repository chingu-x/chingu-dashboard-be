import { Module } from "@nestjs/common";
import { SoloProjectsService } from "./solo-projects.service";
import { SoloProjectsController } from "./solo-projects.controller";

@Module({
    controllers: [SoloProjectsController],
    providers: [SoloProjectsService],
})
export class SoloProjectsModule {}
