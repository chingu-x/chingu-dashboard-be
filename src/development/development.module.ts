import { Module } from "@nestjs/common";
import { DevelopmentService } from "./development.service";
import { DevelopmentController } from "./development.controller";
import { AppConfigModule } from "@/config/app/appConfig.module";

@Module({
    imports: [AppConfigModule],
    controllers: [DevelopmentController],
    providers: [DevelopmentService],
})
export class DevelopmentModule {}
