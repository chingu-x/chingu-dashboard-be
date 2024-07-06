import { Module } from "@nestjs/common";
import { DevelopmentService } from "./development.service";
import { DevelopmentController } from "./development.controller";

@Module({
    controllers: [DevelopmentController],
    providers: [DevelopmentService],
})
export class DevelopmentModule {}
